import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExerciseFmsEvaluationComponent } from './exercise-fms-evaluation.component';

describe('ExerciseFmsEvaluationComponent', () => {
  let component: ExerciseFmsEvaluationComponent;
  let fixture: ComponentFixture<ExerciseFmsEvaluationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseFmsEvaluationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseFmsEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
