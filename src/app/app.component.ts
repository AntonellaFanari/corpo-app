import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { LoggedUser } from './domain/user/logged-user';
import { AccountService } from './services/account.service';
import { Location } from '@angular/common';
import OneSignal from 'onesignal-cordova-plugin';
import { MemberService } from './services/member.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  userLogged: string;
  public appPages = [
    { title: 'Corpo', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];


  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  guid: string;
  logueado: boolean;
  viewLogin: boolean;

  constructor(private accountService: AccountService,
    private platform: Platform,
    private alertController: AlertController,
    private router: Router,
    private location: Location,
    private memberService: MemberService) {
    this.backButtonEvent();
    this.logueado = this.accountService.isAuthenticated();
    let userLogged = this.accountService.getLoggedUser();
    if(userLogged){
      this.userLogged = userLogged.lastName + " " + userLogged.name;}
    this.getUserLogged(this.userLogged);
   

  }


  getUserLogged(user){
    this.logueado = this.accountService.isAuthenticated();
    if (this.logueado) {
      this.viewLogin = false;
      this.userLogged = user;
    }else{
      if(user !== ""){
        this.viewLogin = true; 
      }else{
        this.viewLogin = false;
      }                                              
    }
  }

  getMember(){
    this.memberService.getById().subscribe(
      response => {
        console.log("socio: ", response.result);
        this.userLogged
      }
    )
  }

  oneSignalInit(): void {
    // Uncomment to set OneSignal device logging to VERBOSE  
   // OneSignal.setLogLevel(6, 0);
    console.log("init")

    // NOTE: Update the setAppId value below with your OneSignal AppId.
/*
    OneSignal.setAppId("d6082c87-a24f-4f4b-b63c-da6919618143");

    OneSignal.setNotificationOpenedHandler((jsonData) => this.router.navigate(['/my-account']));
    this.guid = this.generateUUID();
    OneSignal.setExternalUserId(this.guid)

    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
      console.log("User accepted notifications: " + accepted);
    });*/
  }

  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
        if (this.router.url != '/home') {
          // await this.router.navigate(['/']);
          await this.location.back();
        } else if ((this.router.url === '/home') || (this.router.url === '/')) {
          if (new Date().getTime() - this.lastTimeBackPress >= this.timePeriodToExit) {
            this.lastTimeBackPress = new Date().getTime();
            this.presentAlertConfirm();
          } else {
            navigator['app'].exitApp();
          }
        }
      });
    });
  }

  async showNotification(data) {
    const alert = await this.alertController.create({
      header: 'corpo',
      message: data,
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: (blah) => { }
      }]
    });

    await alert.present();
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      // header: 'Confirm!',
      header: 'corpo',
      message: 'Estás seguro que deseas salir de la app?',
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: (blah) => { }
      }, {
        text: 'Salir',
        handler: () => {
          navigator['app'].exitApp();
        }
      }]
    });

    await alert.present();
  }


  ngOnInit() {
    this.oneSignalInit();
  }

  signOff() {
    localStorage.clear();
    this.accountService.setAuthenticated(false);
    this.viewLogin = false;
  }
}
