import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberView } from 'src/app/domain/member/member-view';
import { CustomAlertService } from '../../../../services/custom-alert.service';
import { MemberService } from '../../../../services/member.service';
import { MedicalHistoryFormComponent } from '../medical-history-form/medical-history-form.component';

@Component({
  selector: 'app-medical-history-create',
  templateUrl: './medical-history-create.component.html',
  styleUrls: ['./medical-history-create.component.scss']
})
export class MedicalHistoryCreateComponent implements OnInit {
  member: MemberView;
  id: number;
  age: number;
  medicalHistoryCreate: boolean = false;
  planType: number;
  basicMedicalHistory: boolean = true;
  medicalHistoryId: number;

  @ViewChild(MedicalHistoryFormComponent, { static: false }) formMedicalHistory: MedicalHistoryFormComponent;
  constructor(private memberService: MemberService, private route: ActivatedRoute, private router: Router, private customAlertService: CustomAlertService) {
    this.route.queryParams.subscribe(
      params => { this.id = parseInt(params['id']) });
  }

  ngOnInit() {
    this.memberService.getById().subscribe(
      result => {
        console.log(result);
        this.member = result;
        this.planType = this.member.planType
        console.log(this.planType);
      },
      error => console.error(error)
    );
    this.memberService.getAge(this.id).subscribe(
      result => {
        this.age = result.result.age;
        console.log(this.age);
      },
      error => console.error(error)
    );
    this.memberService.getMedicalHistoryByIdMember(this.id).subscribe(
      result => {
        console.log(result);
        this.medicalHistoryId = result.result.id;
        this.router.navigate(["/historia-médica-editar"], { queryParams: { id: this.id, medicalHistoryId: this.medicalHistoryId } });
      },
      error => {console.error(error);
        if (error.status == 400) {
          console.log("no existe");
        }
    })
  }

  create() {
    this.medicalHistoryCreate = true;
  }

  submit() {
    var newMedicalHistory = this.formMedicalHistory.createMedicalHistory();
    this.memberService.addMedicalHistory(this.id, newMedicalHistory).subscribe(
      result => {
        if (this.planType == 2) {
          this.router.navigate(['/my-account']);
        } else {
          this.medicalHistoryId = result.result.id;
          this.router.navigate(['/injury-history'], { queryParams: { id: this.id, medicalHistoryId: this.medicalHistoryId } });
        }
      },
      error => {
        console.error(error);
        if (error.status === 400) {
          this.customAlertService.displayAlert("Gestión de Socios", error.error.errores);
        }
        if (error.status === 500) {
          this.customAlertService.displayAlert("Gestión de Socios", ["No se pudo guardar la historia médica."]);
        }
      });
  }
}
