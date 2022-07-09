import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Anamnesis } from 'src/app/domain/anamnesis/anamnesis';
import { AnamnesisPhisicalConditionComponent } from '../anamnesis-phisical-condition/anamnesis-phisical-condition.component';

@Component({
  selector: 'app-evaluation-preview',
  templateUrl: './evaluation-preview.component.html',
  styleUrls: ['./evaluation-preview.component.scss'],
})
export class EvaluationPreviewComponent implements OnInit {

  constructor() { }
  @Input() resultAnamnesis: Anamnesis;
  @Output() displayEvaluation = new EventEmitter();
  ngOnInit() {
    console.log("resultados vista previa: ", this.resultAnamnesis);
  }

  goToEvaluation() {
    this.displayEvaluation.emit();
  }




}
