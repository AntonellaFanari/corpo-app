import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { CalendarModalOptions } from 'ion2-calendar';
/*import { IonRouterOutlet, ModalController } from '@ionic/angular';*/
import { AttendanceReservation } from 'src/app/domain/member/attendance-reservation';
import { Credit } from 'src/app/domain/member/credit';
import { Attendance, Status } from '../../../domain/attendance';
import { ShiftList } from '../../../domain/shift-list';
import { AccountService } from '../../../services/account.service';
import { AttendanceService } from '../../../services/attendance.service';
import { CreditService } from '../../../services/credit.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { ShiftService } from '../../../services/shift.service';
import { CalendarFilterModalComponent } from '../calendar-filter-modal/calendar-filter-modal.component';

@Component({
  selector: 'app-my-reservation',
  templateUrl: './my-reservation.component.html',
  styleUrls: ['./my-reservation.component.scss']
})
export class MyReservationComponent implements OnInit {
  reservations: AttendanceReservation[] = [];
  idMember: number;
  displayShifts: boolean = false;
  shifts: ShiftList[] = [];
  from: string;
  to: string;
  creditId: number;
  credit: Credit;
  className = "";
  currentDate = new Date(Date.now());
  currentCredit: number;
  negativesAvailables: number;
  maxNegatives: number;
  selectedShiftId: number;
  requesting: boolean;
  requestingShifts: boolean;
  openModal: boolean;
  openCalendarFilter: boolean;
  reservationsFilter: AttendanceReservation[] = [];
  dateType = "reserves";


