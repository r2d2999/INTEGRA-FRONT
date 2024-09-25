import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargamateriasComponent } from './cargamaterias.component';

describe('CargamateriasComponent', () => {
  let component: CargamateriasComponent;
  let fixture: ComponentFixture<CargamateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargamateriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargamateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
