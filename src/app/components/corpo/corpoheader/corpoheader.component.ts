import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'corpo-header',
  templateUrl: './corpoheader.component.html',
  styleUrls: ['./corpoheader.component.scss'],
})
export class CorpoheaderComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {}

}
