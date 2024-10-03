import { computed, effect, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Attribute, Entity, Node } from '../models/data.model';

const MockData: Node<Entity>[] = [
  {
    data: {
      name: 'User', attributes: [
        { keyType: 'primary', name: 'id', type: 'INT', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
        { keyType: 'none', name: 'firstname', type: 'VARCHAR(100)', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
        { keyType: 'none', name: 'lastname', type: 'VARCHAR(100)', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
      ]
    },
    metadata: signal({
      x: 0,
      y: 0,
      selected: true,
      hovered: false,
    }),
  },
  {
    data: {
      name: 'Account', attributes: [
        { keyType: 'primary', name: 'id', type: 'INT', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
        { keyType: 'none', name: 'email', type: 'VARCHAR(100)', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
        { keyType: 'none', name: 'password', type: 'VARCHAR(100)', inAnchor: signal({ x: 0, y: 0 }), outAnchor: signal({ x: 0, y: 0 }) },
      ]
    },
    metadata: signal({
      x: 300,
      y: 0,
      selected: false,
      hovered: false,
    })
  },
];

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  nodes: WritableSignal<Node<Entity>[]> = signal(MockData);
  connections = computed(() => this.connectionsFromNodes());
  isConnecting = false;
  connectionStart?: {
    entity: Entity,
    attribute: Attribute,
    anchor: HTMLElement,
  };
  destination?: Entity;

  private attributeToNode = computed(() => {
    const result = new Map<Attribute, Node<Entity>>();
    this.nodes().forEach((node) => {
      node.data.attributes.forEach(attribute => {
        result.set(attribute, node);
      });
    });
    return result;
  });

  private connectionsFromNodes() {
    return this.nodes().flatMap(({ data: entity }) =>
      entity.attributes
        .filter(attribute => attribute.keyType === 'foreign').map(attribute => ({
          src: {
            node: this.attributeToNode().get(attribute.connectedTo!)!,
            attribute: attribute.connectedTo!,
          },
          dst: {
            node: this.attributeToNode().get(attribute)!,
            attribute,
          },
        }))
    );
  }

  logger = effect(() => {
    console.log(this.nodes());
  });


  attributeAnchors = new Map<Attribute, WritableSignal<{ in: HTMLElement, out: HTMLElement }>>();

  constructor() { }

  registerAttribute(attribute: Attribute, inAnchorElement: HTMLElement, outAnchorElement: HTMLElement) {
    console.log("register", attribute);

    const oldValue = this.attributeAnchors.get(attribute);
    if (oldValue) {
      oldValue.set({ in: inAnchorElement, out: outAnchorElement });
    } else {
      this.attributeAnchors.set(attribute, signal({ in: inAnchorElement, out: outAnchorElement }));
    }
  }

  startConnecting(source: Attribute, anchorElement: HTMLElement) {
    const entity = this.attributeToNode().get(source)!.data;
    this.connectionStart = {
      entity,
      attribute: source,
      anchor: anchorElement,
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
        ...nodes.map((node) => {
          const newAttribute: Attribute = {
            keyType: 'foreign',
            name: this.connectionStart?.entity.name.toLowerCase() + '_id',
            connectedTo: this.connectionStart?.attribute,
            type: 'INT',
            inAnchor: signal({ x: 0, y: 0 }),
            outAnchor: signal({ x: 0, y: 0 }),
          };
          return node.data !== this.destination ? node : {
            ...node, data: {
              ...node.data,
              attributes: [
                ...node.data.attributes,
                newAttribute,
              ]
            }
          };
        }),
      ]))
      this.destination.attributes.push();
    }
    this.connectionStart = undefined;
    this.isConnecting = false;
  }

}
