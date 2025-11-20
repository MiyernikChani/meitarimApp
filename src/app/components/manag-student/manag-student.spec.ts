import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagStudent } from './manag-student';

describe('ManagStudent', () => {
  let component: ManagStudent;
  let fixture: ComponentFixture<ManagStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagStudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
