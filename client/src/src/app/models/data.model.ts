import { WritableSignal } from "@angular/core";

export interface DesignDocument {
    description: string;
    userStories: UserStory[];
    dataModel: DataModel;
};

export interface UserStory {
    summary: string;
    description: string;
};

export interface User {
    name: string;
    description: string;
};

export interface Occurence {
    ref: Entity | Attribute;
    startPos: number;
    endPos: number;
};

export interface DataModel {
    description: string;
    entities: Entity[];
};

export interface Entity {
    name: string;
    attributes: Attribute[];
};

export type KeyType = 'none' | 'primary' | 'foreign';

export interface Attribute {
    keyType: KeyType;
    name: string;
    type: string;
    connectedTo?: Attribute;
};

export type Position = {
    x: number;
    y: number;
}

export interface EntityViewMdel extends Entity {
    attributes: AttributeViewModel[];
    position: WritableSignal<Position>;
    selected: WritableSignal<boolean>;
    hovered: WritableSignal<boolean>;
};

export interface AttributeViewModel extends Attribute {
    connectedTo?: AttributeViewModel;
    inAnchor: WritableSignal<Position>;
    outAnchor: WritableSignal<Position>;
    nameWidth: WritableSignal<number>;
    typeWidth: WritableSignal<number>;
}
