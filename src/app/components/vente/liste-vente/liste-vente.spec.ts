import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeVente } from './liste-vente';

describe('ListeVente', () => {
  let component: ListeVente;
  let fixture: ComponentFixture<ListeVente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeVente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeVente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
