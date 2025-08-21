import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
})
export class AppointmentDialogComponent {
  appointmentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id?: number;
      uuid: string;
      date: Date;
      title: string;
      startTime: string;
      endTime: string;
      color: string;
    },
    private formBuilder: FormBuilder
  ) {
    this.appointmentForm = this.formBuilder.group(
      {
        title: [this.data.title || '', Validators.required],
        date: [this.data.date || '', Validators.required],
        startTime: [this.data.startTime || '', Validators.required],
        endTime: [this.data.endTime || '', Validators.required],
      },
      { validators: this.timeRangeValidator }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const data = {
        title: this.appointmentForm.controls['title'].value,
        date: this.appointmentForm.controls['date'].value,
        startTime: this.appointmentForm.controls['startTime'].value,
        endTime: this.appointmentForm.controls['endTime'].value,
        uuid: this.data.uuid,
      };
      this.dialogRef.close(data);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  // Validator pour vérifier que endTime > startTime
  timeRangeValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':');
      const [endHours, endMinutes] = endTime.split(':');

      const startDate = new Date();
      startDate.setHours(+startHours, +startMinutes, 0);

      const endDate = new Date();
      endDate.setHours(+endHours, +endMinutes, 0);

      if (startDate >= endDate) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  };
}
