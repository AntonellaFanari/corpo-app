import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  constructor(private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private router: Router
    ) {
      this.getUserLogged();
     }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  getUserLogged(){
    let logueado = this.accountService.isAuthenticated();
    if (logueado) {
      this.router.navigate(['/home']);
    }else{
      this.router.navigate(['/login'])                                                  
    }
  }

}
