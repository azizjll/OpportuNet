import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MecandidatureComponent } from './mecandidature.component';

describe('MecandidatureComponent', () => {
  let component: MecandidatureComponent;
  let fixture: ComponentFixture<MecandidatureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MecandidatureComponent]
    });
    fixture = TestBed.createComponent(MecandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
