import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { CalendarService, RendezVous } from 'src/app/service/calendar.service';

interface Appointment {
  id?: number;
  uuid?: string;
  date: Date;
  title: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays: Date[] = [];
  appointments: Appointment[] = [];

  currentView: CalendarView = CalendarView.Month;
  timeSlots: string[] = [];

  weeks: Date[][] = [];

  public CalendarView = CalendarView;

  
  
dialogRef: any;

  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService
  ) {}

   ngOnInit() {
    this.generateView(this.currentView, this.viewDate);
    this.generateTimeSlots();
    this.loadAppointments();
  }


  // 🔹 Charger depuis API
  loadAppointments() {
    const token = localStorage.getItem('token') || ''; // ou autre méthode
    this.calendarService.getAll(token).subscribe({
      next: (data) => {
        this.appointments = data.map(rdv => ({
          id: rdv.id,
          uuid: this.generateUUID(),
          date: new Date(rdv.date),
          title: rdv.titre,
          startTime: rdv.startTime.substring(0,5),
          endTime: rdv.endTime.substring(0,5),
          color: this.getRandomColor()
        }));
      },
      error: (err) => console.error('Erreur chargement rendez-vous', err)
    });
  }


    // 🔹 Ajouter via API
  addAppointmentAPI(rdv: RendezVous) {
    const token = localStorage.getItem('token') || '';
    this.calendarService.create(rdv, token).subscribe({
      next: (saved) => {
        this.appointments.push({
          id: saved.id,
          uuid: this.generateUUID(),
          date: new Date(saved.date),
          title: saved.titre,
          startTime: saved.startTime.substring(0,5),
          endTime: saved.endTime.substring(0,5),
          color: this.getRandomColor()
        });
      }
    });
  }


   // 🔹 Mise à jour via API
  updateAppointmentAPI(id: number, rdv: RendezVous) {
    const token = localStorage.getItem('token') || '';
    this.calendarService.update(id, rdv, token).subscribe({
      next: (updated) => {
        const index = this.appointments.findIndex(a => a.id === id);
        if (index > -1) {
          this.appointments[index] = {
            ...this.appointments[index],
            date: new Date(updated.date),
            title: updated.titre,
            startTime: updated.startTime.substring(0,5),
            endTime: updated.endTime.substring(0,5)
          };
        }
      }
    });
  }

