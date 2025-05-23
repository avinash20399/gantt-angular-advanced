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
                {
                    type: 'buttonGroup',
                    items: [
                        {
                            type: 'button',
                            ref: 'featuresButton',
                            icon: 'b-fa b-fa-tasks',
                            tooltip: 'Toggle features',
                            toggleable: true,
                            menu: {
                                onItem: 'up.onFeaturesClick',
                                onBeforeShow: 'up.onFeaturesShow',
                                items: [
                                    {
                                        text: 'Show WBS code',
                                        checked: true,
                                        wbs: true,
                                        onItem: 'up.onShowWBSToggle',
                                    },
                                    {
                                        text: 'Draw dependencies',
                                        cls: 'b-separator',
                                        feature: 'dependencies',
                                        checked: false,
                                    },
                                    {
                                        text: 'Task labels',
                                        feature: 'labels',
                                        checked: true,
                                    },
                                    {
                                        text: 'Project lines',
                                        feature: 'projectLines',
                                        checked: false,
                                    },
                                    {
                                        text: 'Enable cell editing',
                                        feature: 'cellEdit',
                                        checked: false,
                                    },
                                ],
                            },
                        },
                        {
                            type: 'button',
                            ref: 'settingsButton',
                            icon: 'b-fa b-fa-cogs',
                            tooltip: 'Settings',
                            toggleable: true,
                            menu: {
                                type: 'popup',
                                anchor: true,
                                cls: 'settings-menu',
                                layoutStyle: {
                                    flexDirection: 'column',
                                },
                                onBeforeShow: 'up.onSettingsShow',
                                items: [
                                    {
                                        type: 'slider',
                                        ref: 'rowHeight',
                                        text: 'Row height',
                                        width: '12em',
                                        showValue: true,
                                        min: 30,
                                        max: 70,
                                        onInput: 'up.onSettingsRowHeightChange',
                                    },
                                    {
                                        type: 'slider',
                                        ref: 'barMargin',
                                        text: 'Bar margin',
                                        width: '12em',
                                        showValue: true,
                                        min: 0,
                                        max: 10,
                                        onInput: 'up.onSettingsMarginChange',
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    type: 'textfield',
                    ref: 'filterByName',
                    cls: 'filter-by-name',
                    width: '15em',
                    placeholder: 'Find tasks by name',
                    clearable: true,
                    keyStrokeChangeDelay: 100,
                    triggers: {
                        filter: {
                            align: 'end',
                            cls: 'b-fa b-fa-filter',
                        },
                    },
                    onChange: 'up.onFilterChange',
                },
                "->",
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: 'importPlanButton',
                            icon: 'b-fa b-fa-file-import',
                            tooltip: 'Import project plan',
                            onAction: 'up.onImportPlanClick',
                        },
                    ]
                }
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

    onFeaturesClick({ source: item }) {
        const { gantt } = this;

        if (item.feature) {
            const feature = gantt.features[item.feature];
            feature.disabled = !feature.disabled;
        } else if (item.subGrid) {
            const subGrid = gantt.subGrids[item.subGrid];
            subGrid.collapsed = !subGrid.collapsed;
        }
    }

    onFeaturesShow({ source: menu }) {
        const { gantt } = this;

        menu.items.map((item) => {
            const { feature, wbs } = item;

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
            } else if (wbs) {
                item.checked = this.gantt.columns.get('name').showWbs;
            } else {
                item.checked = gantt.subGrids[item.subGrid].collapsed;
            }
        });
    }

    onSettingsShow({ source: menu }) {
        const { gantt } = this,
            { rowHeight, barMargin, duration } = menu.widgetMap;

        rowHeight.value = gantt.rowHeight;
        barMargin.value = gantt.barMargin;
        barMargin.max = gantt.rowHeight / 2 - 5;
        duration.value = gantt.transitionDuration;
    }

    onSettingsRowHeightChange({ value }) {
        this.gantt.rowHeight = value;
        this.widgetMap.settingsButton.menu.widgetMap.barMargin.max =
            value / 2 - 5;
    }

    onSettingsMarginChange({ value }) {
        this.gantt.barMargin = value;
    }

    onSettingsDurationChange({ value }) {
        this.gantt.transitionDuration = value;
        this.styleNode.innerHTML = `.b-animating .b-gantt-task-wrap { transition-duration: ${
            value / 1000
        }s !important; }`;
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
