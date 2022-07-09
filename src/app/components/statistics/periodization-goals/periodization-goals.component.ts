import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Periodization } from 'src/app/domain/workout/periodization';
import { PeriodizationService } from 'src/app/services/periodization.service';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-periodization-goals',
  templateUrl: './periodization-goals.component.html',
  styleUrls: ['./periodization-goals.component.scss'],
})
export class PeriodizationGoalsComponent implements OnInit {

  barChart: any;
  lineChart: any;
  @ViewChild('barCanvas1') barCanvas1;
  month: string;
  id: number;
  attendances = [];
  periodization: Periodization;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private periodizationService: PeriodizationService,
    private wodService: WodService) {
    Chart.register(...registerables);

    this.route.queryParams
      .subscribe((params) => {
        this.id = parseInt(params['id']);
        this.getPeriodization();
        this.getAttendances(this.id);
      });
  }

  ngOnInit() {
    console.log(this.barCanvas1)
    // 
  }

  // ngAfterViewInit() {
  //   this.renderChart(this.barCanvas1, [3, 4, 3, 5, 5]);
  // }

  renderChart(canvas: ElementRef, data) {
    this.barChart = new Chart(canvas.nativeElement, {
      type: 'line',
      data:
      {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
          {
            label: 'Asistencias',
            data: data,
            borderColor: 'rgba(2, 255, 25, 0.5)',
            backgroundColor: 'rgba(2, 255, 25, 0.5)',
            borderWidth: 5
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
            suggestedMin: 0,
            suggestedMax: 7
          }
        }
      }
    });
  }

  goToGoals() {
    console.log("dsfsdf")
    this.router.navigate(['/goals']);
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

  getPeriodization() {
    this.periodizationService.getById(this.id).subscribe(
      response => {
        console.log("periodizacion: ", response.result);
        this.periodization = response.result;
      },
      error => console.error(error))
  }

  getAttendances(i) {
    this.attendances = [];
    this.wodService.getAttended(i).subscribe(
      response => {
        console.log("asistencias por semana: ", response.result);
        let attended = response.result;
        this.attendances = [0, 0, 0, 0];
        for (var i = 1; i < 5; i++) {
          let exist = attended.find(x => x.weekNumber == i);
          if (exist) {
            this.attendances[i - 1] = attended[i - 1].attendance;
          }

        }
        console.log("attendances: ", this.attendances);
        if(this.barChart){
          this.barChart.destroy();
        }
        this.renderChart(this.barCanvas1, this.attendances);
      },
      error => console.error)
  }
}


