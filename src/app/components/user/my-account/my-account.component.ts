import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUser } from 'src/app/domain/user/logged-user';
import { User } from 'src/app/domain/user/user';
import { AccountService } from 'src/app/services/account.service';
import { InformationAccountService } from 'src/app/services/information-account.service';
import { MemberService } from 'src/app/services/member.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  user: User;
  id: number;
  userLogged: LoggedUser;
  userType: number;
  requesting: boolean;s
  existsMedicalHistory: boolean;

  constructor(private userService: UserService,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService) {
    
  }


  ngOnInit() {
    
  }

  
  ionViewWillEnter(){
    this.userLogged = this.accountService.getLoggedUser();
    console.log("userLogged", this.userLogged);
    this.id = this.userLogged.id;
    this.userType = this.userLogged.userType;
    let userNew = localStorage.getItem('newUser');
    console.log('usuario nuevo: ', userNew);

    console.log("onInit");
      this.getMember();
  }


  getMember() {
    this.requesting = true;
    this.memberService.getById().subscribe(
      result => {
        console.log("getById", result);
        this.user = result.result;
        this.getExistsMedicalHistory();
      },
      error => {
        console.error(error)
      }
    );
  }

  getExistsMedicalHistory() {
    this.memberService.getExistsMedicalHistory(this.id).subscribe(
      response => {        
        this.requesting = false;
        console.log(response);
        this.existsMedicalHistory = response.result;
      },
      error => {
        console.error(error);
        this.requesting = false;
      }
    )
  }

  modifyPersonalInformation() {
    if (this.userType == 1) {
      this.router.navigate(['/user-edit']);
    } else {
      this.router.navigate(['/member-edit']);
    }
  }


}
