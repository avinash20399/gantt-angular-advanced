import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { BryntumGanttComponent } from '@bryntum/gantt-angular';
import { Gantt, Toast, Button } from '@bryntum/gantt';
import ganttProps from './gantt.config';
import { DataService } from '../services/data.service';

interface TaskChange {
    taskId: number | string;
    wbs: string;
    changes: any[];
    timestamp: Date;
    type: 'update' | 'add' | 'remove';  // Added type to track operation type
}

// Extend the Gantt type to includtriggerGanttActione our custom property
declare module '@bryntum/gantt' {
    interface Gantt {
        angularComponent?: GanttComponent;
    }
}

@Component({
    selector: 'app-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss'],
})
export class GanttComponent implements AfterViewInit, OnInit {
    @ViewChild('gantt') ganttComponent: BryntumGanttComponent;
    ganttProps = ganttProps;
    changedCells: any[] = [];
    showImportModal = false;
    isEditMode = false;
    private taskChanges: Map<number | string, TaskChange[]> = new Map();
    
    // Field mapping configuration for new tasks
    private newTaskFieldMapping = {
        name: (value: any) => value,  // Pass through
        startDate: (value: any) => value,  // Pass through
        duration: (value: any) => value || 1,  // Default to 1
        percentDone: (value: any) => value || 0,  // Default to 0
        schedulingMode: (value: any) => value || 'FixedDuration',
        constraintType: (value: any) => value || 'startNoEarlierThan',
        calendar: (value: any) => value || 'general',
        status: (value: any) => value || 'Not Started'
        // Add more field mappings as needed
    };

    constructor(private dataService: DataService) {}

    ngOnInit() {
        // Initialization moved to ngAfterViewInit
    }

    private initializeEditingFeatures() {
        const gantt = this.ganttComponent.instance;
        
        // Disable editing features by default
        gantt.features.cellEdit.disabled = true;
        gantt.features.taskEdit.disabled = true;
        gantt.features.dependencies.disabled = true;
        
        // Update the edit button state in the toolbar
        const toolbar = gantt.tbar;
        if (toolbar) {
            const editButton = toolbar.widgetMap.editModeButton as Button;
            if (editButton) {
                editButton.pressed = false;
            }
        }
    }

