import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  constructor(
    private alertController: AlertController
    /*private modalService: NgbModal*/) { }

  displayAlert(title: string, messages: string[], thenFunction: any = null, displayCancel = false, cancelFunction: any = null) {
    /* console.log("display alert")
     const modalRef = this.modalService.open(CustomAlertComponent, { backdrop: "static", keyboard: false });
     modalRef.componentInstance.title = title;
     modalRef.componentInstance.messages = messages;
     modalRef.componentInstance.displayCancel = displayCancel;
 
     modalRef.result.then((result) => {
       console.log("")
       if (result) {
         modalRef.result.then(thenFunction);
       }
       else {
         modalRef.result.then(cancelFunction);
       }
     });
     */
  }


  async display(title: string, messages: string[], thenFunction: any = null, displayCancel = false, cancelFunction: any = null) {

    var buttons: AlertButton[] = [];
    if (displayCancel) buttons.push({
      text: 'Cancelar',
      role: 'cancel',
      handler: cancelFunction ? cancelFunction : () => { }
    });

    buttons.push({
      text: 'Aceptar',
      handler: thenFunction ? thenFunction : () => { }
    });

    const alert = await this.alertController.create({
      header: title,
      message: messages.join(''),
      cssClass: 'custom-alert',
      buttons: buttons
    });

    await alert.present();
  }
}