  constructor(private attendanceService: AttendanceService,
    private accountService: AccountService,
    private shiftService: ShiftService,
    private dp: DatePipe,
    private creditService: CreditService,
    private customAlertService: CustomAlertService,
    public modalController: ModalController,
    public routerOutlet: IonRouterOutlet,
    private router: Router) {

    this.idMember = this.accountService.getLoggedUser().id;
    this.creditId = this.accountService.getLoggedUser().creditId;
    this.from = this.dp.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.from);
  }

  ngOnInit() {
    this.getAllReservations();
    this.getNegatives();
  }

  getAllReservations() {
    this.requesting = true;
    this.attendanceService.getAllReservations().subscribe(
      result => {
        console.log("reservaciones: ", result.result);
        this.requesting = false;
        this.reservations = result.result;
        this.getReservationsShiftsList(this.reservations);
        this.getCreditMember();
      },
      error => {
        console.error(error)
        this.requesting = false;
      }
    )
  }

  getReservationsShiftsList(reservations) {
    for (var i = 0; i < reservations.length; i++) {
      var shiftList = new ShiftList();
      const shift = reservations[i].shift;
      shiftList.id = shift.id;
      shiftList.day = this.getDayShift(shift.day) + " " + shift.day.substr(8, 2) + "/" + shift.day.substr(5, 2);
      shiftList.hour = shift.hour.substr(0, 5);
      shiftList.quota = shift.quota;
      shiftList.available = shift.available;
      shiftList.className = shift.class.name;
      console.log(shiftList);
      this.reservations[i].shift = shiftList;
    }
    console.log(this.reservations);
  }

  getDayShift(date) {
    let dayShift = '';
    const day = new Date(date).getDay();
    switch (day) {
      case 0: dayShift = "Domingo";
        break;
      case 1: dayShift = "Lunes";
        break;
      case 2: dayShift = "Martes";
        break;
      case 3: dayShift = "Miercoles";
        break;
      case 4: dayShift = "Jueves";
        break;
      case 5: dayShift = "Viernes";
        break;
      case 6: dayShift = "Sábado";
        break;
      default:
    }
    return dayShift;
  }


  getAllShift() {
    this.shifts = [];
    this.shiftService.getAll(this.from, this.from, 0).subscribe(
      result => {
        this.requestingShifts = false;
        console.log("turnos disponibles esta semana:", result);
        this.getShiftsList(result.result);
      },
      error => {
        this.requestingShifts = false
        console.error(error);
      }
    )
  }


  getShiftsList(result) {
    this.shifts = [];
    for (var i = 0; i < result.length; i++) {
      var shiftList = new ShiftList();
      const shift = result[i];
      shiftList.id = shift.id;
      shiftList.day = this.getDayShift(shift.day) + " " + shift.day.substr(8, 2) + "/" + shift.day.substr(5, 2);
      shiftList.hour = shift.hour.substr(0, 5);
      shiftList.quota = shift.quota;
      shiftList.available = shift.available;
      shiftList.classId = shift.class.id;
      shiftList.className = shift.class.name;
      let reserved = this.reservations.find(x => x.shiftId == shift.id);
      if (reserved) { shiftList.reserved = true } else { shiftList.reserved = false };
      console.log(shiftList);
      this.shifts.push(shiftList);
    }
    console.log("turnos disponibles: ", this.shifts);
  }

  filterModal() {
    if (!this.openCalendarFilter) {
      this.openFilterModal();
    } else {
      this.closeFilterModal();
    }
  }

  async openFilterModal() {
    this.openCalendarFilter = true;
    const modal = await this.modalController.create({
      component: CalendarFilterModalComponent,
      componentProps: {
        'dateType': this.dateType
      },
      animated: true,
      cssClass: 'my-custom-modal-calendar-filter'
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (this.dateType == "reserves") {
        if (modalDataResponse.data.result.length > 0) {
          console.log("recibido: ", modalDataResponse);
          console.log('reservaciones recibidas : ', modalDataResponse.data.result);
          this.getReservationsFilter(modalDataResponse.data.result);
        }
      } else {
        if(modalDataResponse.data.result.length > 0){
        console.log('turnos recibidos : ', modalDataResponse.data.result);
        this.getShiftFilter(modalDataResponse.data.result)}
      }


      this.openCalendarFilter = modalDataResponse.data.open;
    });
    return await modal.present();
  }

  getReservationsFilter(reservations) {
    this.reservations = reservations;
    console.log("reservaciones filtradas: ", this.reservations);
    this.getReservationsShiftsList(this.reservations);
    this.getCreditMember();
  }

  getShiftFilter(shifts) {
    this.getShiftsList(shifts);
    console.log("turnos filtrados: ", this.shifts);
  }

  async closeFilterModal() {
    this.openCalendarFilter = false;
    await this.modalController.dismiss();
  }

  close() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    // this.modalController.dismiss({
    //   'dismissed': true
    // });
    this.openModal = false;
  }

  getNegatives() {
    this.attendanceService.getAllSettings().subscribe(
      response => {
        this.maxNegatives = parseInt(response.result.find(x => x.name == "maxNegative").value);
      },
      error => console.error(error))
  }



  viewShifts() {
    this.displayShifts = true;
    this.dateType = "shifts";
    console.log("tipo de datos: ", this.dateType);
    this.getAllReservations();
    this.getAllShift();
  }

  viewReserve() {
    this.displayShifts = false;
    this.requestingShifts = true;
    this.dateType = "reserves";
    this.getAllReservations();
  }

  reserve(id, className) {
    // document.getElementById("trigger-button").click();
    this.openModal = true;
    this.selectedShiftId = id;
    this.className = className;

  }

  getCreditMember() {
    this.creditService.getById(this.creditId).subscribe(
      result => {
        console.log(result);
        this.credit = result.result;
        this.currentCredit = this.credit.initialCredit - this.credit.creditConsumption;
        console.log("credito actual: ", this.currentCredit);
        console.log("negativos usados: ", this.credit.negative);
        this.negativesAvailables = (this.maxNegatives - this.credit.negative);
        console.log("negativos disponibles: ", this.negativesAvailables);
        console.log(this.maxNegatives);
        console.log(this.negativesAvailables);
      },
      error => console.error(error)
    )
  }


  createAttendance() {
    let newAttendance = new Attendance();
    newAttendance.memberId = this.idMember;
    newAttendance.shiftId = this.selectedShiftId;
    newAttendance.status = Status.reserved;
    return newAttendance;
  }

  updateCredit() {
    if (this.currentCredit > 0) {
      this.credit.creditConsumption = this.credit.creditConsumption + 1;
    } else {
      this.credit.negative = this.credit.negative + 1;
    }
  }

  confirmReserve() {
    if (this.credit.negative < this.maxNegatives) {
      let attendance = this.createAttendance();
      this.attendanceService.add(attendance).subscribe(
        result => {
          this.getAllReservations();
          this.getNegatives();
          this.close();
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de Reservas", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de Reservas", ["Hubo un problema al reservar."]);
          }
        })
    } else {
      this.customAlertService.display("Gestión de Reservas", ["No tienes crédito/negativos disponibles."]);

    }

  }

  cancell(id) {
    this.customAlertService.display("Gestión de Reservas", ["¿Está seguro que desea cancelar la reserva del turno?"], () => {
      this.attendanceService.cancelReservation(id, this.credit).subscribe(
        result => {
          this.getAllReservations();
        },
        error => {
          console.error(error);
          this.customAlertService.display("Gestión de Reservas", ["Error al intentar cancelar la reserva del turno."]);
        })
    }, true);
  }

}
