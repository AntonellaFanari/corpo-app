import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class InformationAccountService {
 
  change = false;
 
  @Output() update: EventEmitter<boolean> = new EventEmitter();
 
  updateInformation() {
    this.change = true;
    console.log("pase por servicio");
    this.update.emit(this.change);
  }
 
}
