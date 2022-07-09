import { Component, OnInit } from '@angular/core';
import { Anamnesis } from 'src/app/domain/anamnesis/anamnesis';
import { AnamnesisService } from 'src/app/services/anamnesis.service';

@Component({
  selector: 'app-evaluation-detail',
  templateUrl: './evaluation-detail.component.html',
  styleUrls: ['./evaluation-detail.component.scss'],
})
export class EvaluationDetailComponent implements OnInit {
resultAnamnesis: Anamnesis;

  constructor(private anamnesisService: AnamnesisService) { }

  ngOnInit() {
    this.getAnamnesis();
  }

  getAnamnesis(){
    this.anamnesisService.getByMemberId().subscribe(
      response =>{
        console.log(response.result);
        this.resultAnamnesis = response.result;
      },
      error => console.error(error)
    )
  }
}
