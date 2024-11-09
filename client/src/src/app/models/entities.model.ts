import { createPlatform, signal, WritableSignal } from "@angular/core";
import { Attribute, Position, Table } from "./data.model";

export interface TableEntity extends Table {
    id: string;
    position: WritableSignal<Position>;
    selected: boolean;
    hovered: boolean;
};

export interface AttributeEntity extends Attribute {
    id: string;
    parent: TableEntity;
    connectedTo?: AttributeEntity;
    inAnchor: WritableSignal<Position>;
    outAnchor: WritableSignal<Position>;
    nameWidth: number;
    typeWidth: number;
}

export function toTableEntity(table: Table, position: Position = { x: 0, y: 0 }): TableEntity {
    return {
        ...table,
        position: signal(position),
        hovered: false,
        selected: false,
        id: crypto.randomUUID(),
    }
}

export function toAttributeEntity(parent: TableEntity, attribute: Attribute, connectedTo?: AttributeEntity): AttributeEntity {
    return {
        ...attribute,
        parent,
        connectedTo,
        inAnchor: signal({ x: 0, y: 0 }),
        outAnchor: signal({ x: 0, y: 0 }),
        nameWidth: 100,
        typeWidth: 100,
        id: crypto.randomUUID(),
    }
}
