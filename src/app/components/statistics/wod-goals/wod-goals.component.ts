import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { filter } from 'rxjs/operators';
import { PeriodizationWeek } from 'src/app/domain/workout/periodization';
import { Wod } from 'src/app/domain/workout/wod';
import { PeriodizationService } from 'src/app/services/periodization.service';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-wod-goals',
  templateUrl: './wod-goals.component.html',
  styleUrls: ['./wod-goals.component.scss'],
})
export class WodGoalsComponent implements OnInit {

  @ViewChild('barCanvas1') barCanvas1;
  @ViewChild('barCanvas2') barCanvas2;


  barChart: any;
  lineChart: any;
  week: string;
  month: string;
  previousUrl: string;
  id: number;
  periodizationWeek: PeriodizationWeek;
  wods: Wod[] = [];
  labels = [];
  dataRate = [];
  dataIntensity = [];
  dataRest = [];
  displayChart = true;

  constructor(private router: Router,
     private route: ActivatedRoute,
     private periodizationService: PeriodizationService,
     private wodService: WodService,
     private location: Location) {
    Chart.register(...registerables);
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params['id']);
      this.getPeriodizationWeek();
    });
  

  }


  getPeriodizationWeek() {
    this.displayChart = true;
    this.wods = [];
    this.periodizationService.getByPeriodizationWeek(this.id).subscribe(
      response => {
        console.log("periodizationWeek: ", response.result);
        this.periodizationWeek = response.result;
        if(this.periodizationWeek.planned == 'true'){
          this.getWods();
        }else{
          this.displayChart = false;
        }
        
      },
      error => console.error(error)
    )
  }

  getWods() {
    this.wodService.getByPeriodizationId(this.periodizationWeek.periodizationId, parseInt(this.periodizationWeek.weekNumber))
      .subscribe(
        response => {
          console.log("wods: ", response.result);
          this.wods = response.result;
          this.wods.forEach(x => {
            this.labels.push("Día Nº "+ x.wodNumber);
            this.dataRate.push(x.rate);
            this.dataRest.push(x.rest);
            if (x.intensityType == 2) {
              this.dataIntensity.push(x.intensity * 10 / 100);
            } else {
              this.dataIntensity.push(x.intensity);
            }
            
          });
          if(this.barChart){
            this.barChart.destroy();
          }
          this.barChartMethod(this.barCanvas1, this.dataRate, 'esfuerzo percibido');
          this.barChartMethod(this.barCanvas2, this.dataRest, 'hs de descanso')
        },
        error => console.error(error)
      )
  }

  goBackFunction() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {

        console.log('prev:', event.url);
        this.previousUrl = event.url;
        this.router.navigate(['this.previousUrl'])
      });
    

    
  }

  ngOnInit() { }


  barChartMethod(canvas: ElementRef, data, label) {
    this.barChart = new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: 
            'rgba(2, 255, 25, 0.5)'
          ,
          borderColor: 
            'rgba(2, 255, 25, 0.5)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: {
            ticks: {
              align:'start',
              precision: 0
            }
          },
          xAxes: {
            ticks: {
              align:'start',
              precision: 0
            }
          }
        }
      }
    });
  }

  // ngAfterViewInit() {
  //   this.barChartMethod(this.barCanvas1, [0, 7, 9, 9, 7, 8, 0], 'esfuerzo percibido');
  //   this.barChartMethod(this.barCanvas2, [0, 9, 8, 7, 7, 8, 0], 'descanso');
  // }

  getIntencityData(intencity: string){
    var intencityValues = intencity.split("x")
    var up = intencityValues[0];
    var down = intencityValues[1];
    
  }

  return(){
    this.location.back();
  }

}

