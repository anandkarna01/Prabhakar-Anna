import { Vegetable, Order, Bill, User, UserRole, OrderItem, BillItem } from './types.ts';
import { VEGETABLES } from './constants.ts';

// --- MOCK DATABASE in localStorage ---
// This file simulates a backend API. In a real-world application, these functions
// would make network requests (e.g., using fetch) to a real server.
// We use localStorage to persist data across browser sessions, mimicking a database.
// This allows multiple tabs (simulating customer and seller on the same machine) to interact.
// For a true multi-device experience, a real backend (like Node.js, Firebase, etc.) is required.

const DB_KEY = 'prabha-vegetables-db';

const MOCK_USERS: User[] = [
  { id: 'seller-001', name: 'Seller', mobile: '0000000000', role: UserRole.SELLER }
];

interface Database {
  vegetables: Vegetable[];
  orders: Order[];
  bills: Bill[];
  users: User[];
  vegetablePrices: Record<string, number>;
}

// Artificial delay to simulate network latency
const FAKE_DELAY = 200; 

const readDb = (): Database => {
  try {
    const rawDb = localStorage.getItem(DB_KEY);
    if (rawDb) {
      const db = JSON.parse(rawDb);
      // Revive date objects
      db.orders = db.orders.map((o: Order) => ({ ...o, timestamp: new Date(o.timestamp) }));
      db.bills = db.bills.map((b: Bill) => ({ ...b, timestamp: new Date(b.timestamp) }));
      return db;
    }
  } catch (e) {
    console.error("Failed to read from DB", e);
  }
  // Return initial state if DB is empty or corrupt
  return {
    vegetables: VEGETABLES,
    orders: [],
    bills: [],
    users: MOCK_USERS,
    vegetablePrices: {},
  };
};

const writeDb = (db: Database) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch(e) {
    console.error("Failed to write to DB", e);
  }
};

const withDelay = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), FAKE_DELAY));


// --- API METHODS ---

export const api = {
  async login(name: string, mobile: string, role: UserRole): Promise<User | null> {
    const db = readDb();
    let user = db.users.find(u => u.mobile === mobile && u.name.toLowerCase() === name.toLowerCase());

    if (!user && role === UserRole.CUSTOMER) {
      user = { id: `USER-${Date.now()}`, name, mobile, role };
      db.users.push(user);
      writeDb(db);
    }
    
    if (user && user.role === role) {
      return withDelay(user);
    }

    return withDelay(null);
  },

  async getVegetables(): Promise<Vegetable[]> {
    const db = readDb();
    return withDelay(db.vegetables);
  },

  async addVegetable(name: string): Promise<Vegetable> {
    const db = readDb();
    const newVegetable: Vegetable = {
      id: `veg-${Date.now()}`,
      name,
      imageUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400&auto-format&fit=crop',
    };
    db.vegetables.push(newVegetable);
    writeDb(db);
    return withDelay(newVegetable);
  },
  
  async getVegetablePrices(): Promise<Record<string, number>> {
      const db = readDb();
      return withDelay(db.vegetablePrices);
  },

  async setVegetablePrice(vegId: string, price: number): Promise<void> {
    const db = readDb();
    db.vegetablePrices[vegId] = price;
    writeDb(db);
    return withDelay(undefined);
  },

  async getOrdersForUser(userId: string): Promise<Order[]> {
    const db = readDb();
    const orders = db.orders.filter(o => o.userId === userId);
    return withDelay(orders);
  },

  async getAllOrders(): Promise<Order[]> {
    const db = readDb();
    return withDelay(db.orders);
  },
  
  async getBillsForUser(userId: string): Promise<Bill[]> {
    const db = readDb();
    const bills = db.bills.filter(b => b.userId === userId);
    return withDelay(bills);
  },

  async getAllBills(): Promise<Bill[]> {
      const db = readDb();
      return withDelay(db.bills);
  },

  async placeOrder(items: OrderItem[], user: User): Promise<Order> {
    const db = readDb();
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      customerName: user.name,
      items,
      timestamp: new Date(),
      isBilled: false,
    };
    db.orders.push(newOrder);
    writeDb(db);
    return withDelay(newOrder);
  },
  
  async createBill(order: Order): Promise<Bill> {
    const db = readDb();
    const billItems: BillItem[] = order.items.map(item => {
        const pricePerKg = db.vegetablePrices[item.vegetable.id] || 0;
        return {
            ...item,
            pricePerKg,
            totalPrice: item.quantity * pricePerKg,
        };
    });
    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newBill: Bill = {
      id: `BILL-${order.id}`,
      orderId: order.id,
      userId: order.userId,
      customerName: order.customerName,
      items: billItems,
      totalCost,
      timestamp: new Date(),
    };
    
    db.bills.push(newBill);
    const orderIndex = db.orders.findIndex(o => o.id === order.id);
    if(orderIndex > -1) {
        db.orders[orderIndex].isBilled = true;
    }
    writeDb(db);
    
    return withDelay(newBill);
  }
};
