import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ShiftList } from 'src/app/domain/shift-list';
import { ShiftService } from 'src/app/services/shift.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { ShiftCreateComponent } from '../shift-create/shift-create.component';
import { IonRouterOutlet } from '@ionic/angular';
import { ModalPageComponent } from '../../modal/modal-page/modal-page.component';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss'],
})
export class ShiftListComponent implements OnInit {

  shifts: ShiftList[] = [];
  from: string;
  to: string;
  @ViewChild(ShiftCreateComponent, { static: true }) shiftCreateComponent: ShiftCreateComponent;







  constructor(public modalController: ModalController,
    private shiftService: ShiftService, 
    private dp: DatePipe, 
    private customAlertService: CustomAlertService,
    public routerOutlet: IonRouterOutlet
    ) {
    this.from = this.dp.transform(new Date(), 'yyyy-MM-dd');
    console.log(this.from);
    let to = new Date();
    this.to = this.dp.transform(to.setDate(to.getDate() + 30), 'yyyy-MM-dd');
    console.log(this.to);
  }

  ngOnInit() {
    this.getAll()
  }



async presentModal() {
  const modal = await this.modalController.create({
    component: ModalPageComponent,
    cssClass: 'my-custom-class',
    swipeToClose: true,
    presentingElement: this.routerOutlet.nativeEl
  });
  return await modal.present();
}


  /*
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }*/

  getAll() {
    this.shifts = [];
    this.shiftService.getAll(this.from, this.to, 0).subscribe(
      result => {
        console.log(result);
        this.getShiftsList(result);
      },
      error => {
        console.error(error);
      }
    )
  }

  getShiftsList(result) {
    for (var i = 0; i < result.length; i++) {
      var shiftList = new ShiftList();
      const shift = result[i];
      shiftList.id = shift.id;
      shiftList.checked = false;
      shiftList.day = this.getDayShift(shift.day) + " " + shift.day.substr(8, 2) + "/" + shift.day.substr(5, 2);
      shiftList.hour = shift.hour.substr(0, 5);
      shiftList.quota = shift.quota;
      shiftList.available = shift.available;
      shiftList.classId = shift.class.id;
      shiftList.className = shift.class.name;
      shiftList.userId = shift.user.id;
      shiftList.userName = shift.user.lastName + " " + shift.user.name;
      this.shifts.push(shiftList);
    }
    console.log(this.shifts);
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

  goToAttendances(id) {
    this.shiftCreateComponent.modalClick();
    this.shiftCreateComponent.getShift(id);
  }
}
