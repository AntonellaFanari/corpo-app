import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Attendance, Status } from 'src/app/domain/attendance';
import { Credit } from 'src/app/domain/member/credit';
import { MemberAttendance } from 'src/app/domain/member/member-attendance';
import { MemberView } from 'src/app/domain/member/member-view';
import { AttendanceService } from 'src/app/services/attendance.service';
import { CreditService } from 'src/app/services/credit.service';
import { Shift } from '../../../domain/shift';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { MemberService } from '../../../services/member.service';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-shift-create',
  templateUrl: './shift-create.component.html',
  styleUrls: ['./shift-create.component.scss'],
})
export class ShiftCreateComponent implements OnInit {

  attendances: MemberAttendance[] = [];
  shiftId: number;
  viewSelectAddMember: boolean = false;
  filterMember = "";
  member: MemberView;
  members: MemberView[] = [];
  viewBtnAddMember = true;
  credit: Credit;
  shift: Shift;
  quotaAvailable: number;
  currentDate = new Date(Date.now());
  @Output() getAllShifts = new EventEmitter();

  constructor(private attendanceService: AttendanceService, private memberService: MemberService,
    private customAlertService: CustomAlertService, private creditService: CreditService, private shiftService: ShiftService,
    private dp: DatePipe) {
  }

  ngOnInit() {
    console.log(this.shiftId);
    this.getAllMembers();
    console.log(this.currentDate);
  }

  modalClick() {
    console.log(document.getElementById("modal-attendance"))
    document.getElementById("modal-attendance").click();
    this.viewBtnAddMember = true;
    console.log(this.currentDate);
  }

  getShift(id) {
    this.shiftService.getById(id).subscribe(
      result => {
        console.log(result);
        this.shift = result.result;
        this.shift.day = this.getDayShift(this.shift.day) + " " + this.shift.day.substr(8, 2) + "/" + this.shift.day.substr(5, 2);
        this.shift.hour = this.shift.hour.substr(0, 5);
        this.getAll(id);
      },
      error => console.error(error)
    )
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

  getAll(id) {
    this.shiftId = id;
    this.attendanceService.getAllByIdShift(id).subscribe(
      result => {
        console.log(result);
        this.attendances = result.result;
        this.quotaAvailable = this.shift.quota - this.attendances.length;
      },
      error => console.error(error)
    )
  }

  getAllMembers() {
    this.memberService.getAll().subscribe(
      result => {
        console.log(result);
        this.members = result;
      },
      error => console.error(error)
    )
  }

  viewSelectListMember() {
    this.viewSelectAddMember = !this.viewSelectAddMember;
    this.viewBtnAddMember = false;
  
  }


  clearInput() {
    this.filterMember = "";
  }

  completeInput() {
    if (this.member) {
      this.filterMember = this.member.lastName + " " + this.member.name;
    }
  }

  selectMember(event) {
    this.member = event;
    console.log(this.member);
    this.filterMember = this.member.lastName + " " + this.member.name;
    this.getCreditMember(this.member.creditId);
  }

  getCreditMember(id) {
    this.creditService.getById(id).subscribe(
      result => {
        console.log(result);
        this.credit = result.result;
      },
      error => console.error(error)
    )
  }

  createAttendance() {
    let newAttendance = new Attendance();
    newAttendance.memberId = this.member.id;
    newAttendance.shiftId = this.shiftId;
    newAttendance.status = Status.reserved;
    return newAttendance;
  }

  updateCredit() {
    console.log(this.credit.expiration);
    console.log(this.currentDate);
    let expirationDate = new Date(this.credit.expiration.substr(0, 10));
    console.log(expirationDate);
    if (this.currentDate.getTime() > expirationDate.getTime()) {
      this.credit.negative = this.credit.negative + 1;
    } else {
      this.credit.creditConsumption = this.credit.creditConsumption + 1;
    }
    
  }


  addMember() {
    if (this.credit.negative > 5) {
      this.customAlertService.displayAlert("Gestión de Asistencias", ["El socio superó la cantidad de negativos permitidos."]);
    } else {
    let attendance = this.createAttendance();
    this.attendanceService.add(attendance).subscribe(
      result => {
        console.log(result);
        this.updateCredit();
        this.creditService.update(this.credit).subscribe(
          result => {
            this.getAll(this.shiftId);
            this.viewSelectAddMember = false;
            this.viewBtnAddMember = true;
            this.getAllShifts.emit();
          },
          error => {
            console.error(error);
            if (error.status === 400) {
              this.customAlertService.displayAlert("Gestión de Asistencias", error.error.errores);
            }
            if (error.status === 500) {
              this.customAlertService.displayAlert("Gestión de Asistencias", ["Hubo un problema al descontar el crédito."]);
            }
          }
        )     
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          this.customAlertService.displayAlert("Gestión de Asistencias", error.error.errores);
        }
        if (error.status === 500) {
          this.customAlertService.displayAlert("Gestión de Asistencias", ["Hubo un problema al reservar."]);
        }
      })
    }

  }

  cancell(id, memberId) {
    let creditId = this.members.find(x => x.id == memberId).creditId;
    this.getCreditMember(creditId);
    this.customAlertService.displayAlert("Gestión de Asistencias", ["¿Está seguro que desea cancelar la reserva del turno?"], () => {
      this.attendanceService.cancelReservation(id, this.credit).subscribe(
        result => {
          this.getAll(this.shiftId);
        },
        error => {
          console.error(error);
          this.customAlertService.displayAlert("Eliminación", ["Error al intentar cancelar la reserva del turno."]);
        })
    }, true);
  }
}

