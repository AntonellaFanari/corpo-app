import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CorpoheaderComponent } from './components/corpo/corpoheader/corpoheader.component';
import { RatingComponent } from './components/workout/rating/rating.component';
import { MyAccountComponent } from './components/user/my-account/my-account.component';
import { ShiftCreateComponent } from './components/shift/shift-create/shift-create.component';
import { LoginComponent } from './components/login/login/login.component';
import { MyDebtsComponent } from './components/user/my-debts/my-debts.component';
import { ShiftListComponent } from './components/shift/shift-list/shift-list.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MyReservationComponent } from './components/shift/my-reservation/my-reservation.component';
import { ReservationComponent } from './components/shift/reservation/reservation.component';
import { MemberFormComponent } from './components/user/member-form/member-form.component';
import { MemberEditComponent } from './components/user/member-edit/member-edit.component';
import { MedicalHistoryEditComponent } from './components/user/medical-history/medical-history-edit/medical-history-edit.component';
import { MedicalHistoryFormComponent } from './components/user/medical-history/medical-history-form/medical-history-form.component';
import { EmailEditComponent } from './components/user/email-edit/email-edit.component';
import { InjuryHistoryComponent } from './components/user/medical-history/injury-history/injury-history.component';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { CalendarModule } from 'ion2-calendar';
import { AttendanceComponent } from './components/report/attendance/attendance.component';
import { AuthInterceptor } from './interceptors/authentication-interceptor';
import { MemberCreateComponent } from './components/user/member-create/member-create.component';
import { MedicalHistoryCreateComponent } from './components/user/medical-history/medical-history-create/medical-history-create.component';
import { WodWeekComponent } from './components/workout/wod-week/wod-week.component';
import { WodComponent } from './components/workout/wod/wod.component';
import { EffortComponent } from './components/workout/reports/effort/effort.component';
import { PeriodizationComponent } from './components/workout/periodization/periodization.component';
import { PeriodizationGoalsComponent } from './components/statistics/periodization-goals/periodization-goals.component';
import { PeriodizationReportComponent } from './components/statistics/periodization-report/periodization-report.component';
import { WodGoalsComponent } from './components/statistics/wod-goals/wod-goals.component';
import { TestComponent } from './components/test/test/test.component';
import { ExerciseComponent } from './components/test/exercise/exercise.component';
import { MyTestsComponent } from './components/test/my-tests/my-tests.component';
import { ResultComponent } from './components/test/result/result.component';
import { PasswordEditComponent } from './components/user/password-edit/password-edit.component';
import { RecoverPasswordModalComponent } from './components/user/recover-password-modal/recover-password-modal.component';
import { CalendarFilterModalComponent } from './components/shift/calendar-filter-modal/calendar-filter-modal.component';
import { AnamnesisPhisicalConditionComponent } from './components/phisical-condition/anamnesis-phisical-condition/anamnesis-phisical-condition.component';
import { EvaluationDetailComponent } from './components/phisical-condition/evaluation-detail/evaluation-detail.component';
import { EvaluationPreviewComponent } from './components/phisical-condition/evaluation-preview/evaluation-preview.component';
//import { MatSliderModule } from '@angular/material/slider'; 

@NgModule({
  declarations: [
    AppComponent,
    UserCreateComponent,
    UserFormComponent,
    RatingComponent,
    CorpoheaderComponent,
    MyAccountComponent,
    ShiftCreateComponent,
    LoginComponent,
    MyDebtsComponent,
    ShiftListComponent,
    MyReservationComponent,
    ReservationComponent,
    MemberFormComponent,
    MemberEditComponent,
    MedicalHistoryEditComponent,
    MedicalHistoryFormComponent,
    RatingComponent,
    EmailEditComponent,
    InjuryHistoryComponent,
    AttendanceComponent,
    MemberCreateComponent,
    MedicalHistoryCreateComponent,
    WodComponent,
    WodWeekComponent,
    EffortComponent,
    PeriodizationComponent,
    PeriodizationGoalsComponent,
    PeriodizationReportComponent,
    WodGoalsComponent,
    TestComponent,
    ExerciseComponent,
    MyTestsComponent,
    ResultComponent,
    PasswordEditComponent,
    RecoverPasswordModalComponent,
    CalendarFilterModalComponent,
    AnamnesisPhisicalConditionComponent,
    EvaluationDetailComponent,
    EvaluationPreviewComponent
  //  MatSliderModule
  ],
  entryComponents: [MyDebtsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    CommonModule  
  ],
  providers: [
    DatePipe,
    FileTransfer,
    File,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
