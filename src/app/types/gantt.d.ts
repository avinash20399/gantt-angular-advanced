import { Gantt } from '@bryntum/gantt';
import { GanttComponent } from '../gantt/gantt.component';

declare module '@bryntum/gantt' {
    interface Gantt {
        angularComponent?: GanttComponent;
    }
}
