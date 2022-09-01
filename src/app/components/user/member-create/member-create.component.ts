import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Account } from 'src/app/domain/user/account';
import { AccountService } from '../../../services/account.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { MemberService } from '../../../services/member.service';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'app-member-create',
  templateUrl: './member-create.component.html',
  styleUrls: ['./member-create.component.scss']
})
export class MemberCreateComponent implements OnInit {
  id: number;
  step = 1;
  @ViewChild(MemberFormComponent, { static: true }) formMember: MemberFormComponent;
  requesting = true;
  requestingSave = false;

  constructor(private memberService: MemberService,
    private router: Router,
    private customAlertService: CustomAlertService,
    private accountService: AccountService,
    private alertController: AlertController) {
  }

  ngOnInit() {
    this.resetProgressSteps();
    this.requesting = true;
    this.step = 1;
    this.formMember.getFormsGroup();
    this.formMember.resetValidations();
    this.requestingSave = false;
  }

  ionViewWillEnter() {
    this.resetProgressSteps();
    this.requesting = true;
    this.step = 1;
    this.formMember.getFormsGroup();
    this.formMember.resetValidations();
    this.requestingSave = false;
  }

  login() {
    let account = this.formMember.createAccount();
    console.log("socio a loguearse: ", account);
    this.accountService.logIn(account).subscribe(
      result => {
        console.log(result);
        this.accountService.setToken(result.token);
        this.accountService.setAuthenticated(true);
        this.accountService.setLoggedUser(result.user);
        localStorage.setItem('newUser', 'true');
        this.requesting = false;
        this.requestingSave = false;
        this.router.navigate(['/historia-medica-crear'], { queryParams: { id: this.id } });
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          this.customAlertService.display("Gestión de Autenticación de Usuarios", error.error.errores);
        }
        if (error.status === 500) {
          this.customAlertService.display("Gestión de Autenticación de Usuarios", ["Hubo un problema al intentar iniciar sesión."]);
        }
      });
  }

  next() {
    let valid = this.formMember.validateForm();
    console.log("es valido?", valid);
    if (valid) {
      if (this.step != 3) {

        this.setClassStep(this.step, 'next');
        console.log("paso: ", this.step);
      } else {
        this.submit();

      }
      this.step++;

    }
  }

  finishRequesting(event) {
    this.requesting = false;
  }


  return() {
    if (this.step == 1) {
      this.router.navigate(['/login']);
    } else {
      this.setClassStep(this.step, 'return')
      this.step--;
    }
  }

  resetProgressSteps() {
    let progressSteps = document.querySelectorAll('.progress-step');
    for (let i = 0; i < progressSteps.length; i++) {
      const element = progressSteps[i];
      if (i != 0) {
        let progress = document.getElementById("progress");
        progressSteps[i].classList.remove('progress-step-active');
        let progressActive = document.querySelectorAll(".progress-step-active");
        progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
      }

    }
  }

  setClassStep(step, btn) {
    let index = step - 1;
    let progress = document.getElementById("progress");
    let progressSteps = document.querySelectorAll('.progress-step');
    console.log("lista: ", progressSteps);
    if (btn === 'next') {
      progressSteps[index + 1].classList.add('progress-step-active');
    } else {
      progressSteps[index].classList.remove('progress-step-active');
      progressSteps[index - 1].classList.add('progress-step-active');
    }

    let progressActive = document.querySelectorAll(".progress-step-active");
    progress.style.width = ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
  }

  goToLogin() {
    localStorage.setItem('newUser', 'false');
    this.router.navigate(['/login']);

  }



  submit() {
    this.requesting = true;
    this.requestingSave = true;
    console.log("inicio");
    let valid = this.formMember.validateForm();
    if (valid) {
      const newMember = this.formMember.createMember();
      const account = this.formMember.createAccount();
      console.log("newMember", newMember);
      console.log("por aquí");
      this.memberService.add(newMember).subscribe(
        result => {
          console.log("nuevo socio id", result.result.id);
          let id = result.result.id;
          console.log("nuevo: ", this.memberService.newMember);
          this.requestingSave = false;
        },
        error => {
          this.requesting = false;
          this.requestingSave = false;
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de Socios", error.error.errores);
            this.step = 3;
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de Socios", ["No se pudo guardar el socio."]);
          }
        })
    }
    else {
      this.requesting = false;
      console.log("por aquí no");
    }
  }
}
