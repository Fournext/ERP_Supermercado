import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaSalidaComponent } from './boleta-salida.component';

describe('BoletaSalidaComponent', () => {
  let component: BoletaSalidaComponent;
  let fixture: ComponentFixture<BoletaSalidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletaSalidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletaSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
