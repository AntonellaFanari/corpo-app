import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/domain/user/account';
import { Role } from 'src/app/domain/user/role';
import { User } from 'src/app/domain/user/user';
import { UserView } from 'src/app/domain/user/user-view';
import { UserService } from 'src/app/services/user.service';
import { Password } from 'src/app/validations/password';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {


  roles: Role[] = [];
  formCreate: FormGroup;
  formAccount: FormGroup;
  sendForm: boolean = false;
  dt: Date = new Date();
  user: UserView;
  modeCreate: boolean = true;
  unamePattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,15}$";
  constructor(private formBuilder: FormBuilder, private userService: UserService) {
    this.formCreate = this.formBuilder.group({
      lastName: ['', Validators.required],
      name: ['', Validators.required],
      birthDate: [this.dt, Validators.required],
      phone: ['', Validators.required], 
      address: ['', Validators.required],
      roleId: ['', Validators.required]
    });
    this.formAccount = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      repeatPassword: '',
    }, { validators: Password.mustMatch('password', 'repeatPassword') })
  }
  ngOnInit() {
    this.userService.getRoles().
      subscribe(
        result => {
          this.roles = result;
          console.log(this.roles);
        },
        error => console.error(error)
      )
  }
  get f() {

    return this.formCreate.controls;
  }

  get fAccount() {
    return this.formAccount.controls;
  }
  createUser() {
    this.sendForm = true;
    if (this.formCreate.valid) {
      var newUser = new User();
      newUser.roleId = parseInt(this.formCreate.value.roleId);
      newUser.lastName = this.formCreate.value.lastName;
      newUser.name = this.formCreate.value.name;
      newUser.birthDate = this.formCreate.value.birthDate;
      newUser.phone = this.formCreate.value.phone;
      newUser.address = this.formCreate.value.address;
      if (this.modeCreate) {
        var account = this.createAccount();
        newUser.email = account.email;
        newUser.password = account.password;
      }
      return newUser;
    } else {
      return null;
    }
  }

  createAccount() {
    this.sendForm = true;
    if (this.formAccount.valid) {
      var newAccount = new Account();
      newAccount.email = this.formAccount.value.email;
      newAccount.password = this.formAccount.value.password;
      return newAccount;
    } else {
      return null;
    }
  }

  getUserUpdate(id) {
    this.userService.getById(id).subscribe(
      result => {
        this.user = result;
        console.log(this.user);
        this.toCompleteForm();
      },
      error => console.error(error)
    )
  }

  toCompleteForm() {
    this.modeCreate = false;
      this.dt = new Date(this.user.birthDate);
      this.formCreate.patchValue({
        lastName: this.user.lastName,
        name: this.user.name,
        birthDate: new Date(this.user.birthDate),
        phone: this.user.phone,
        email: this.user.email,
        address: this.user.address,
        roleId: this.user.roleId,
      })
    }
}
