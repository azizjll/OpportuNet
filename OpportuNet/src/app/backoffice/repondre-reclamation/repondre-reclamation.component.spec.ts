import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepondreReclamationComponent } from './repondre-reclamation.component';

describe('RepondreReclamationComponent', () => {
  let component: RepondreReclamationComponent;
  let fixture: ComponentFixture<RepondreReclamationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepondreReclamationComponent]
    });
    fixture = TestBed.createComponent(RepondreReclamationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
