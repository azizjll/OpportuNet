import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCandidaturesComponent } from './liste-candidatures.component';

describe('ListeCandidaturesComponent', () => {
  let component: ListeCandidaturesComponent;
  let fixture: ComponentFixture<ListeCandidaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeCandidaturesComponent]
    });
    fixture = TestBed.createComponent(ListeCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
