import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Periodization } from 'src/app/domain/workout/periodization';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { PeriodizationService } from 'src/app/services/periodization.service';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-periodization-report',
  templateUrl: './periodization-report.component.html',
  styleUrls: ['./periodization-report.component.scss'],
})
export class PeriodizationReportComponent implements OnInit {
  selectedMonth: any;
  month: number;
  attendances = [];

  goToGoals() {
    this.router.navigate(['/goals']);
  }
  goToWeek() {
    this.router.navigate(['/wod-goals']);

  }

  periodizations: Periodization[] = [];

  barChart: any;
  lineChart: any;
  @ViewChild('barCanvas1') barCanvas1;

  constructor(private router: Router,
    private periodizationService: PeriodizationService,
    private customAlertService: CustomAlertService,
    private wodService: WodService) {
    Chart.register(...registerables);

    this.getPeriodizations();
    this.getAttendances();
  }

  ngOnInit() {
    console.log(this.barCanvas1)
    // 
  }

  // ngAfterViewInit() {
  //   this.renderChart(this.barCanvas1, this.attendances);
  // }

  renderChart(canvas: ElementRef, data) {
    this.barChart = new Chart(canvas.nativeElement, {
      type: 'line',
      data:
      {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Asistencias por mes',
            data: data,
            borderColor: 'rgba(2, 255, 25, 0.5)',
            backgroundColor: 'rgba(2, 255, 25, 0.5)',
            borderWidth: 5,

          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 0,
            }
          }
        },
        scales: {
          y: {
            suggestedMin: 10,
            suggestedMax: 30
          }
        }
      }
    });
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


  getPeriodizations() {
    this.periodizationService.getByYear().subscribe(
      response => {
        console.log("periodizaciones: ", response.result);
        this.periodizations = response.result;
        if (this.periodizations.length > 0 && !this.selectedMonth) {
          let periodization = this.periodizations[this.periodizations.length - 1];
          this.month = periodization.month;
          /*   this.getWeek(periodization.id);*/
        } else {
          this.customAlertService.display("Gestión de Estadisticas", ["No hay periodizaciones registradas para el año "]);
        }
      },
      error => console.error(error))
  }

  getAttendances() {
    this.attendances = [];
    this.wodService.getAttendancesByYear().subscribe(
      response => {
        console.log("asistencias: ", response.result)
        let attendances = response.result;
        for (var i = 0; i < 12; i++) {
          let exists = attendances.find(x => x.month == i + 1);
          if (exists) {
            this.attendances[i] = exists.attendance;
          } else {
            this.attendances[i] = 0;
          }
        }
        if(this.barChart){
          this.barChart.destroy();
        }
        this.renderChart(this.barCanvas1, this.attendances);
      },
      error => console.error(error)
    )
  }
}
