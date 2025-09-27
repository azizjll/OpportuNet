import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationCandidatComponent } from './reclamation-candidat.component';

describe('ReclamationCandidatComponent', () => {
  let component: ReclamationCandidatComponent;
  let fixture: ComponentFixture<ReclamationCandidatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamationCandidatComponent]
    });
    fixture = TestBed.createComponent(ReclamationCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
