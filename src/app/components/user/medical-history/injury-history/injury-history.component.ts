import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileInjury } from 'src/app/domain/member/file-injury';
import { Injury } from 'src/app/domain/member/injury';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { MemberService } from 'src/app/services/member.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
//import { File } from '@awesome-cordova-plugins/file';
import { File } from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'app-injury-history',
  templateUrl: './injury-history.component.html',
  styleUrls: ['./injury-history.component.scss']
})
export class InjuryHistoryComponent implements OnInit {
  injury: boolean = false;
  upperLimbs: string[] = ["Cervical", "Hombro", "Brazo", "Codo", "Muñeca", "Manos", "Torso"];
  lowerLimbs: string[] = ["Cadera", "Pierna", "Rodilla", "Tibia", "Tobillo", "Pie"];
  optionsLimbs: boolean = true;
  files: Array<any> = [];
  urls = [];
  injuries = [];
  nameInjury: string;
  medicalHistoryId: number;
  injuryFiles: FileInjury[];
  injuryId: number;
  memberId: number;
  fileTransfer: FileTransferObject;
  selectedFile: boolean;
  requesting: boolean;

  constructor(private memberService: MemberService,
    private route: ActivatedRoute,
    private router: Router,
    private customAlertService: CustomAlertService,
    private transfer: FileTransfer,
    private file: File,) {
    this.route.queryParams.subscribe(params => {
      this.memberId = parseInt(params['id']),
        this.medicalHistoryId = parseInt(params['medicalHistoryId'])
    });
   
    this.fileTransfer = this.transfer.create();
  }

  ngOnInit() {
    
    this.checkedClear(3);
    this.getAllInjuries(this.medicalHistoryId);

   
  }

  getAllInjuries(id: number) {
    this.requesting = true;
    this.injuryFiles = [];
    this.memberService.getAllInjuries(id).subscribe(
      result => {
        console.log(result);
        this.injuries = result;
        for (var i = 0; i < this.injuries.length; i++) {
          var files = this.injuries[i].files;
          for (var j = 0; j < files.length; j++) {
            files[j].name = files[j].name.substr(0, 20);
            this.injuryFiles.push(files[j]);
          }
        };
        this.requesting = false;
        
      },
      error => {console.error(error); 
      this.requesting = false;
    }
    )
  }


  checkedInjury(event) {
    let value = (<any>event).target.value;
    this.injury = (value == 1);

  }

  selectLimb(event) {
    let value = (<any>event).target.value;
    this.nameInjury = value;
  }

  checkedLimbs(event) {
    let value = (<any>event).target.value;
    this.optionsLimbs = !this.optionsLimbs;
    this.checkedClear(value);
  }

  public onFileSelection(event: any): void {
    const files: FileList = event.target.files;
    this.files.splice(0, this.files.length);
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      this.files.push(file);
      console.log(this.files);
    }

    this.urls = [];

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    console.log(this.urls);
    this.selectedFile = true;
  }

  selectInjury(event) {
    console.log(event);
    let value = (<any>event).target.value
    if (value == "all") {
      this.getAllInjuries(this.medicalHistoryId);
    } else {
      this.injuryFiles = this.injuries[value].files;
    }

  }

  checkedClear(option) {
    if (option == 1) {
      (<HTMLInputElement>document.getElementById("LowerLimb")).value = "";
    } if (option == 2) {
      (<HTMLInputElement>document.getElementById("UpperLimb")).value = "";
    } else {
      (<HTMLInputElement>document.getElementById("LowerLimb")).value = "";
      (<HTMLInputElement>document.getElementById("UpperLimb")).value = "";
    }
  }

  deleteFile(id) {
    this.memberService.deleteFile(id).subscribe(
      result => {
        console.log(result);
        this.getAllInjuries(this.medicalHistoryId);
      },
      error => console.error(error)
    )
  }

  addInjury() {
    console.log("pase");
    var newInjury = new Injury();
    console.log(this.nameInjury);
    newInjury.name = this.nameInjury;
    newInjury.medicalHistoryId = this.medicalHistoryId;
    if (newInjury.name != undefined) {
      this.memberService.addInjury(newInjury).subscribe(
        result => {
          let id = result.result.id;
          this.checkedClear(3);
          this.memberService.addFile(id, this.files).subscribe(
            result => {
              console.log(result);
              this.selectedFile = false;
              this.getAllInjuries(this.medicalHistoryId);
            },
            error => {
              console.error(error);
              this.customAlertService.display("Gestión de antecedentes de lesiones", [error.error.errores]);
            });
        },
        error => {
          console.error(error);
          this.customAlertService.display("Gestión de antecedentes de lesiones", [error.error])
        })
    } else {
      this.customAlertService.display("Gestión de antecedentes de lesiones", ["Debe seleccionar una lesión."]);

    }

  }

  return() {
    this.router.navigate(['/medical-history-edit'], { queryParams: { id: this.memberId, medicalHistoryId: this.medicalHistoryId } });
  }

  toGo() {
    console.log("nuevo: ", this.memberService.newMember);
    let newUser = localStorage.getItem('newUser');
    if (newUser == 'false') {
     this.router.navigate(['/my-account']);
    } else {
      localStorage.removeItem('newUser');
      localStorage.setItem('newUser', 'false');
      this.router.navigate(['/login']);
    }
  }

  // downloadDeprecated(i) {
  //   console.log(i);
  //   console.log(this.injuryFiles[i]);
  //   let fileName = this.injuryFiles[i].path;
  //   console.log(fileName);
  //   this.memberService.download(fileName).subscribe(
  //     (response: any) => {
  //       let binaryData = [];
  //       binaryData.push(response);
  //       let downloadLink = document.createElement('a');
  //       downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {
  //         type: response.type
  //       }));
  //       if (fileName)
  //         downloadLink.setAttribute('download', fileName);
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
  //     }
  //   )
  // }

  // download(i) {
  //   let fileName = this.injuryFiles[i].path;
  //   const url = 'http://www.example.com/file.pdf';
  //   this.fileTransfer.download(fileName, this.file.dataDirectory + 'file.pdf').then((entry) => {
  //     console.log('download complete: ' + entry.toURL());
  //   }, (error) => {
  //     // handle error
  //   });
  // }

  download(i) {
    console.log(i);
    console.log(this.injuryFiles[i]);
    let fileName = this.injuryFiles[i].path;
    console.log(fileName);
    this.memberService.download(fileName).subscribe(
      (response: any) => {
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {
          type: response.type
        }));
        if (fileName)
          downloadLink.setAttribute('download', fileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    )
  }

}
