import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutQuestionModalComponent } from './ajout-question-modal.component';

describe('AjoutQuestionModalComponent', () => {
  let component: AjoutQuestionModalComponent;
  let fixture: ComponentFixture<AjoutQuestionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutQuestionModalComponent]
    });
    fixture = TestBed.createComponent(AjoutQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
