import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { LoggedUser } from 'src/app/domain/user/logged-user';
import { InformationAccountService } from 'src/app/services/information-account.service';

import { AccountService } from '../../../services/account.service';
import { CustomAlertService } from '../../../services/custom-alert.service';
import { MemberService } from '../../../services/member.service';
import { MemberFormComponent } from '../member-form/member-form.component';
import { MyAccountComponent } from '../my-account/my-account.component';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  id: number;
  user: LoggedUser;
  step = 1;
  requesting: boolean;
  @ViewChild(MemberFormComponent, { static: true }) formMember: MemberFormComponent;

  constructor(private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private customAlertService: CustomAlertService,
    private accountService: AccountService) {
    this.user = this.accountService.getLoggedUser();
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params['id']);
      console.log("formulario1: ", this.formMember);
    });
}


ngOnInit() {
  this.requesting = true;
  this.formMember.getMemberUpdate(this.id);
  console.log("step: ", this.step);
}

ionViewWillEnter(){
  console.log("step: ", this.step);
  this.step = 1;
}




finishRequesting(event){
  this.requesting = false;
}

next() {
  if (this.step != 2) {
    let valid = this.formMember.validateForm();
    console.log("es valido?", valid);
    if (valid) this.step++;
  }
}

return () {
  if (this.step == 1) {
    this.router.navigate(['/my-account']);
  } else {
    this.step--;
  }
}

  public submit() {
  let valid = this.formMember.validateForm();
  if (valid) {
    var memberUpdate = this.formMember.createMember();
    console.log(memberUpdate);
    this.memberService.update(memberUpdate).subscribe(
      result => {
        console.log("guarde cambios");
        this.router.navigate(['/my-account']);
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          this.customAlertService.display("Gestión de Socios", error.error.errores);
        }
        if (error.status === 500) {
          this.customAlertService.display("Gestión de Socios", ["No se pudo modificar los datos."]);
        }
      });
  }

}


}
