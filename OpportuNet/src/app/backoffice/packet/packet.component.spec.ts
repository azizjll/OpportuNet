import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacketComponent } from './packet.component';

describe('PacketComponent', () => {
  let component: PacketComponent;
  let fixture: ComponentFixture<PacketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacketComponent]
    });
    fixture = TestBed.createComponent(PacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
