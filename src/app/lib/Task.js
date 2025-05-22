import { TaskModel } from '@bryntum/gantt';

// here you can extend our default Task class with your additional fields, methods and logic
export default class Task extends TaskModel {

    static $name = 'Task';

    static get fields() {
        return [
            { name : 'deadline', type : 'date' }
        ];
    }

    get isLate() {
        return this.deadline && Date.now() > this.deadline;
    }

    get status() {
        let status = 'Not started';

        if (this.isCompleted) {
            status = 'Completed';
        }
        else if (this.endDate < Date.now()) {
            status = 'Late';
        }
        else if (this.isStarted) {
            status = 'Started';
        }

        return status;
    }
}
