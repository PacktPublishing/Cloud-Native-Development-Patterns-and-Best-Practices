// Event Envelope Definition
export interface Event {
    id: string;
    type: string;
    timestamp: number;
    partitionKey: string;
    tags: { [key: string]: string | number };
}

// Item Domain Entity Definition
export interface Item {
    id: string;
    name: string;
    status: Status;
    description: string;
}

export enum Status {
    Wip = 'wip',
    Submitted = 'submitted',
    Approved = 'approved',
    Published = 'published',
}

// Item Event Definitions
export interface ItemEvent extends Event {
    item: Item
}

export interface ItemChangeEvent extends Event {
    item: {
        old?: Item,
        new?: Item,
    }
}

// Valid Event Types
export const ITEM_CREATED_EVENT = 'item-created';
export const ITEM_UPDATED_EVENT = 'item-updated';
export const ITEM_DELETED_EVENT = 'item-deleted';
export const ITEM_SUBMITTED_EVENT = 'item-submitted';
export const ITEM_APPROVED_EVENT = 'item-approved';
export const ITEM_PUBLISHED_EVENT = 'item-published';

