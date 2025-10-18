import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentList } from './medicament-list';

describe('MedicamentList', () => {
  let component: MedicamentList;
  let fixture: ComponentFixture<MedicamentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
