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
requesting = false;

  constructor(private anamnesisService: AnamnesisService) { }

  ngOnInit() {
    this.getAnamnesis();
  }

  getAnamnesis(){
    this.requesting = true;
    this.anamnesisService.getByMemberId().subscribe(
      response =>{
        console.log(response.result);
        this.resultAnamnesis = response.result;
        this.requesting = false;
      },
      error => this.requesting = false
    )
  }
}
