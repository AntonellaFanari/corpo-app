import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { MemberService } from 'src/app/services/member.service';
import { UserService } from 'src/app/services/user.service';
import { MemberFormComponent } from '../member-form/member-form.component';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {

  step: number = 1;

  @ViewChild(MemberFormComponent, { static: false }) formUser: MemberFormComponent;

  constructor(private userService: UserService,
     private router: Router,
      private customAlertService: CustomAlertService,
    private memberService: MemberService) { }

  ngOnInit() {
  }


  submit() {
    const newMember = this.formUser.createMember();
    if (newMember !== null) {
      this.memberService.add(newMember).subscribe(
        result => {
          console.log(result.result.id);
          let id = result.result.id;
          this.customAlertService.displayAlert("Gestión de Socios", ["¿Desea cargar la historia médica?"], () => {
            this.router.navigate(["/historia-médica-crear"], { queryParams: { id: id } })
          }, true, () => {  this.router.navigate(['/home']) })
        },
        error => {
          console.error(error);
          if (error.status === 400) {
            this.customAlertService.displayAlert("Gestión de Socios", error.error.errores);
          }
          if (error.status === 500) {
            this.customAlertService.displayAlert("Gestión de Socios", ["No se pudo guardar el socio."]);
          }
        })
    }
  }

}
