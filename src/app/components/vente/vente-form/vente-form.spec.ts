import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteForm } from './vente-form';

describe('VenteForm', () => {
  let component: VenteForm;
  let fixture: ComponentFixture<VenteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
