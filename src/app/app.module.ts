import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorHandler } from './error.handler';

import { AppComponent } from './app.component';
import { GanttComponent } from './gantt/gantt.component';
import { ImportPlanModalComponent } from './import-plan-modal/import-plan-modal.component';
import { BryntumGanttModule } from '@bryntum/gantt-angular';

@NgModule({
    declarations: [AppComponent, GanttComponent, ImportPlanModalComponent],
    imports: [BrowserModule, ReactiveFormsModule, BryntumGanttModule],
    providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
