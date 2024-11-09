import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { AttributeStore } from '../models/attribute.store';
import { Attribute, Position, Table } from '../models/data.model';
import { TableStore } from '../models/entity.store';
import { MockTables } from '../models/tables.mock';
import { AttributeEntity, TableEntity, toAttributeEntity } from '../models/entities.model';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  tableStore = inject(TableStore);
  attributeStore = inject(AttributeStore);
  connections = computed(() => {

  });
  isConnecting = false;
  connectionStart?: {
    attribute: AttributeEntity,
    anchor: WritableSignal<Position>,
  };
  destination?: TableEntity;

  constructor() {
    MockTables.forEach((entity, idx) => {
      this.tableStore.addEntity(entity, { x: idx * 300, y: 0 });
    });
  }

  attributeAnchors = new Map<Attribute, WritableSignal<{ in: HTMLElement, out: HTMLElement }>>();

  registerAttribute(attribute: Attribute, inAnchorElement: HTMLElement, outAnchorElement: HTMLElement) {
    console.log("register", attribute);

    const oldValue = this.attributeAnchors.get(attribute);
    if (oldValue) {
      oldValue.set({ in: inAnchorElement, out: outAnchorElement });
    } else {
      this.attributeAnchors.set(attribute, signal({ in: inAnchorElement, out: outAnchorElement }));
    }
  }

  startConnecting(source: AttributeEntity, anchorElement: HTMLElement) {
    this.connectionStart = {
      attribute: source,
      anchor: source.outAnchor,
    };
    this.isConnecting = true;
  }

  setDestination(entity?: TableEntity) {
    this.destination = entity;
  }

  abortConnecting() {
    if (!this.isConnecting || !this.connectionStart || !this.destination) { return; }
    const parent = this.connectionStart.attribute.parent;
    this.attributeStore.addAttribute(toAttributeEntity(this.destination, {
      name: parent.name.toLowerCase() + '_id',
      keyType: 'foreign',
      type: 'INT',
    }, this.connectionStart.attribute));
    this.connectionStart = undefined;
    this.isConnecting = false;
  }

}