    private getDemoData() {
        return {
            tasks: {
                rows: [
                    {
                        id: 1,
                        name: 'Project Kickoff',
                        startDate: '2024-03-25',
                        duration: 1,
                        percentDone: 100,
                        expanded: true,
                        schedulingMode: 'FixedDuration',
                        constraintType: 'mustStartOn',
                        constraintDate: '2024-03-25',
                        calendar: 'general',
                        deadline: '2024-03-26',
                        status: 'Done',
                        resourceId: [1, 2]  // Multiple resources assigned
                    },
                    {
                        id: 2,
                        name: 'Planning Phase',
                        startDate: '2024-03-26',
                        duration: 5,
                        percentDone: 70,
                        expanded: true,
                        schedulingMode: 'FixedDuration',
                        constraintType: 'startNoEarlierThan',
                        constraintDate: '2024-03-26',
                        calendar: 'general',
                        deadline: '2024-03-31',
                        status: 'In Progress',
                        children: [
                            {
                                id: 21,
                                name: 'Requirements Gathering',
                                startDate: '2024-03-26',
                                duration: 3,
                                percentDone: 100,
                                schedulingMode: 'FixedDuration',
                                constraintType: 'mustStartOn',
                                constraintDate: '2024-03-26',
                                calendar: 'general',
                                deadline: '2024-03-29',
                                status: 'Done',
                                resourceId: 1
                            },
                            {
                                id: 22,
                                name: 'Design Planning',
                                startDate: '2024-03-29',
                                duration: 2,
                                percentDone: 40,
                                schedulingMode: 'FixedDuration',
                                constraintType: 'startNoEarlierThan',
                                constraintDate: '2024-03-29',
                                calendar: 'general',
                                deadline: '2024-03-31',
                                status: 'In Progress',
                                resourceId: 2
                            }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Development Phase',
                        startDate: '2024-04-01',
                        duration: 10,
                        percentDone: 20,
                        expanded: true,
                        schedulingMode: 'FixedDuration',
                        constraintType: 'startNoEarlierThan',
                        constraintDate: '2024-04-01',
                        calendar: 'general',
                        deadline: '2024-04-15',
                        status: 'In Progress',
                        children: [
                            {
                                id: 31,
                                name: 'Frontend Development',
                                startDate: '2024-04-01',
                                duration: 7,
                                percentDone: 30,
                                schedulingMode: 'FixedDuration',
                                constraintType: 'startNoEarlierThan',
                                constraintDate: '2024-04-01',
                                calendar: 'general',
                                deadline: '2024-04-10',
                                status: 'In Progress',
                                resourceId: [3, 4]  // Multiple resources assigned
                            },
                            {
                                id: 32,
                                name: 'Backend Development',
                                startDate: '2024-04-01',
                                duration: 8,
                                percentDone: 10,
                                schedulingMode: 'FixedDuration',
                                constraintType: 'startNoEarlierThan',
                                constraintDate: '2024-04-01',
                                calendar: 'general',
                                deadline: '2024-04-12',
                                status: 'In Progress',
                                resourceId: [4, 5]  // Multiple resources assigned
                            }
                        ]
                    }
                ]
            },
            dependencies: [
                { id: 1, fromTask: 1, toTask: 2, type: 2 },  // Finish-to-Start
                { id: 2, fromTask: 21, toTask: 22, type: 2 },
                { id: 3, fromTask: 2, toTask: 3, type: 2 }
            ],
            resources: {
                rows: [
                    { id: 1, name: 'John Smith', role: 'Business Analyst', image: 'assets/avatars/user1.jpg' },
                    { id: 2, name: 'Sarah Johnson', role: 'UX Designer', image: 'assets/avatars/user2.jpg' },
                    { id: 3, name: 'Michael Chen', role: 'Frontend Developer', image: 'assets/avatars/user3.jpg' },
                    { id: 4, name: 'Emily Davis', role: 'Backend Developer', image: 'assets/avatars/user4.jpg' },
                    { id: 5, name: 'David Wilson', role: 'Backend Developer', image: 'assets/avatars/user5.jpg' }
                ]
            },
            timeRanges: [
                {
                    id: 1,
                    name: 'Project Deadline',
                    startDate: '2024-04-15',
                    cls: 'deadline-line'
                }
            ],
            calendars: [
                {
                    id: 'general',
                    name: 'General',
                    intervals: [
                        {
                            recurrentStartDate: 'on Sat at 0:00',
                            recurrentEndDate: 'on Mon at 0:00',
                            isWorking: false
                        }
                    ]
                }
            ]
        };
    }

    private loadInitialData() {
        console.log('Starting loadInitialData...');
        const params = {
            project: '66300cee23006656a617f366',
            timezone: 'Asia/Calcutta',
        };
        console.log('Request params:', params);
        const gantt = this.ganttComponent.instance;
        console.log('Gantt instance:', this.ganttComponent.instance);
        this.dataService.get<any>('project-plan').subscribe({
            next: (response) => {
                console.log('Response received:', response);
                if (response && response.data) {
                    // We have data, load it into the Gantt
                    const gantt = this.ganttComponent.instance;
                    console.log('Gantt instance:', this.ganttComponent.instance);
                    //gantt.project.loadInlineData(response.data);
                    this.updateBrytummGanttData(response.data);
                } else {
                    this.showImportModal = true;
                }
            },
            error: (error) => {
                console.error('Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error,
                });
                //uncomment this to show the import modal
                //this.showImportModal = true; 
                Toast.show({
                    html: 'Something went wrong, please try again!',
                    cls: 'b-red b-toast',
                    timeout: 3000,
                    side: 'top-end',
                });
                //comment this to show the import modal
                this.updateBrytummGanttData(this.getDemoData());
            },
        });
    }
    updateBrytummGanttData(simulationData: any) {
        console.log('Updating Brytumm Gantt data:', simulationData);
        const gantt = this.ganttComponent.instance;
        console.log('Gantt instance:', gantt.project.taskStore);
        if (gantt.project) {
            // Update tasks with proper handling of empty data
            gantt.project.taskStore.data = simulationData.tasks?.rows || [];

            // Update resources
            gantt.project.resourceStore.data = simulationData.resources?.rows || [];

            // Update assignments (resource assignments to tasks)
            gantt.project.assignmentStore.data = simulationData.assignments?.rows || [];

            // Update dependencies between tasks
            gantt.project.dependencyStore.data = simulationData.dependencies?.rows || [];

            // Update calendars if provided
            if (simulationData.calendars) {
                gantt.project.calendarManagerStore.data = simulationData.calendars;
            }

            // Update time ranges (like project deadlines, milestones)
            if (simulationData.timeRanges) {
                gantt.project.timeRangeStore.data = simulationData.timeRanges;
            }

            // Update project configuration if provided
            if (simulationData.project) {
                // Update project specific settings
                if (simulationData.project.startDate) {
                    gantt.project.startDate = simulationData.project.startDate;
                }
                if (simulationData.project.endDate) {
                    gantt.project.endDate = simulationData.project.endDate;
                }
                if (simulationData.project.calendar) {
                    gantt.project.calendar = simulationData.project.calendar;
                }
                if (simulationData.project.hoursPerDay) {
                    gantt.project.hoursPerDay = simulationData.project.hoursPerDay;
                }
                if (simulationData.project.daysPerWeek) {
                    gantt.project.daysPerWeek = simulationData.project.daysPerWeek;
                }
                if (simulationData.project.daysPerMonth) {
                    gantt.project.daysPerMonth = simulationData.project.daysPerMonth;
                }
            }

            // Commit changes asynchronously
            gantt.project.commitAsync().then(() => {
                // If there are tasks, fit them into view
                if (simulationData.tasks?.rows?.length > 0) {
                    gantt.zoomToFit({
                        leftMargin: 50,
                        rightMargin: 50
                    });
                }
            });
        } else {
            console.warn("Gantt or its stores not fully ready");
        }
    }

    ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
        const gantt = this.ganttComponent.instance;
        gantt.angularComponent = this;
        this.initializeEditingFeatures();
        this.loadInitialData();

