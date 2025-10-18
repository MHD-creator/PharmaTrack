import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentForm } from './medicament-form';

describe('MedicamentForm', () => {
  let component: MedicamentForm;
  let fixture: ComponentFixture<MedicamentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
