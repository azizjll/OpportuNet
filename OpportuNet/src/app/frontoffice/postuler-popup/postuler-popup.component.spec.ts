import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulerPopupComponent } from './postuler-popup.component';

describe('PostulerPopupComponent', () => {
  let component: PostulerPopupComponent;
  let fixture: ComponentFixture<PostulerPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostulerPopupComponent]
    });
    fixture = TestBed.createComponent(PostulerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
