import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntretienComponent } from './entretien.component';

describe('EntretienComponent', () => {
  let component: EntretienComponent;
  let fixture: ComponentFixture<EntretienComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntretienComponent]
    });
    fixture = TestBed.createComponent(EntretienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
