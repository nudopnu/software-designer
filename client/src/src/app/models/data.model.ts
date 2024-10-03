import { WritableSignal } from "@angular/core";

export type DesignDocument = {
    description: string;
    userStories: UserStory[];
    dataModel: DataModel;
};

export type UserStory = {
    summary: string;
    description: string;
};

export type User = {
    name: string;
    description: string;
};

export type Occurence = {
    ref: Entity | Attribute;
    startPos: number;
    endPos: number;
};

export type DataModel = {
    description: string;
    entities: Entity[];
};

export type Entity = {
    name: string;
    attributes: Attribute[];
};

export type KeyType = 'none' | 'primary' | 'foreign';

export type Attribute = {
    keyType: KeyType;
    name: string;
    type: string;
    connectedTo?: Attribute;
    inAnchor: NodeMetadata;
    outAnchor: NodeMetadata;
};

export type NodeMetadata = WritableSignal<{
    x: number;
    y: number;
    selected?: boolean;
    hovered?: boolean;
}>;

export type Node<T> = {
    data: T;
    metadata: NodeMetadata;
};