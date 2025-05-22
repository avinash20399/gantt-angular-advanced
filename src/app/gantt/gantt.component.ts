import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { BryntumGanttComponent } from '@bryntum/gantt-angular';
import { Gantt } from '@bryntum/gantt';
import ganttProps from './gantt.config';

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
export class GanttComponent implements AfterViewInit {
    @ViewChild('gantt') ganttComponent: BryntumGanttComponent;
    ganttProps = ganttProps;
    changedCells: any[] = [];
    showImportModal = false;

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
    }

    getChangedCells() {
        return this.changedCells;
    }

    // New method to handle toolbar actions
    handleToolbarAction(action: string, data?: any) {
        console.log('Toolbar action:', action, data);
        // Add your custom logic here
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
        // TODO: Implement the actual import logic here
        this.showImportModal = false;
    }

    openImportModal() {
        this.showImportModal = true;
    }
}
