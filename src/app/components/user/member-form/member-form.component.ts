import { Component, OnInit } from '@angular/core';
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
  formCreate: FormGroup;
  formAccount: FormGroup;
  dt: Date = new Date();
  unamePattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,15}$";
  sendForm: boolean = false;
  plans: Plan[] = [];
  planType: number;
  member: MemberView;
  modeCreate: boolean = true;

  constructor(private formBuilder: FormBuilder, 
    private memberService: MemberService, 
    private router: Router, 
    private planService: PlanService) {
      
    this.formCreate = this.formBuilder.group({
      lastName: ['', Validators.required],
      name: ['', Validators.required],
      birthDate: [this.dt, Validators.required],
      phone: ['', Validators.required],
      socialSecurity: '',
      address: ['', Validators.required],
      emergencyPhone: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      instagram: '',
      facebook: '',
      planId: ['', Validators.required]
    });
    this.formAccount = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
      repeatPassword: '',
    }, { validators: ControlEqual.mustMatch('password', 'repeatPassword') })
  }
  ngOnInit() {
    this.planService.getAll().subscribe(
      result => {
        this.plans = result;
      },
      error => console.error(error)
    );
  }

  get f() {

    return this.formCreate.controls;

  }

  get fAccount() {
    return this.formAccount.controls;
  }

  selectPlan(event) {
    let value = (<any>event).target.value;
    this.formCreate.value.planId = value;
    this.planType = this.plans.find(x => x.id == value).type;
  }

  fillInEmptyFormFields() {
    let form = this.formCreate.value;
    for (const control in form) {
      if (form[control] =='' || "") {
        form[control] = "-";
      }
    }
  }

  createMember() {
    this.sendForm = true;
    if (this.formCreate.valid) {
      this.fillInEmptyFormFields();
      let newMember = new Member();
      newMember.lastName = this.formCreate.value.lastName;
      newMember.name = this.formCreate.value.name;
      newMember.birthDate = this.formCreate.value.birthDate;
      newMember.address = this.formCreate.value.address;
      newMember.phone = this.formCreate.value.phone;
      newMember.socialSecurity = this.formCreate.value.socialSecurity;
      newMember.emergencyPhone = this.formCreate.value.emergencyPhone;
      newMember.emergencyContact = this.formCreate.value.emergencyContact;
      newMember.instagram = this.formCreate.value.instagram;
      newMember.facebook = this.formCreate.value.facebook;
      newMember.planId = this.formCreate.value.planId;
      if (this.modeCreate) {
        var account = this.createAccount();
        newMember.email = account.email;
        newMember.password = account.password;
      };
      console.log(newMember);
      return newMember;
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

  getMemberUpdate(id) {
    this.memberService.getById().subscribe(
      result => {
        this.member = result;
        console.log(this.member);
        this.toCompleteForm();
      },
      error => console.error(error)
    )
  }

  toCompleteForm() {
    this.modeCreate = false;
    this.dt = new Date(this.member.birthDate);
    this.formCreate.patchValue({
      lastName: this.member.lastName,
      name: this.member.name,
      birthDate: new Date(this.member.birthDate),
      phone: this.member.phone,
      email: this.member.email,
      address: this.member.address,
      socialSecurity: this.member.socialSecurity,
      emergencyPhone: this.member.emergencyPhone,
      emergencyContact: this.member.emergencyContact,
      instagram: this.member.instagram,
      facebook: this.member.facebook,
      planId: this.member.planId
    })

  }

}
