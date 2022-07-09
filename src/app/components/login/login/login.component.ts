import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Account } from 'src/app/domain/user/account';
import { AccountService } from 'src/app/services/account.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { RecoverPasswordModalComponent } from '../../user/recover-password-modal/recover-password-modal.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  sent: boolean = false;
  return: string = '';
  requesting: boolean;
  formRecoverPassword: FormGroup;
  send: boolean;
  open = false;
  canDismiss = false;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private customAlertService: CustomAlertService,
    private router: Router,
    private route: ActivatedRoute,
    public modalController: ModalController) {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.formRecoverPassword = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]]
    })
  }

  ngOnInit() {
  }

  get f() {
    return this.formLogin.controls;
  }

  logIn() {
    console.log("llegue");
    this.sent = true;
    if (this.formLogin.valid) {
      this.requesting = true;
      let account = new Account()
      {
        account.email = this.formLogin.value.email,
          account.password = this.formLogin.value.password
      };
      this.accountService.logIn(account).subscribe(
        result => {
          console.log(result);
          this.accountService.setToken(result.token);
          this.accountService.setAuthenticated(true);
          this.accountService.setLoggedUser(result.user);
          window.location.href = '/home';
        },
        error => {
          this.requesting = false;
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de Autenticación de Usuarios", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de Autenticación de Usuarios", ["Hubo un problema al intentar iniciar sesión."]);
          }
        });
    } else {
      this.customAlertService.display("Gestión de Autenticación de Usuarios", ["El Email ingresado no es correcto."]);
    }

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: RecoverPasswordModalComponent,
      backdropDismiss: true,
      animated: true,
      cssClass: 'my-custom-modal-css'
    });
    return await modal.present();
  }

  recoverPassword(){
    this.send = true;
    if(this.formRecoverPassword.valid){
      this.accountService.recoverPassword(this.formRecoverPassword.value.email).subscribe(
        response => {
          console.log("recuperar contraseña");
        },
        error => console.error(error)
      )
    }
  }

}
