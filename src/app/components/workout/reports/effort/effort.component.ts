import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, LinearScale, LineController, LineElement, PointElement, registerables, Title } from 'chart.js';
import { Periodization, PeriodizationWeek } from 'src/app/domain/workout/periodization';
import { Wod } from 'src/app/domain/workout/wod';
import { PeriodizationService } from 'src/app/services/periodization.service';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-effort',
  templateUrl: './effort.component.html',
  styleUrls: ['./effort.component.scss'],
})
export class EffortComponent {

  @ViewChild('barCanvas') barCanvas;
  periodization: Periodization;
  wods: Wod[] = [];
  labels = [];
  dataRate = [];
  dataIntensity = [];
  barChart: any;
  lineChart: any;
  periodizationWeek: PeriodizationWeek;
  displayChart: boolean;
  requesting = false;

  constructor(private periodizationService: PeriodizationService,
    private wodService: WodService) {
    Chart.register(...registerables);
    this.getPeriodization();
    //Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

  }

  lineChartMethod() {/*
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11','1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        datasets: [
          {
            label: 'esfuerzo',
            fill: false,
            //lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [5, 6, 7, 7, 7, 8, 7, 6, 5, 6, 5, 6,7, 6, 7, 8, 7, 8, 7, 9, 10, 6, 8, 8, 9],
            spanGaps: false,
          }
        ]
      }
    });*/
  }



  barChartMethod(canvas: ElementRef, data, labels) {
    this.barChart = new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'esfuerzo percibido',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.3)',
            'rgba(54, 162, 235, 0.3)',
            'rgba(255, 206, 86, 0.3)',
            'rgba(75, 192, 192, 0.3)',
            'rgba(115, 132, 154, 0.3)',
            'rgba(255, 159, 64, 0.3)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(115, 132, 154, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {

        }
      }
    });
  }


  // ngAfterViewInit() {
  //   // this.lineChartMethod()
  //   this.barChartMethod(this.barCanvas1, [0, 7, 9, 9, 7, 8, 0]);
  //   this.barChartMethod(this.barCanvas2, [0, 8, 6, 9, 7, 8, 0]);
  //   this.barChartMethod(this.barCanvas3, [0, 8, 10, 9, 6, 8, 0]);
  //   this.barChartMethod(this.barCanvas4, [0, 10, 6, 9, 7, 10, 0]);
  // }


  getPeriodization() {
    this.requesting = true;
    this.periodizationService.get().subscribe(
      response => {
        console.log("periodization: ", response.result);
        this.periodization = response.result;
        this.requesting = false;
      },
      error => this.requesting = false
    )
  }

  getChart(i) {
    if(this.periodization.periodizationWeeks[i].planned == 'true'){
      this.periodizationWeek = this.periodization.periodizationWeeks[i];
      this.getWods(i);
      this.displayChart = true;
    }
    
  }

  getWods(i) {
    this.wods = [];
    this.dataRate = [];
    this.labels = [];
    this.wodService.getByPeriodizationId(this.periodization.id, parseInt(this.periodization.periodizationWeeks[i].weekNumber))
      .subscribe(
        response => {
          console.log("wods: ", response.result);
          this.wods = response.result;
          this.wods.forEach(x => {
            this.labels.push("Dia Nº " + x.wodNumber);
            this.dataRate.push(x.rate);
            if (x.intensityType == 2) {
              this.dataIntensity.push(x.intensity * 10 / 100);
            } else {
              this.dataIntensity.push(x.intensity);
            }

          });
          if(this.barChart){
            this.barChart.destroy();
          }
          this.barChartMethod(this.barCanvas, this.dataRate, this.labels);
        },
        error => console.error(error)
      )
  }

  getMonth(month) {
    switch (month) {
      case 1:
        return "Enero";
      case 2:
        return "Febrero";
      case 3:
        return "Marzo";
      case 4:
        return "Abril";
      case 5:
        return "Mayo";
      case 6:
        return "Junio";
      case 7:
        return "Julio";
      case 8:
        return "Agosto";
      case 9:
        return "Septiembre";
      case 10:
        return "Octubre";
      case 11:
        return "Noviembre";
      case 12:
        return "Diciembre";
      default:
    }
  }

  hideChart(){
    this.displayChart = false;
  }
}
