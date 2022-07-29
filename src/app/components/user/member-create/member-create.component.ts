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
  @ViewChild(MemberFormComponent, { static: false }) formMember: MemberFormComponent;
  constructor(private memberService: MemberService,
    private router: Router,
    private customAlertService: CustomAlertService,
    private accountService: AccountService,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  login() {
    let account = this.formMember.createAccount();
    this.accountService.logIn(account).subscribe(
      result => {
        console.log(result);
        this.accountService.setToken(result.token);
        this.accountService.setAuthenticated(true);
        this.accountService.setLoggedUser(result.user);
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

  submit() {
    console.log("inicio");
    const newMember = this.formMember.createMember();
    console.log("newMember", newMember);
    if (newMember !== null) {
      console.log("por aquí");
      this.memberService.add(newMember).subscribe(
        result => {
          console.log(result.result.id);
          let id = result.result.id;
          console.log("nuevo: ", this.memberService.newMember);
          this.login();
          this.customAlertService.display("Gestión de Socios", ["¿Desea cargar la historia médica?"], () => {
          localStorage.setItem('newUser', 'true');
            this.router.navigate(['/historia-medica-crear'], { queryParams: { id: this.id } });
          }, true, () => {
            localStorage.setItem('newUser', 'false');
            this.router.navigate(['/home'])
          })
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.display("Gestión de Socios", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.display("Gestión de Socios", ["No se pudo guardar el socio."]);
          }
        })
    }
    else {
      console.log("por aquí no");
    }
  }
}
