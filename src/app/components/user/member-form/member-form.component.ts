import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Member } from 'src/app/domain/member/member';
import { MemberView } from 'src/app/domain/member/member-view';
import { Plan } from 'src/app/domain/member/plan';
import { Account } from 'src/app/domain/user/account';
import { PlanService } from 'src/app/services/plan.service';
import { ControlEqual } from 'src/app/validations/control.equal';
import { MemberService } from '../../../services/member.service';


@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit {
  formPersonal: FormGroup;
  formContact: FormGroup;
  formAccount: FormGroup;
  dt: Date = new Date();
  unamePattern = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}";
  sendForm: boolean = false;
  plans: Plan[] = [];
  planType: number;
  member: MemberView;
  modeCreate: boolean = true;
  @Input() step: number;
  sendFormPersonal: boolean;
  sendFormContact: boolean;
  sendFormAccount: boolean;
  @Output() requesting = new EventEmitter();


  constructor(private formBuilder: FormBuilder,
    private memberService: MemberService,
    private router: Router,
    private planService: PlanService) {
    this.getFormsGroup();
  }

  ionViewWillEnter() {
    this.getFormsGroup();
    this.sendFormAccount = false;
    this.sendFormContact = false;
    this.sendFormPersonal = false;
  }


  getFormsGroup() {
    this.dt = new Date();
    this.formPersonal = this.formBuilder.group({
      lastName: ['', Validators.required],
      name: ['', Validators.required],
      birthDate: [this.dt, Validators.required],
      socialSecurity: '',
      address: ['', Validators.required],
      planId: ['', Validators.required]
    });
    this.formContact = this.formBuilder.group({
      phone: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      instagram: '',
      facebook: ''
    });
    this.formAccount = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      repeatPassword: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
    }, { validators: ControlEqual.mustMatch('password', 'repeatPassword') });

    this.getPlans();
  }

  ngOnInit() {
    this.getFormsGroup();

  }

  getPlans() {
    this.planService.getAll().subscribe(
      result => {
        this.plans = result;
        this.requesting.emit();
      },
      error => {
        this.requesting.emit();
        console.error(error);
      }
    );
  }

  get fPersonal() {

    return this.formPersonal.controls;

  }

  get fContact() {

    return this.formContact.controls;

  }

  get fAccount() {
    return this.formAccount.controls;
  }

  selectPlan(event) {
    let value = (<any>event).target.value;
    this.formPersonal.value.planId = value;
    this.planType = this.plans.find(x => x.id == value).type;
  }

  fillInEmptyFormFields() {
    let formPersonal = this.formPersonal.value;
    for (const control in formPersonal) {
      if (formPersonal[control] == '' || "") {
        formPersonal[control] = "-";
      }
    };
    let formContact = this.formContact.value;
    for (const control in formContact) {
      if (formContact[control] == '' || "") {
        formContact[control] = "-";
      }
    }
  }

  validateForm() {
    console.log("validacion pasos");
    if (this.step == 1) {
      console.log("validacion paso 1");
      this.sendFormPersonal = true;
      return this.formPersonal.valid;
    } else if (this.step == 2) {
      console.log("validacion paso 2");
      this.sendFormContact = true;
      return this.formContact.valid;
    } else {
      console.log("validacion paso 3");
      this.sendFormAccount = true;
      let pValidator = document.getElementsByClassName("text-information")[0];
      console.log("p validator: ", pValidator);
      pValidator.classList.add("d-none");
      return this.formAccount.valid;
    }
  }


  createMember() {
    this.fillInEmptyFormFields();
    let newMember = new Member();
    newMember.lastName = this.formPersonal.value.lastName;
    newMember.name = this.formPersonal.value.name;
    newMember.birthDate = this.formPersonal.value.birthDate;
    newMember.address = this.formPersonal.value.address;
    newMember.phone = this.formContact.value.phone;
    newMember.socialSecurity = this.formPersonal.value.socialSecurity;
    newMember.emergencyPhone = this.formContact.value.emergencyPhone;
    newMember.emergencyContact = this.formContact.value.emergencyContact;
    newMember.instagram = this.formContact.value.instagram;
    newMember.facebook = this.formContact.value.facebook;
    newMember.planId = this.formPersonal.value.planId;
    if (this.modeCreate) {
      var account = this.createAccount();
      newMember.email = account.email;
      newMember.password = account.password;
    };
    console.log(newMember);
    return newMember;
  }

  createAccount() {
    this.sendFormAccount = true;
    if (this.formAccount.valid) {
      var newAccount = new Account();
      newAccount.email = this.formAccount.value.email;
      newAccount.password = this.formAccount.value.password;
      return newAccount;
    } else {
      return null;
    }
  }

  getMemberUpdate(id) {
    this.memberService.getById().subscribe(
      result => {
        this.member = result.result;
        console.log(this.member);
        this.toCompleteForm();
        this.requesting.emit("false");
      },
      error => {
        console.error(error);
        this.requesting.emit("false");
      }
    )
  }

  toCompleteForm() {
    this.modeCreate = false;
    this.dt = new Date(this.member.birthDate);
    console.log("fecha de nacimiento:", this.dt);
    this.formPersonal.patchValue({
      lastName: this.member.lastName,
      name: this.member.name,
      birthDate: new Date(this.member.birthDate),
      email: this.member.email,
      address: this.member.address,
      socialSecurity: this.member.socialSecurity,
      planId: this.member.planId
    });
    this.formContact.patchValue({
      phone: this.member.phone,
      emergencyPhone: this.member.emergencyPhone,
      emergencyContact: this.member.emergencyContact,
      instagram: this.member.instagram,
      facebook: this.member.facebook
    });

  }

  resetValidations() {
    this.sendFormPersonal = false;
    this.sendFormContact = false;
    this.sendFormAccount = false;
  }

}
