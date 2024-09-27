import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeAttributeComponent } from './node-attribute.component';

describe('NodeAttributeComponent', () => {
  let component: NodeAttributeComponent;
  let fixture: ComponentFixture<NodeAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
