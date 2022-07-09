import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnamnesisPhisicalConditionComponent } from './anamnesis-phisical-condition.component';

describe('AnamnesisPhisicalConditionComponent', () => {
  let component: AnamnesisPhisicalConditionComponent;
  let fixture: ComponentFixture<AnamnesisPhisicalConditionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamnesisPhisicalConditionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnamnesisPhisicalConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
