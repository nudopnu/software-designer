import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Attribute, AttributeViewModel, Entity, EntityViewMdel, Position } from '../models/data.model';

const MockEntities: Entity[] = [
  {
    name: 'User', attributes: [
      { keyType: 'primary', name: 'id', type: 'INT' },
      { keyType: 'none', name: 'firstname', type: 'VARCHAR(100)' },
      { keyType: 'none', name: 'lastname', type: 'VARCHAR(100)' },
    ]
  },
  {
    name: 'Account', attributes: [
      { keyType: 'primary', name: 'id', type: 'INT' },
      { keyType: 'none', name: 'email', type: 'VARCHAR(100)' },
      { keyType: 'none', name: 'password', type: 'VARCHAR(100)' },
    ]
  },
];

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  nodes: WritableSignal<EntityViewMdel[]>;
  connections = computed(() => this.connectionsFromNodes());
  isConnecting = false;
  connectionStart?: {
    entity: EntityViewMdel,
    attribute: AttributeViewModel,
    anchor: WritableSignal<Position>,
  };
  destination?: Entity;

  constructor() {
    this.nodes = signal(MockEntities.map((entity, idx) => this.toEntityViewModel(entity, { x: idx * 300, y: 0 })));
  }

  addEntity(entity: Entity, position: Position = { x: 0, y: 0 }) {
    this.nodes.update(nodes => ([...nodes, this.toEntityViewModel(entity, position)]));
  }

  toEntityViewModel(entity: Entity, position: Position = { x: 0, y: 0 }): EntityViewMdel {
    return {
      ...entity,
      attributes: entity.attributes.map(this.toAttributeViewModel),
      position: signal(position),
      hovered: signal(false),
      selected: signal(false),
    };
  }

  toAttributeViewModel(attribute: Attribute): AttributeViewModel {
    return {
      ...attribute,
      connectedTo: attribute.connectedTo ? this.toAttributeViewModel(attribute.connectedTo) : undefined,
      inAnchor: signal({ x: 0, y: 0 }),
      outAnchor: signal({ x: 0, y: 0 }),
      nameWidth: signal(100),
      typeWidth: signal(100),
    }
  }

  private attributeToEntity = computed(() => {
    const result = new Map<Attribute, EntityViewMdel>();
    this.nodes().forEach((node) => {
      node.attributes.forEach(attribute => {
        result.set(attribute, node);
      });
    });
    return result;
  });

  private connectionsFromNodes() {
    return this.nodes().flatMap((entity) =>
      entity.attributes
        .filter(attribute => attribute.keyType === 'foreign')
        .map(attribute => ({
          src: {
            node: this.attributeToEntity().get(attribute.connectedTo!)!,
            attribute: attribute.connectedTo!,
          },
          dst: {
            node: this.attributeToEntity().get(attribute)!,
            attribute,
          },
        }))
    );
  }

  logger = effect(() => {
    console.log(this.nodes());
  });


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

  startConnecting(source: AttributeViewModel, anchorElement: HTMLElement) {
    const entity = this.attributeToEntity().get(source)!;
    this.connectionStart = {
      entity,
      attribute: source,
      anchor: source.outAnchor,
    };
    this.isConnecting = true;
  }

  setDestination(entity?: Entity) {
    this.destination = entity;
  }

  abortConnecting() {
    if (!this.isConnecting) { return; }
    console.log("Abort");
    if (this.destination) {
      this.nodes.update(nodes => ([
        ...nodes.map((entity) => {
          const newAttribute: AttributeViewModel = {
            type: 'INT',
            keyType: 'foreign',
            name: this.connectionStart?.entity.name.toLowerCase() + '_id',
            connectedTo: this.connectionStart?.attribute,
            inAnchor: signal({ x: 0, y: 0 }),
            outAnchor: signal({ x: 0, y: 0 }),
            nameWidth: signal(100),
            typeWidth: signal(100),
          };
          return entity !== this.destination ? entity : {
            ...entity,
            attributes: [
              ...entity.attributes,
              newAttribute,
            ]
          };
        }),
      ]))
      this.destination.attributes.push();
    }
    this.connectionStart = undefined;
    this.isConnecting = false;
  }

}
