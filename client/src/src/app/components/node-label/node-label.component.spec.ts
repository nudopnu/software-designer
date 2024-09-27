import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeLabelComponent } from './node-label.component';

describe('NodeLabelComponent', () => {
  let component: NodeLabelComponent;
  let fixture: ComponentFixture<NodeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
