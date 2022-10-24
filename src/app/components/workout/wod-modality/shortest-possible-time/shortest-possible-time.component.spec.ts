import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShortestPossibleTimeComponent } from './shortest-possible-time.component';

describe('ShortestPossibleTimeComponent', () => {
  let component: ShortestPossibleTimeComponent;
  let fixture: ComponentFixture<ShortestPossibleTimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortestPossibleTimeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShortestPossibleTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
