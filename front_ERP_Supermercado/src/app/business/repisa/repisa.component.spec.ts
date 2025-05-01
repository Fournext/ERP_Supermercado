import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepisaComponent } from './repisa.component';

describe('RepisaComponent', () => {
  let component: RepisaComponent;
  let fixture: ComponentFixture<RepisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepisaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
