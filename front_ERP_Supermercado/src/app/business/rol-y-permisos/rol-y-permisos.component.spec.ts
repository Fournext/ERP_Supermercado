import { ComponentFixture, TestBed } from '@angular/core/testing';

import  RolYPermisosComponent  from './rol-y-permisos.component';

describe('RolYPermisosComponent', () => {
  let component: RolYPermisosComponent;
  let fixture: ComponentFixture<RolYPermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolYPermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolYPermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
