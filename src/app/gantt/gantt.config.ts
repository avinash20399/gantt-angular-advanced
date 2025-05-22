import { BryntumGanttProps } from '@bryntum/gantt-angular';
import '../lib/GanttToolbar.js';
import '../lib/StatusColumn.js';
import Task from '../lib/Task.js';

const ganttProps: BryntumGanttProps = {
    dependencyIdField: 'wbsCode',
    selectionMode: {
        cell: true,
        dragSelect: true,
        rowNumber: true,
    },
    project: {
        autoSetConstraints: true,
        // Let the Project know we want to use our own Task model with custom fields / methods
        taskModelClass: Task,
        transport: {
            load: {
                url: 'api/gantt/data',
                method: 'GET',
            },
            sync: {
                url: 'api/gantt/sync',
                method: 'POST',
            },
        },
        autoLoad: false,

        // The State TrackingManager, which the UndoRedo widget in the toolbar uses
        stm: {
            // NOTE, that this option does not enable the STM itself, this is done by the `undoredo` widget, defined in the toolbar
            // If you don't use `undoredo` widget in your app, you need to enable STM manually: `stm.enable()`,
            // otherwise, it won't be tracking changes in the data
            // It's usually best to enable STM after the initial data loading is completed.
            autoRecord: true,
        },

        // This config enables response validation and dumping of found errors to the browser console.
        // It's meant to be used as a development stage helper only, so please set it to false for production systems.
        validateResponse: true,
    },

    startDate: '2019-01-12',
    endDate: '2019-03-24',
    resourceImageFolderPath: 'assets/users/',
    columns: [
        { type: 'wbs', hidden: true },
        { type: 'name', width: 250, showWbs: true },
        { type: 'startdate' },
        { type: 'duration' },
        { type: 'resourceassignment', width: 120, showAvatars: true },
        { type: 'percentdone', mode: 'circle', width: 70 },
        {
            type: 'predecessor',
            width: 112,
        },
        {
            type: 'successor',
            width: 112,
        },
        { type: 'schedulingmodecolumn' },
        { type: 'calendar' },
        { type: 'constrainttype' },
        { type: 'constraintdate' },
        // @ts-ignore This is an application custom column
        { type: 'statuscolumn' },
        {
            type: 'date',
            text: 'Deadline',
            field: 'deadline',
        },
        { type: 'addnew' },
    ],

    subGridConfigs: {
        locked: {
            flex: 3,
        },
        normal: {
            flex: 4,
        },
    },

    columnLines: false,

    rollupsFeature: {
        disabled: true,
    },

    baselinesFeature: {
        disabled: true,
    },

    progressLineFeature: {
        disabled: true,
        statusDate: new Date(2019, 0, 25),
    },

    filterFeature: true,

    dependencyEditFeature: true,

    timeRangesFeature: {
        showCurrentTimeLine: true,
    },

    labelsFeature: {
        left: {
            field: 'name',
            editor: {
                type: 'textfield',
            },
        },
    },

    tbar: {
        // @ts-ignore This is an application custom widget
        type: 'gantttoolbar',
    },
};

export default ganttProps;