deleteAppointmentAPI(id: number) {
  const token = localStorage.getItem('token') || '';
  console.log('Début suppression API, id =', id);

  this.calendarService.delete(id, token).subscribe({
    next: () => {
      console.log('Suppression backend OK pour id =', id);
      this.appointments = this.appointments.filter(a => a.id !== id);
    },
    error: (err) => {
      console.error('Erreur lors suppression backend :', err);
      alert('Erreur lors de la suppression : ' + (err.message || 'Erreur inconnue'));
    }
  });
}




   // Ouverture du dialog
  openDialog(appointment?: Appointment): void {
  const dialogRef = this.dialog.open(AppointmentDialogComponent, {
   width: '400px',
  height: 'auto',
  disableClose: true,
  position: {  left: '50%' },
  panelClass: 'custom-dialog-container',
    data: appointment || {
      date: this.selectedDate || new Date(),
      title: '',
      startTime: this.selectedStartTime || '09:00',
      endTime: this.selectedStartTime || '10:00',
      uuid: undefined,
      color: ''
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;  // utilisateur a annulé

    if (result.remove && appointment?.id) {
      // suppression : appeler la méthode qui supprime dans la base et met à jour la liste
      this.deleteAppointmentAPI(appointment.id);
    } else if (appointment?.id) {
      // édition : appeler la méthode de mise à jour
      this.updateAppointmentAPI(appointment.id, {
        titre: result.title,
        description: '',
        date: result.date.toISOString().split('T')[0],
        startTime: result.startTime + ':00',
        endTime: result.endTime + ':00'
      });
    } else {
      // création : appeler la méthode de création
      this.addAppointmentAPI({
        titre: result.title,
        description: '',
        date: result.date.toISOString().split('T')[0],
        startTime: result.startTime + ':00',
        endTime: result.endTime + ':00'
      });
    }
  });
}



  drop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
  const movedAppointment = event.item.data as Appointment;
  movedAppointment.date = date;

  if (slot) {
    // Par exemple, mettre à jour l’heure de début et fin si besoin
    movedAppointment.startTime = slot;
    movedAppointment.endTime = slot;
  }

  if (movedAppointment.id) {
    const token = localStorage.getItem('token') || '';
    this.calendarService.update(movedAppointment.id, {
      titre: movedAppointment.title,
      description: '',
      date: date.toISOString().split('T')[0],
      startTime: movedAppointment.startTime + ':00',
      endTime: movedAppointment.endTime + ':00',
    }, token).subscribe({
      next: updated => {
        movedAppointment.date = new Date(updated.date);
      },
      error: err => console.error('Erreur update', err)
    });
  }
}

  generateView(view: CalendarView, date: Date) {
    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
      default:
        this.generateMonthView(date);
    }
  }

  generateMonthView(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.weeks = [];
    this.monthDays = [];
    let week: Date[] = [];

    for (let day = start.getDay(); day > 0; day--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - day);
      week.push(prevDate);
      this.monthDays.push(prevDate);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      this.monthDays.push(currentDate);
      week.push(currentDate);
      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }
    }

    for (let day = 1; this.monthDays.length % 7 !== 0; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      this.monthDays.push(nextDate);
    }

    for (let day = 1; week.length < 7; day++) {
      const nextDate = new Date(end);
      nextDate.setDate(end.getDate() + day);
      week.push(nextDate);
    }

    if (week.length > 0) {
      this.weeks.push(week);
    }
  }

  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays = [];

    for (let day = 0; day < 7; day++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + day);
      this.monthDays.push(weekDate);
    }
  }

  generateDayView(date: Date) {
    this.monthDays = [date];
  }

  generateTimeSlots() {
    for (let hour = 0; hour <= 24; hour++) {
      const time = hour < 10 ? `0${hour}:00` : `${hour}:00`;
      this.timeSlots.push(time);
    }
  }

  switchToView(view: CalendarView) {
    this.currentView = view;
    this.generateView(this.currentView, this.viewDate);
  }

  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(start.setDate(diff));
  }

  previous() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 1)
      );
      this.generateDayView(this.viewDate);
    }
  }

  next() {
    if (this.currentView === 'month') {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1)
      );
      this.generateMonthView(this.viewDate);
    } else if (this.currentView === 'week') {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 7)
      );
      this.generateWeekView(this.viewDate);
    } else {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 1)
      );
      this.generateDayView(this.viewDate);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelected(date: Date): boolean {
    if (!this.selectedDate) {
      return false;
    }
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  selectDate(date?: Date, startTime?: string) {
    if (date) {
      this.selectedDate = date;
    } else {
      this.selectedDate = new Date();
    }
    this.selectedStartTime = startTime;
    this.openDialog();
  }

  generateUUID(): string {
    let d = new Date().getTime(); //Timestamp
    let d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  addAppointment(
    date: Date,
    title: string,
    startTime: string,
    endTime: string
  ) {
    this.appointments.push({
      uuid: this.generateUUID(),
      date,
      title,
      startTime,
      endTime,
      color: this.getRandomColor(),
    });
  }

  deleteAppointment(appointment: Appointment, event: Event) {
  event.stopPropagation();

  if (appointment.id) {
    this.deleteAppointmentAPI(appointment.id);
  } else {
    // Cas sans id (non enregistré), suppression locale seulement
    const index = this.appointments.indexOf(appointment);
    if (index > -1) {
      this.appointments.splice(index, 1);
    }
  }
}


  


  getAppointmentsForDate(day: Date, timeSlots: string[]) {
    return this.appointments
      .filter((appointment) => {
        return this.isSameDate(appointment.date, day);
      })
      .map((appointment) => {
        const startTimeIndex = timeSlots.indexOf(appointment.startTime);
        const endTimeIndex = timeSlots.indexOf(appointment.endTime);
        return { ...appointment, startTimeIndex, endTimeIndex };
      });
  }





  viewToday(): void {
    this.viewDate = new Date();
    this.generateView(this.currentView, this.viewDate);
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    const appointmentsForDateTime: Appointment[] = this.appointments.filter(
      (appointment) =>
        this.isSameDate(appointment.date, date) &&
        appointment.startTime <= timeSlot &&
        appointment.endTime >= timeSlot
    );

    return appointmentsForDateTime;
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.4;
    return `rgba(${r},${g},${b},${a})`;
  }

  editAppointment(appointment: Appointment, event: Event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
        width: '400px',
         height: 'auto',
    disableClose: true,
    position: { top: '50%', left: '50%' }, // position inline
    panelClass: 'custom-dialog-container', 
      data: appointment,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.appointments.findIndex(
          (appointment) => appointment.uuid === result.uuid
        );
        if (result.remove) {
          this.appointments.splice(index, 1);
        } else {
          this.appointments[index] = result;
        }
      }
    });
  }
}
