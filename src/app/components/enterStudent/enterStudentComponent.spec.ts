import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterStudentComponent } from './enterStudentComponent';

describe('EnterStudentComponent', () => {
  let component: EnterStudentComponent;
  let fixture: ComponentFixture<EnterStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
