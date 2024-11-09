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
    ref: Table | Attribute;
    startPos: number;
    endPos: number;
};

export interface DataModel {
    description: string;
    tables: Table[];
};

export interface Table {
    name: string;
    attributes: Attribute[];
};

export type KeyType = 'none' | 'primary' | 'foreign';

export interface Attribute {
    keyType: KeyType;
    name: string;
    type: string;
};

export type Position = {
    x: number;
    y: number;
};
