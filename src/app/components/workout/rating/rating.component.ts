import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  rate = 0;
  id: number;

  constructor(private wodService: WodService,
    private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => this.id = parseInt(params['id']))
     }

  ngOnInit() { }

  effortRate(){
    this.wodService.updateRate(this.id, this.rate).subscribe(
      response => {
        console.log("calificación guardada");
        // this.router.navigate(['/effort']);
        this.router.navigate(['/wod-week']);
      },
      error => console.error(error)
    )
  }

}