        // Listen for task store changes
        gantt.taskStore.on({
            add: ({ records }) => {
                console.log('add', records);
                if (this.isEditMode) {
                    records.forEach(record => {
                        const taskId = record.id;
                        const mappedData = this.applyFieldMappings(record.data);
                        
                        const change: TaskChange = {
                            taskId,
                            wbs: record.wbsCode ?? '',
                            changes: [mappedData],
                            timestamp: new Date(),
                            type: 'add'
                        };
                        console.log("change:", change);
                        const existingChanges = this.taskChanges.get(taskId) || [];
                        this.taskChanges.set(taskId, [...existingChanges, change]);
                        
                        console.log('Task added:', { taskId, mappedData,change });
                        console.log("taskChanges:", this.taskChanges);
                    });
                }
            },
            remove: ({ records }) => {
                if (this.isEditMode) {
                    records.forEach(record => {
                        const taskId = record.id;
                        
                        const change: TaskChange = {
                            taskId,
                            wbs: record.wbsCode ?? '',
                            changes: [{ id: taskId }],
                            timestamp: new Date(),
                            type: 'remove'
                        };

                        const existingChanges = this.taskChanges.get(taskId) || [];
                        this.taskChanges.set(taskId, [...existingChanges, change]);
                        
                        console.log('Task removed:', taskId);
                    });
                }
            },
            change: ({ record, changes }) => {
                if (changes && this.isEditMode) {
                    console.log('record', record);
                    console.log('Changes:', changes);
                    
                    const taskId = record.id;
                    const change: TaskChange = {
                        taskId,
                        wbs: record.wbsCode ?? '',
                        changes: [changes],
                        timestamp: new Date(),
                        type: 'update'
                    };

                    const existingChanges = this.taskChanges.get(taskId) || [];
                    this.taskChanges.set(taskId, [...existingChanges, change]);

                    this.changedCells.push({
                        taskId: record.id,
                        wbs: record.wbsCode ?? '',
                        changes: changes,
                    });
                    console.log('Changed cells:', this.changedCells);
                    console.log('Task changes history:', this.taskChanges);
                }
            }
        });

