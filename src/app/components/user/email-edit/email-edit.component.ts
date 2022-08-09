import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; import { NavController } from '@ionic/angular';
;
import { Account } from 'src/app/domain/user/account';
import { LoggedUser } from 'src/app/domain/user/logged-user';
import { ControlEqual } from 'src/app/validations/control.equal';
import { AccountService } from '../../../services/account.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { MemberService } from '../../../services/member.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-email-edit',
  templateUrl: './email-edit.component.html',
  styleUrls: ['./email-edit.component.scss']
})
export class EmailEditComponent implements OnInit {
  modificationForm: FormGroup;
  sendForm: boolean = false;
  user: LoggedUser;
  email: string;
  accountId: number;
  requesting: boolean;

  constructor(private formBuilder: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private memberService: MemberService,
    private router: Router,
    private customAlertService: CustomAlertService) {
    this.user = this.accountService.getLoggedUser();
    this.getUser();
    this.accountId = this.user.accountId;
    this.modificationForm = this.formBuilder.group({
      email: '',
      newEmail: ['', [Validators.required, Validators.email]],
      repeatNewEmail: '',
      password: ['', [Validators.required]]
    }, { validators: ControlEqual.mustMatch('newEmail', 'repeatNewEmail') })
  }

  ngOnInit() {

  }

  getUser() {
    this.requesting = true;
    this.memberService.getById().subscribe(
      result => {
        console.log(result);
        this.email = result.email;
        this.modificationForm.patchValue({
          email: this.email
        });
        this.requesting = false;
      },
      error => {
        console.error(error);
        this.requesting = false;
      }
    )
  }

  get f() {
    return this.modificationForm.controls;
  }

  updateAccount() {
    let account = new Account();
    account.id = this.accountId;
    account.email = this.modificationForm.value.newEmail;
    account.password = this.modificationForm.value.password;
    return account;
  }

  submit() {
    this.sendForm = true;
    if (this.modificationForm.valid) {
      let account = this.updateAccount();
      this.accountService.updateEmail(account).subscribe(
        result => {
          console.log(result);
          this.router.navigate(['/my-account']);
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de modifcación de datos de la cuenta", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de modifcación de datos de la cuenta", ["No se pudo modificar el email."]);
          }
        });
    }

  }

}
