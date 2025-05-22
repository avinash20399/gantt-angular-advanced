import { Component, EventEmitter, Output } from '@angular/core';
import * as XLSX from 'xlsx';

interface ProjectPlanNode {
    wbs: string;
    title: string;
    description?: string;
    status?: string;
    assignedTo?: string;
    createdBy?: string;
    plannedStartDate?: string;
    plannedEndDate?: string;
    actualStartDate?: string;
    actualEndDate?: string;
    plannedWeightage?: number;
    actualWeightage?: number;
    plannedMilestonePercentage?: number;
    actualMilestonePercentage?: number;
}

@Component({
    selector: 'app-import-plan-modal',
    templateUrl: './import-plan-modal.component.html',
    styleUrls: ['./import-plan-modal.component.scss'],
})
export class ImportPlanModalComponent {
    step = 1;
    uploadedData: ProjectPlanNode[] = [];
    validationResults: { row: number; errors: string[] }[] = [];
    @Output() close = new EventEmitter<void>();

    downloadTemplate() {
        window.open('assets/data/ProjectPlanTemplate.xlsx', '_blank');
    }

    onFileChange(evt: any) {
        const target: DataTransfer = <DataTransfer>evt.target;
        if (target.files.length !== 1) return;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            this.uploadedData = XLSX.utils.sheet_to_json(ws);
            this.step = 3;
        };
        reader.readAsBinaryString(target.files[0]);
    }

    validateData() {
        this.validationResults = [];
        this.uploadedData.forEach((row, idx) => {
            const errors: string[] = [];
            // Validation rules based on your DTO
            if (!row.wbs || !/^[0-9]+(\.[0-9]+)*$/.test(row.wbs)) {
                errors.push('WBS must be in format like 1, 1.1, 1.1.1 etc.');
            }
            if (!row.title) {
                errors.push('Title is required.');
            }
            if (
                row.assignedTo &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.assignedTo)
            ) {
                errors.push('AssignedTo must be a valid email.');
            }
            if (
                row.createdBy &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.createdBy)
            ) {
                errors.push('CreatedBy must be a valid email.');
            }
            [
                'plannedStartDate',
                'plannedEndDate',
                'actualStartDate',
                'actualEndDate',
            ].forEach((field) => {
                if (row[field] && isNaN(Date.parse(row[field]))) {
                    errors.push(`${field} must be a valid ISO date.`);
                }
            });
            [
                'plannedWeightage',
                'actualWeightage',
                'plannedMilestonePercentage',
                'actualMilestonePercentage',
            ].forEach((field) => {
                if (row[field] && isNaN(Number(row[field]))) {
                    errors.push(`${field} must be a number.`);
                }
            });
            if (errors.length) {
                this.validationResults.push({ row: idx + 2, errors }); // +2 for header and 0-index
            }
        });
    }

    closeModal() {
        this.close.emit();
    }
}
