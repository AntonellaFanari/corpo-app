import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-recover-password-modal',
  templateUrl: './recover-password-modal.component.html',
  styleUrls: ['./recover-password-modal.component.scss'],
})
export class RecoverPasswordModalComponent implements OnInit {
  formRecoverPassword: FormGroup;
sent: boolean;
sentEmail: boolean;

  constructor(public modalController: ModalController,
    private formBuilder: FormBuilder,
    private accountService: AccountService) {
      this.formRecoverPassword = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
      })
     }

  ngOnInit() {}

  async close(){
    await this.modalController.dismiss();
  }

  get f(){
    return this.formRecoverPassword.controls;
  }
  submit(){
    console.log("hola");
    
    this.sent = true;
    if(this.formRecoverPassword.valid){
      this.accountService.recoverPassword(this.formRecoverPassword.value.email).subscribe(
        response => {
          this.sentEmail = true;
        },
        error => console.error(error)
      )
    }
  }
}
