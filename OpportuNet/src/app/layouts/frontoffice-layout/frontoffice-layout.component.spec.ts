import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontofficeLayoutComponent } from './frontoffice-layout.component';

describe('FrontofficeLayoutComponent', () => {
  let component: FrontofficeLayoutComponent;
  let fixture: ComponentFixture<FrontofficeLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FrontofficeLayoutComponent]
    });
    fixture = TestBed.createComponent(FrontofficeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
