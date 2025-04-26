import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPersonalComponent } from './crear-personal.component';

describe('CrearPersonalComponent', () => {
  let component: CrearPersonalComponent;
  let fixture: ComponentFixture<CrearPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
