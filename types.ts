export interface Vegetable {
  id: string;
  name: string;
  imageUrl: string;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SELLER = 'SELLER',
}

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
}

export interface OrderItem {
  vegetable: Vegetable;
  quantity: number; // in kg
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  timestamp: Date;
  isBilled: boolean;
}

export interface BillItem extends OrderItem {
  pricePerKg: number;
  totalPrice: number;
}

export interface Bill {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  items: BillItem[];
  totalCost: number;
  timestamp: Date;
}