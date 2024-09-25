import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriasStudentComponent } from './materias-student.component';

describe('MateriasStudentComponent', () => {
  let component: MateriasStudentComponent;
  let fixture: ComponentFixture<MateriasStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriasStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MateriasStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
