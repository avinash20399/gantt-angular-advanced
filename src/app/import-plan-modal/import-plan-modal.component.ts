import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    @Output() close = new EventEmitter<void>();
    @Output() import = new EventEmitter<any>();
    @ViewChild('importSheet') importSheet: ElementRef;

    // Form and file handling
    myForm: FormGroup;
    fileName: string = '';
    fileImportURL: string = 'assets/data/ProjectPlanTemplate.xlsx';
    downloadingTemplateFor: string = 'Project Plan';

    // Step handling
    step = 1;
    
    // Validation states
    c_ValidationModeOn: boolean = false;
    c_ValidationResult: string[] = [];
    c_ErrorsCount: number = 0;
    readyToValidate: boolean = false;
    hideImportSheet: boolean = true;

    // Data storage
    uploadedData: ProjectPlanNode[] = [];
    validationResults: { row: number; errors: string[] }[] = [];

    constructor(private fb: FormBuilder) {
        this.initForm();
    }

    private initForm() {
        this.myForm = this.fb.group({
            file: ['']
        });
    }

    onIndexChange(index: number) {
        this.step = index + 1;
    }

    downloadTemplate() {
        window.open(this.fileImportURL, '_blank');
    }

    onFileSelected(evt: any) {
        const target: DataTransfer = <DataTransfer>evt.target;
        if (target.files.length !== 1) return;

        const file = target.files[0];
        this.fileName = file.name;
        this.readyToValidate = true;

        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            this.uploadedData = XLSX.utils.sheet_to_json(ws);
            this.step = 3;
        };
        reader.readAsBinaryString(file);
    }

    validateEntity() {
        this.c_ValidationModeOn = true;
        this.validationResults = [];
        console.log('uploadedData:', this.uploadedData);
        this.uploadedData.forEach((row, idx) => {
            const errors: string[] = [];
            console.log('row:', row);
            console.log('idx:', idx);
            console.log('row.wbs:', row["wbs"],row["WBS"]);
            // Validation rules based on your DTO
            if (!row["WBS"] || !/^[0-9]+(\.[0-9]+)*$/.test(row["WBS"])) {
                errors.push('WBS must be in format like 1, 1.1, 1.1.1 etc.');
            }
            if (!row["Title"]) {
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

        // Update validation results for display
        this.c_ValidationResult = this.validationResults.map(
            result => `Row ${result.row}: ${result.errors.join(', ')}`
        );
        this.c_ErrorsCount = this.validationResults.length;
        console.log('c_ErrorsCount:', this.c_ErrorsCount);
        // If no validation errors, emit the validated data
        if (this.c_ErrorsCount === 0) {
            console.log('Validation passed, emitting data:', this.uploadedData);
            this.import.emit(this.uploadedData);
            this.closeModal();
        }
    }

    closeModal() {
        this.close.emit();
    }
}
