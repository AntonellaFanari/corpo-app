import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUser } from 'src/app/domain/user/logged-user';
import { User } from 'src/app/domain/user/user';
import { AccountService } from 'src/app/services/account.service';
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
  requesting: boolean;
  existsMedicalHistory: boolean;

  constructor(private userService: UserService, private memberService: MemberService, private router: Router, private accountService: AccountService) {
    this.userLogged = this.accountService.getLoggedUser();
    console.log("userLogged", this.userLogged);
    this.id = this.userLogged.id;
    this.userType = this.userLogged.userType
  }

  ngOnInit() {
    this.requesting = true;
    if (this.userType === 2) {
      this.memberService.getById().subscribe(
        result => {
          this.requesting = false;
          console.log("getById", result);
          this.user = result;
          this.getExistsMedicalHistory();          
        },
        error => {
          this.requesting = false;
          console.error(error)
        }
        );
    }
  }

  getExistsMedicalHistory(){
    this.memberService.getExistsMedicalHistory(this.id).subscribe(
      response => {
        console.log(response);
        this.existsMedicalHistory = response.result;
      },
      error => console.error(error)
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
