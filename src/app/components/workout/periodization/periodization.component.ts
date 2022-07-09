import { Component, OnInit } from '@angular/core';
import { Periodization } from '../../../domain/workout/periodization';
import { PeriodizationService } from '../../../services/periodization.service';

@Component({
  selector: 'app-periodization',
  templateUrl: './periodization.component.html',
  styleUrls: ['./periodization.component.scss'],
})
export class PeriodizationComponent implements OnInit {
  
  periodization: Periodization;
  requesting: boolean;

  constructor(private periodizationService: PeriodizationService) { }

  ngOnInit() {
    this.requesting = true;
    this.periodizationService.get().subscribe((periodization) => {
      this.requesting = false;
      this.periodization = periodization.result;
      console.log(this.periodization)
    }, error => {
      this.requesting = false;
    })
  }
}
