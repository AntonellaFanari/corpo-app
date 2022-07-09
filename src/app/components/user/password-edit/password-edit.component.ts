import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountNewPassword } from 'src/app/domain/user/new-password';
import { AccountService } from 'src/app/services/account.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { ControlEqual } from 'src/app/validations/control.equal';

@Component({
  selector: 'app-password-edit',
  templateUrl: './password-edit.component.html',
  styleUrls: ['./password-edit.component.scss'],
})
export class PasswordEditComponent implements OnInit {
  modificationForm: FormGroup;
  sendForm: boolean = false;
  accountId: number;
  unamePattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,15}$";

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private customAlertService: CustomAlertService) {
    this.accountId = this.accountService.getLoggedUser().accountId;
    this.modificationForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      repeatNewPassword: ''
    }, { validators: ControlEqual.mustMatch('newPassword', 'repeatNewPassword') })
  }

  ngOnInit() {
  }

  get f() {
    return this.modificationForm.controls;
  }

  updatePassword() {
    let account = new AccountNewPassword();
    account.id = this.accountId;
    account.password = this.modificationForm.value.password;
    account.newPassword = this.modificationForm.value.newPassword;
    return account;
  }

  submit() {
    this.sendForm = true;
    if (this.modificationForm.valid) {
      let account = this.updatePassword();
      this.accountService.updatePassword(account).subscribe(
        result => {
          console.log(result);
          this.customAlertService.display("Gestión de modifcación de datos de la cuenta", ["Contraseña actualizada."]);
          window.location.href = '/my-account'
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de modifcación de datos de la cuenta", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de modifcación de datos de la cuenta", ["No se pudo modificar ."]);
          }
        });
    }
  }

}
