/* istanbul ignore file */

// Event Envelope Definition
export interface Event {
  id: string;
  type: string;
  timestamp: number;
  partitionKey: string;
  tags: { [key: string]: string | number };
}

// Order Domain Entity Definition
export interface Order {
  id: string;
  name: string;
  status: Status;
  description: string;
}

export enum Status {
    Wip = 'wip',
    Submitted = 'submitted',
    Fulfilled = 'filfilled',
}

// Order Event Definitions
export interface OrderEvent extends Event {
  order: Order;
}

export interface OrderChangeEvent extends Event {
  order: {
    old?: Order,
    new?: Order,
  };
}

// Valid Event Types
export const ORDER_CREATED_EVENT = 'order-created';
export const ORDER_UPDATED_EVENT = 'order-updated';
export const ORDER_DELETED_EVENT = 'order-deleted';
export const ORDER_SUBMITTED_EVENT = 'order-submitted';
export const ORDER_RECEIED_EVENT = 'order-received';
export const ORDER_FULFILLED_EVENT = 'order-fulfilled';

