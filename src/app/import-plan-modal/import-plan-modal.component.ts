import {
    Component,
    EventEmitter,
    Output,
    ViewChild,
    ElementRef,
} from '@angular/core';
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
    isImporting: boolean = false;

    // Data storage
    uploadedData: ProjectPlanNode[] = [];
    validationResults: { row: number; errors: string[] }[] = [];

    constructor(private fb: FormBuilder) {
        this.initForm();
    }

    private initForm() {
        this.myForm = this.fb.group({
            file: [''],
        });
    }

    onIndexChange(index: number) {
        if (!this.isImporting) {
            this.step = index + 1;
        }
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
            const wb: XLSX.WorkBook = XLSX.read(bstr, {
                type: 'binary',
                cellDates: true,
            });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            const rawData = XLSX.utils.sheet_to_json(ws, {
                raw: false,
                dateNF: 'DD-MM-YYYY',
            });
            this.uploadedData = this.formatImportData(rawData);
            this.step = 3;
        };
        reader.readAsBinaryString(file);
    }

    private formatImportData(data: any[]): ProjectPlanNode[] {
        return data.map((row) => {
            const formattedRow: any = {};

            // Format all date fields to DD-MM-YYYY
            const dateFields = [
                'plannedStartDate',
                'plannedEndDate',
                'actualStartDate',
                'actualEndDate',
            ];
            dateFields.forEach((field) => {
                console.log('row[dielf]:', row[field]);
                if (row[field]) {
                    try {
                        // Check if the value is already in DD-MM-YYYY format
                        const dateRegex =
                            /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
                        if (dateRegex.test(row[field])) {
                            formattedRow[field] = row[field];
                        } else {
                            // Try parsing as Excel date
                            let date: Date;
                            if (typeof row[field] === 'number') {
                                // Handle Excel serial number date
                                date = new Date(
                                    (row[field] - 25569) * 86400 * 1000
                                );
                            } else {
                                // Try parsing as regular date string
                                date = new Date(row[field]);
                            }

                            if (!isNaN(date.getTime())) {
                                formattedRow[field] = this.formatDate(date);
                            } else {
                                console.warn(
                                    `Invalid date format for ${field}:`,
                                    row[field]
                                );
                                formattedRow[field] = null;
                            }
                        }
                    } catch (error) {
                        console.warn(`Error parsing date for ${field}:`, error);
                        formattedRow[field] = null;
                    }
                }
            });

            // Handle numeric fields as numbers with 2 decimal precision
            const numericFields = [
                'plannedWeightage',
                'actualWeightage',
                'plannedMilestonePercentage',
                'actualMilestonePercentage',
            ];
            numericFields.forEach((field) => {
                if (row[field] !== undefined && row[field] !== null) {
                    const num = parseFloat(row[field]);
                    formattedRow[field] = isNaN(num)
                        ? 0
                        : Number(num.toFixed(2));
                }
            });

            // Convert other fields to strings
            const stringFields = [
                'wbs',
                'title',
                'description',
                'status',
                'assignedTo',
                'createdBy',
            ];
            stringFields.forEach((field) => {
                if (row[field] !== undefined && row[field] !== null) {
                    formattedRow[field] = row[field].toString().trim();
                }
            });

            return formattedRow as ProjectPlanNode;
        });
    }

    private formatDate(date: Date): string {
        // Add timezone offset to get correct local date
        const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
        );
        const day = localDate.getDate().toString().padStart(2, '0');
        const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
        const year = localDate.getFullYear();
        return `${year}-${month}-${day}`;
    }

    validateEntity() {
        if (this.isImporting) return;

        this.c_ValidationModeOn = true;
        this.validationResults = [];
        console.log('uploadedData:', this.uploadedData);
        this.uploadedData.forEach((row, idx) => {
            const errors: string[] = [];

            // Updated validation rules for formatted data
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

            // Validate date format (YYYY-MM-DD)
            const dateRegex =
                /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
            [
                'plannedStartDate',
                'plannedEndDate',
                'actualStartDate',
                'actualEndDate',
            ].forEach((field) => {
                if (row[field] && !dateRegex.test(row[field])) {
                    errors.push(`${field} must be in YYYY-MM-DD format.`);
                }
            });

            // Validate numeric fields (as numbers with 2 decimal places)
            [
                'plannedWeightage',
                'actualWeightage',
                'plannedMilestonePercentage',
                'actualMilestonePercentage',
            ].forEach((field) => {
                if (row[field] !== undefined && row[field] !== null) {
                    if (typeof row[field] !== 'number') {
                        errors.push(`${field} must be a number.`);
                    } else if (row[field] < 0 || row[field] > 100) {
                        errors.push(`${field} must be between 0 and 100.`);
                    }
                }
            });

            if (errors.length) {
                this.validationResults.push({ row: idx + 2, errors }); // +2 for header and 0-index
            }
        });

        // Update validation results for display
        this.c_ValidationResult = this.validationResults.map(
            (result) => `Row ${result.row}: ${result.errors.join(', ')}`
        );
        this.c_ErrorsCount = this.validationResults.length;

        // If no validation errors, emit the validated data
        if (this.c_ErrorsCount === 0) {
            this.isImporting = true;
            this.import.emit(this.uploadedData);
        }
    }

    closeModal() {
        if (!this.isImporting) {
            this.close.emit();
        }
    }
}
