import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFormationsComponent } from './admin-formations.component';

describe('AdminFormationsComponent', () => {
  let component: AdminFormationsComponent;
  let fixture: ComponentFixture<AdminFormationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFormationsComponent]
    });
    fixture = TestBed.createComponent(AdminFormationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
