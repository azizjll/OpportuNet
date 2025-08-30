import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPacketComponent } from './list-packet.component';

describe('ListPacketComponent', () => {
  let component: ListPacketComponent;
  let fixture: ComponentFixture<ListPacketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPacketComponent]
    });
    fixture = TestBed.createComponent(ListPacketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
