import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { BryntumGanttComponent } from '@bryntum/gantt-angular';
import { Gantt, Toast } from '@bryntum/gantt';
import ganttProps from './gantt.config';
import { DataService } from '../services/data.service';

// Extend the Gantt type to include our custom property
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

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.loadInitialData();
    }

    private loadInitialData() {
        console.log('Starting loadInitialData...');
        const params = {
            project: '66300cee23006656a617f366',
            timezone: 'Asia/Calcutta',
        };
        console.log('Request params:', params);

        this.dataService.get<any>('project-plan').subscribe({
            next: (response) => {
                console.log('Response received:', response);
                if (response) {
                    // We have data, load it into the Gantt
                    const gantt = this.ganttComponent.instance;
                    gantt.project.loadInlineData(response.data);
                } else {
                    // No data available, show import modal
                    this.showImportModal = true;
                }
            },
            error: (error) => {
                console.error('Error details:', {
                    status: error.status,
                    message: error.message,
                    error: error.error,
                });
                this.showImportModal = true;
            },
        });
    }

    ngAfterViewInit(): void {
        // Get the gantt instance
        const gantt = this.ganttComponent.instance;

        // Expose the component to the gantt instance
        gantt.angularComponent = this;

        // Listen for task store changes
        gantt.taskStore.on({
            change: ({ record, changes }) => {
                if (changes) {
                    this.changedCells.push({
                        taskId: record.id,
                        changes: changes,
                    });
                    console.log('Changed cells:', this.changedCells);
                }
            },
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

    // New method to handle toolbar actions
    handleToolbarAction(action: string, data?: any) {
        console.log('Toolbar action:', action, data);
        switch (action) {
            case 'getChangedCells':
                return this.getChangedCells();
            case 'importPlan':
                this.showImportModal = true;
                break;
            default:
                console.warn('Unknown toolbar action:', action);
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

        this.dataService.post<any>('project-plan/import', data).subscribe({
            next: (response) => {
                console.log('Import response:', response);
                // Load the new data
                gantt.project.loadInlineData(response.data);
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
}
