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

export type Attribute = {
    isKey: boolean;
    name: string;
    type: string;
    connectedTo?: Attribute;
};