        // Listen for sync events
        gantt.project.on({
            sync: ({ success, response }) => {
                if (success) {
                    console.log('Data synced successfully:', response);
                } else {
                    console.error('Sync failed:', response);
                }
            },
        });
    }

    getChangedCells() {
        return this.changedCells;
    }

    // Handle toolbar actions
    handleToolbarAction(action: string, data?: any) {
        console.log('Toolbar action:', action, data);
        switch (action) {
            case 'getChangedCells':
                return this.getChangedCells();
            case 'importPlan':
                this.showImportModal = true;
                break;
            case 'plainSearch':
                this.handleSearch(data);
                break;
            case 'toggleEdit':
                this.toggleEditMode();
                break;
            case 'savePlan':
                this.savePlan();
                break;
            default:
                console.warn('Unknown toolbar action:', action);
        }
    }

    private handleSearch(searchText: string) {
        const gantt = this.ganttComponent.instance;
        if (!searchText) {
            // Clear filters if search text is empty
            gantt.taskStore.clearFilters();
        } else {
            // Create a case-insensitive filter for task names
            gantt.taskStore.filter({
                filters: task => task.name && task.name.toLowerCase().includes(searchText.toLowerCase()),
                replace: true
            });
        }
    }

    // Handle import modal close
    onImportModalClose() {
        this.showImportModal = false;
    }

    // Handle import data
    onImportData(data: any) {
        console.log('Import data:', data);

        // Show loading overlay
        const gantt = this.ganttComponent.instance;
        gantt.maskBody('Importing project plan...');
        const payload = {
            "data":data
        };
        this.dataService.post<any>('project-plan/import', payload).subscribe({
            next: (response) => {
                console.log('Import response:', response);
                // Load the new data
                //gantt.project.loadInlineData(response.data);
                this.updateBrytummGanttData(response.data);
                // Hide loading overlay
                gantt.unmaskBody();
                // Close modal
                this.showImportModal = false;
                // Show success message
                Toast.show({
                    html: 'Project plan imported successfully!',
                    cls: 'b-green b-toast',
                    timeout: 3000,
                    side: 'top-end',
                });
            },
            error: (error) => {
                console.error('Error importing data:', error);
                // Hide loading overlay
                gantt.unmaskBody();
                this.showImportModal = false;
                // Show error message
                Toast.show({
                    html: 'Failed to import project plan. Please try again.',
                    cls: 'b-red b-toast',
                    timeout: 5000,
                    side: 'top-end',
                });
            },
        });
    }

    openImportModal() {
        this.showImportModal = true;
    }

    // Toggle edit mode
    toggleEditMode() {
        const gantt = this.ganttComponent.instance;
        this.isEditMode = !this.isEditMode;
        
        // Enable/disable editing features based on mode
        gantt.features.cellEdit.disabled = !this.isEditMode;
        gantt.features.taskEdit.disabled = !this.isEditMode;
        gantt.features.dependencies.disabled = !this.isEditMode;
        
        // Update toolbar button states
        const toolbar = gantt.tbar;
        if (toolbar) {
            const editButton = toolbar.widgetMap.editModeButton as Button;
            const saveButton = toolbar.widgetMap.savePlanButton as Button;
            
            if (editButton) {
                editButton.pressed = this.isEditMode;
            }
            
            if (saveButton) {
                saveButton.disabled = !this.isEditMode;
            }
        }
        
        // Show toast notification
        Toast.show({
            html: `Edit mode ${this.isEditMode ? 'enabled' : 'disabled'}`,
            cls: `b-${this.isEditMode ? 'green' : 'blue'} b-toast`,
            timeout: 3000,
            side: 'top-end',
        });
    }

    // Method to update field mapping
    updateFieldMapping(field: string, mappingFn: (value: any) => any) {
        this.newTaskFieldMapping[field] = mappingFn;
    }

    // Method to apply field mappings to a new task
    private 
    applyFieldMappings(taskData: any): any {
        const mappedData = { ...taskData };
        Object.keys(this.newTaskFieldMapping).forEach(field => {
            if (field in taskData) {
                mappedData[field] = this.newTaskFieldMapping[field](taskData[field]);
            }
        });
        return mappedData;
    }

    // Save plan with all changes
    savePlan() {
        const gantt = this.ganttComponent.instance;
        gantt.maskBody('Saving project plan...');

        // Process all tasks and their changes
        const processedTasks = new Map();
        console.log("taskChanges at savePlan:", this.taskChanges);

        Array.from(this.taskChanges.entries()).forEach(([taskId, changes]) => {
            console.log("changes:", changes);
            console.log("taskId:", taskId);
            
            // Sort changes by timestamp
            const sortedChanges = changes.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
            console.log("sortedChanges:", sortedChanges);

            // Track the latest change for each field
            const fieldChanges = new Map();
            
            // Process all changes chronologically to build up the final state
            sortedChanges.forEach(change => {
                if (change.type === 'add') {
                    // For add operations, set initial values for all fields
                    const initialData = change.changes[0];
                    Object.entries(initialData).forEach(([field, value]) => {
                        fieldChanges.set(field, {
                            value,
                            timestamp: change.timestamp,
                            operation: 'insert'
                        });
                    });
                } else if (change.type === 'update') {
                    // For updates, only override the specific fields that changed
                    const updateData = change.changes[0];
                    Object.entries(updateData).forEach(([field, value]) => {
                        fieldChanges.set(field, {
                            value,
                            timestamp: change.timestamp,
                            operation: 'update'
                        });
                    });
                }
            });

            // Get the last change to determine if the task was deleted
            const lastChange = sortedChanges[sortedChanges.length - 1];

            if (lastChange.type === 'remove') {
                // If the task was deleted, mark it as deleted
                processedTasks.set(taskId, {
                    taskId,
                    operation: 'delete'
                });
            } else {
                // Construct the final task state from field changes
                const finalChanges = {};
                const isNewTask = sortedChanges[0].type === 'add';
                
                fieldChanges.forEach((changeInfo, field) => {
                    finalChanges[field] = changeInfo.value;
                });

                processedTasks.set(taskId, {
                    taskId,
                    operation: isNewTask ? 'insert' : 'update',
                    [isNewTask ? 'data' : 'changes']: finalChanges
                });
            }
        });

        const payload = {
            tasks: Array.from(processedTasks.values()),
            projectId: '66300cee23006656a617f366'
        };

        console.log("Saving payload:", payload);

        this.dataService.post<any>('project-plan/save', payload).subscribe({
            next: (response) => {
                console.log('Save response:', response);
                this.taskChanges.clear();
                this.changedCells = [];
                gantt.unmaskBody();
                
                Toast.show({
                    html: 'Project plan saved successfully!',
                    cls: 'b-green b-toast',
                    timeout: 3000,
                    side: 'top-end',
                });
            },
            error: (error) => {
                console.error('Error saving plan:', error);
                gantt.unmaskBody();
                
                Toast.show({
                    html: 'Failed to save project plan. Please try again.',
                    cls: 'b-red b-toast',
                    timeout: 5000,
                    side: 'top-end',
                });
            },
        });
    }
}
