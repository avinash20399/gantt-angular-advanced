import { Toolbar, Toast, DateHelper, CSSHelper } from '@bryntum/gantt';
/**
 * @module GanttToolbar
 */

/**
 * @extends Core/widget/Toolbar
 */
export default class GanttToolbar extends Toolbar {
    // Factoryable type name
    static type = 'gantttoolbar';

    static $name = 'GanttToolbar';

    // Called when toolbar is added to the Gantt panel
    set parent(parent) {
        super.parent = parent;
        const me = this;
        me.gantt = parent;
        me.styleNode = document.createElement('style');
        document.head.appendChild(me.styleNode);
    }

    get parent() {
        return super.parent;
    }

    static get configurable() {
        return {
            cls: 'compact-toolbar',  // Add custom class for styling
            items: [
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            color: 'b-green',
                            ref: 'addTaskButton',
                            icon: 'b-fa b-fa-plus',
                            tooltip: 'Create new task',
                            onAction: 'up.onAddTaskClick',
                        },
                    ],
                },
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'editTaskButton',
                            icon: 'b-fa b-fa-pen',
                            tooltip: 'Edit selected task',
                            onAction: 'up.onEditTaskClick',
                        },
                        {
                            ref: 'undoRedo',
                            type: 'undoredo',
                            items: {
                                transactionsCombo: null,
                            },
                        },
                    ],
                },
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'expandAllButton',
                            icon: 'b-fa b-fa-angle-double-down',
                            tooltip: 'Expand all',
                            onAction: 'up.onExpandAllClick',
                        },
                        {
                            ref: 'collapseAllButton',
                            icon: 'b-fa b-fa-angle-double-up',
                            tooltip: 'Collapse all',
                            onAction: 'up.onCollapseAllClick',
                        },
                    ],
                },
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'zoomInButton',
                            icon: 'b-fa b-fa-search-plus',
                            tooltip: 'Zoom in',
                            onAction: 'up.onZoomInClick',
                        },
                        {
                            ref: 'zoomOutButton',
                            icon: 'b-fa b-fa-search-minus',
                            tooltip: 'Zoom out',
                            onAction: 'up.onZoomOutClick',
                        },
                        {
                            ref: 'zoomToFitButton',
                            icon: 'b-fa b-fa-compress-arrows-alt',
                            tooltip: 'Zoom to fit',
                            onAction: 'up.onZoomToFitClick',
                        },
                    ],
                },
                //{
                //    type: 'buttonGroup',
                //    items: [
                //        {
                //            type: 'button',
                //            ref: 'featuresButton',
                //            icon: 'b-fa b-fa-tasks',
                //            tooltip: 'Toggle features',
                //            toggleable: true,
                //            menu: {
                //                onItem: 'up.onFeaturesClick',
                //                onBeforeShow: 'up.onFeaturesShow',
                //                items: [
                //                    {
                //                        text: 'Show WBS code',
                //                        checked: true,
                //                        wbs: true,
                //                        onItem: 'up.onShowWBSToggle'
                //                    },
                //                    {
                //                        text: 'Task Editing',
                //                        cls: 'b-separator',
                //                        feature: 'cellEdit',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Draw Dependencies',
                //                        feature: 'dependencies',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Task Labels',
                //                        feature: 'labels',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Project Lines',
                //                        feature: 'projectLines',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Critical Path',
                //                        feature: 'criticalPaths',
                //                        checked: false
                //                    },
                //                    {
                //                        text: 'Progress Line',
                //                        feature: 'progressLine',
                //                        checked: false
                //                    },
                //                    {
                //                        text: 'Enable Baselines',
                //                        feature: 'baselines',
                //                        checked: false
                //                    },
                //                    {
                //                        text: 'Task Rollups',
                //                        feature: 'rollups',
                //                        checked: false
                //                    },
                //                    {
                //                        text: 'Time Ranges',
                //                        feature: 'timeRanges',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Non-working Time',
                //                        feature: 'nonWorkingTime',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Enable Task Drag/Drop',
                //                        feature: 'taskDrag',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Enable Task Resize',
                //                        feature: 'taskResize',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Pan & Zoom',
                //                        feature: 'pan',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Column Auto-Width',
                //                        feature: 'columnAutoWidth',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Filter Bar',
                //                        feature: 'filter',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Row Grouping',
                //                        feature: 'group',
                //                        checked: false
                //                    },
                //                    {
                //                        text: 'Sort Tasks',
                //                        feature: 'sort',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Task Context Menu',
                //                        feature: 'taskContextMenu',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Header Context Menu',
                //                        feature: 'headerContextMenu',
                //                        checked: true
                //                    },
                //                    {
                //                        text: 'Enable Striping',
                //                        feature: 'stripe',
                //                        checked: true
                //                    }
                //                ]
                //            },
                //        },
                //        //{
                //        //    type: 'button',
                //        //    ref: 'settingsButton',
                //        //    icon: 'b-fa b-fa-cogs',
                //        //    tooltip: 'Settings',
                //        //    toggleable: true,
                //        //    menu: {
                //        //        type: 'popup',
                //        //        anchor: true,
                //        //        cls: 'settings-menu',
                //        //        layoutStyle: {
                //        //            flexDirection: 'column',
                //        //        },
                //        //        onBeforeShow: 'up.onSettingsShow',
                //        //        items: [
                //        //            {
                //        //                type: 'slider',
                //        //                ref: 'rowHeight',
                //        //                text: 'Row height',
                //        //                width: '12em',
                //        //                showValue: true,
                //        //                min: 30,
                //        //                max: 70,
                //        //                onInput: 'up.onSettingsRowHeightChange',
                //        //            },
                //        //            {
                //        //                type: 'slider',
                //        //                ref: 'barMargin',
                //        //                text: 'Bar margin',
                //        //                width: '12em',
                //        //                showValue: true,
                //        //                min: 0,
                //        //                max: 10,
                //        //                onInput: 'up.onSettingsMarginChange',
                //        //            },
                //        //        ],
                //        //    },
                //        //},
                //    ],
                //},
                {
                    ref     : 'featuresButton',
                    type    : 'button',
                    icon    : 'b-fa b-fa-tasks',
                    text    : 'Settings',
                    tooltip : 'Toggle features',
                    menu    : {
                        onItem       : 'up.onFeaturesClick',
                        onBeforeShow : 'up.onFeaturesShow',
                        // "checked" is set to a boolean value to display a checkbox for menu items. No matter if it is true or false.
                        // The real value is set dynamically depending on the "disabled" config of the feature it is bound to.
                        items        : {
                            settings : {
                                text : 'UI settings',
                                icon : 'b-fa-sliders-h',
                                menu : {
                                    cls         : 'settings-menu',
                                    layoutStyle : {
                                        flexDirection : 'column'
                                    },
                                    onBeforeShow : 'up.onSettingsShow',
                                    defaults     : {
                                        type      : 'slider',
                                        showValue : true
                                    },
                                    items : [
                                        {
                                            ref     : 'rowHeight',
                                            text    : 'Row height',
                                            min     : 30,
                                            max     : 70,
                                            onInput : 'up.onRowHeightChange'
                                        },
                                        {
                                            ref     : 'barMargin',
                                            text    : 'Bar margin',
                                            min     : 0,
                                            max     : 10,
                                            onInput : 'up.onBarMarginChange'
                                        },
                                        {
                                            ref     : 'duration',
                                            text    : 'Animation duration',
                                            min     : 0,
                                            max     : 2000,
                                            step    : 100,
                                            onInput : 'up.onAnimationDurationChange'
                                        },
                                        {
                                            ref     : 'radius',
                                            text    : 'Dependency radius',
                                            min     : 0,
                                            max     : 10,
                                            onInput : 'up.onDependencyRadiusChange'
                                        }
                                    ]
                                }
                            },
                            showWbs : {
                                text    : 'Show WBS code',
                                checked : true,
                                onItem  : 'up.onShowWBSToggle'
                            },
                            drawDeps : {
                                text    : 'Draw dependencies',
                                feature : 'dependencies',
                                checked : false
                            },
                            taskLabels : {
                                text    : 'Task labels',
                                feature : 'labels',
                                checked : false
                            },
                            criticalPaths : {
                                text    : 'Critical paths',
                                feature : 'criticalPaths',
                                tooltip : 'Highlight critical paths',
                                checked : false
                            },
                            projectLines : {
                                text    : 'Project lines',
                                feature : 'projectLines',
                                checked : false
                            },
                            nonWorkingTime : {
                                text    : 'Highlight non-working time',
                                feature : 'nonWorkingTime',
                                checked : false
                            },
                            cellEdit : {
                                text    : 'Enable cell editing',
                                feature : 'cellEdit',
                                checked : false
                            },
                            autoEdit : {
                                text    : 'Auto edit',
                                checked : false,
                                onItem  : 'up.onAutoEditToggle'
                            },
                            columnLines : {
                                text    : 'Show column lines',
                                feature : 'columnLines',
                                checked : true
                            },
                            rowLines : {
                                text    : 'Show row lines',
                                onItem  : 'up.onRowLinesToggle',
                                checked : true
                            },
                            baselines : {
                                text    : 'Show baselines',
                                feature : 'baselines',
                                checked : false
                            },
                            rollups : {
                                text    : 'Show rollups',
                                feature : 'rollups',
                                checked : false
                            },
                            progressLine : {
                                text    : 'Show progress line',
                                feature : 'progressLine',
                                checked : false
                            },
                            parentArea : {
                                text    : 'Show parent area',
                                feature : 'parentArea',
                                checked : false
                            },
                            fillTicks : {
                                text         : 'Stretch tasks to fill ticks',
                                toggleConfig : 'fillTicks',
                                checked      : false
                            },
                            hideSchedule : {
                                text    : 'Hide schedule',
                                cls     : 'b-separator',
                                subGrid : 'normal',
                                checked : false
                            }
                        }
                    }
                },
                {
                    type: 'textfield',
                    ref: 'plainSearch',
                    cls: 'b-textfield b-contains-focus',
                    width: '16em',
                    height: '2.5em',
                    placeholder: 'Find tasks by name',
                    clearable: false,
                    //triggers: {
                    //    expand: {
                    //        align: 'end',
                    //        cls: 'b-fa b-fa-angle-down',
                    //        weight: 100
                    //    }
                    //},
                    keyStrokeChangeDelay: 100,
                    onChange: 'up.onPlainSearchChange'
                },
                "->",
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            ref: 'addTaskButton',
                            icon: 'b-fa b-fa-filter',
                            cls: 'b-raised',
                            tooltip: 'Filter',
                            onAction: 'up.onFilterChange',
                        },
                    ],
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: 'importPlanButton',
                            icon: 'b-fa b-fa-file-import',
                            text: 'Import Planner',
                            tooltip: 'Import project plan',
                            onAction: 'up.onImportPlanClick',
                        },
                    ]
                },
            ],
        };
    }

    setAnimationDuration(value) {
        const me = this,
            cssText = `.b-animating .b-gantt-task-wrap { transition-duration: ${
                value / 1000
            }s !important; }`;

        me.gantt.transitionDuration = value;

        if (me.transitionRule) {
            me.transitionRule.cssText = cssText;
        } else {
            me.transitionRule = CSSHelper.insertRule(cssText);
        }
    }

    updateStartDateField() {
        const { startDateField } = this.widgetMap;

        startDateField.value = this.gantt.project.startDate;

        // This handler is called on project.load/propagationComplete, so now we have the
        // initial start date. Prior to this time, the empty (default) value would be
        // flagged as invalid.
        startDateField.required = true;
    }

    // New method to trigger GanttComponent actions
    triggerGanttAction(action, data) {
        // Access the Angular component through the gantt instance
        const ganttComponent = this.gantt.angularComponent;
        if (
            ganttComponent &&
            typeof ganttComponent.handleToolbarAction === 'function'
        ) {
            return ganttComponent.handleToolbarAction(action, data);
        }
        console.warn(
            'Could not access GanttComponent or handleToolbarAction method'
        );
    }

    // region controller methods

    async onAddTaskClick() {
        const { gantt } = this,
            added = gantt.taskStore.rootNode.appendChild({
                name: 'New task',
                duration: 1,
            });

        // Trigger the GanttComponent action
        this.triggerGanttAction('getChangedCells');

        // wait for immediate commit to calculate new task fields
        await gantt.project.commitAsync();

        // scroll to the added task
        await gantt.scrollRowIntoView(added);

        gantt.features.cellEdit.startEditing({
            record: added,
            field: 'name',
        });
    }

    onEditTaskClick() {
        const { gantt } = this;

        if (gantt.selectedRecord) {
            gantt.editTask(gantt.selectedRecord);
        } else {
            Toast.show('First select the task you want to edit');
        }
    }

    onExpandAllClick() {
        this.gantt.expandAll();
    }

    onCollapseAllClick() {
        this.gantt.collapseAll();
    }

    onZoomInClick() {
        this.gantt.zoomIn();
    }

    onZoomOutClick() {
        this.gantt.zoomOut();
    }

    onZoomToFitClick() {
        this.gantt.zoomToFit({
            leftMargin: 50,
            rightMargin: 50,
        });
    }

    onShiftPreviousClick() {
        this.gantt.shiftPrevious();
    }

    onShiftNextClick() {
        this.gantt.shiftNext();
    }

    onStartDateChange({ value, userAction }) {
        // Scroll to date only when user changes the date, not for the initial set
        if (value && userAction) {
            this.gantt.scrollToDate(DateHelper.add(value, -1, 'week'), {
                block: 'start',
            });

            this.gantt.project.setStartDate(value);
        }
    }

    onFilterChange({ value }) {
        if (value === '') {
            this.gantt.taskStore.clearFilters();
        } else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            this.gantt.taskStore.filter({
                filters: (task) =>
                    task.name && task.name.match(new RegExp(value, 'i')),
                replace: true,
            });
        }
    }

    onPlainSearchChange({ value }) {
        const plainValue = value || '';
        if (this.gantt.angularComponent) {
            this.triggerGanttAction('plainSearch', plainValue);
        } else {
            // Fallback to direct filtering if Angular component is not available
            this.onFilterChange({ value: plainValue });
        }
    }

    onFeaturesClick({ source : item }) {
        const { gantt } = this;

        if (item.feature) {
            const feature = gantt.features[item.feature];
            feature.disabled = !feature.disabled;
        }
        else if (item.subGrid) {
            const subGrid = gantt.subGrids[item.subGrid];
            subGrid.collapsed = !subGrid.collapsed;
        }
        else if (item.toggleConfig) {
            gantt[item.toggleConfig] = item.checked;
        }
    }

    onFeaturesShow({ source : menu }) {
        const { gantt } = this;

        menu.items.map(item => {
            const { feature } = item;

            if (feature) {
                // a feature might be not presented in the gantt
                // (the code is shared between "advanced" and "php" demos which use a bit different set of features)
                if (gantt.features[feature]) {
                    item.checked = !gantt.features[feature].disabled;
                }
                // hide not existing features
                else {
                    item.hide();
                }
            }
            else if (item.subGrid) {
                item.checked = gantt.subGrids[item.subGrid].collapsed;
            }
        });
    }

    onSettingsShow({ source : menu }) {
        const
            { gantt }                                  = this,
            { rowHeight, barMargin, duration, radius } = menu.widgetMap;

        rowHeight.value = gantt.rowHeight;
        barMargin.value = gantt.barMargin;
        barMargin.max = (gantt.rowHeight / 2) - 5;
        duration.value = gantt.transitionDuration;
        radius.value = gantt.features.dependencies.radius ?? 0;
    }

    onRowHeightChange({ value, source }) {
        this.gantt.rowHeight = value;
        source.owner.widgetMap.barMargin.max = (value / 2) - 5;
    }

    onBarMarginChange({ value }) {
        this.gantt.barMargin = value;
    }

    onAnimationDurationChange({ value }) {
        this.gantt.transitionDuration = value;
        this.styleNode.innerHTML = `.b-animating .b-gantt-task-wrap { transition-duration: ${value / 1000}s !important; }`;
    }

    onDependencyRadiusChange({ value }) {
        this.gantt.features.dependencies.radius = value;
    }

    onCriticalPathsClick({ source }) {
        this.gantt.features.criticalPaths.disabled = !source.pressed;
    }

    onShowWBSToggle({ item }) {
        this.gantt.columns.get('name').showWbs = item.checked;
    }

    onImportPlanClick() {
        this.triggerGanttAction('importPlan');
    }

    // endregion
}

// Register this widget type with its Factory
GanttToolbar.initClass();
