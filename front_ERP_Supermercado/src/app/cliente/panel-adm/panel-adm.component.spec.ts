import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelADMComponent } from './panel-adm.component';

describe('PanelADMComponent', () => {
  let component: PanelADMComponent;
  let fixture: ComponentFixture<PanelADMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelADMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelADMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
