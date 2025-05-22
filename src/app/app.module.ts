import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppErrorHandler } from './error.handler';
import { AuthInterceptor } from './services/auth.interceptor';

import { AppComponent } from './app.component';
import { GanttComponent } from './gantt/gantt.component';
import { ImportPlanModalComponent } from './import-plan-modal/import-plan-modal.component';
import { BryntumGanttModule } from '@bryntum/gantt-angular';

@NgModule({
    declarations: [AppComponent, GanttComponent, ImportPlanModalComponent],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        BryntumGanttModule,
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
