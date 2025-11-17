import { Vegetable, Order, Bill, User, UserRole, OrderItem, BillItem } from './types.ts';
import { supabase } from './supabaseClient.ts';

// --- MOCK LOGIN ---
// The login system is still using a mock implementation for simplicity.
// For a production app, this should be replaced with Supabase Authentication.
const MOCK_USERS: User[] = [
  { id: 'seller-001', name: 'Seller', mobile: '0000000000', role: UserRole.SELLER }
];

export const api = {
  // User login remains a simple mock. For a real app, integrate Supabase Auth.
  async login(name: string, mobile: string, role: UserRole): Promise<User | null> {
    let user = MOCK_USERS.find(u => u.mobile === mobile && u.name.toLowerCase() === name.toLowerCase());
    
    if (!user && role === UserRole.CUSTOMER) {
      // For customers, we just create a temporary user object for the session
      user = { id: `CUST-${mobile}`, name, mobile, role };
    }
    
    return user && user.role === role ? user : null;
  },

  async getVegetables(): Promise<Vegetable[]> {
    if (!supabase) return Promise.resolve([]);
    const { data, error } = await supabase.from('vegetables').select('*').order('name');
    if (error) {
      console.error("Error fetching vegetables:", error);
      throw error;
    }
    // Supabase returns snake_case (e.g., image_url), but our app uses camelCase (imageUrl)
    return data.map(v => ({...v, imageUrl: v.image_url}));
  },
  
  async addVegetable(name: string): Promise<Vegetable> {
    if (!supabase) throw new Error("Supabase is not configured.");
    const newId = `veg-${Date.now()}`;
    const newVegetableData = {
      id: newId,
      name,
      // Use a placeholder image for newly added vegetables
      image_url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=400&auto=format&fit=crop',
    };
    
    const { data, error } = await supabase.from('vegetables').insert([newVegetableData]).select();
    if (error) {
      console.error("Error adding vegetable:", error);
      throw error;
    }
    const addedVeg = data[0];
    return { ...addedVeg, imageUrl: addedVeg.image_url };
  },

  async getVegetablePrices(): Promise<Record<string, number>> {
    if (!supabase) return Promise.resolve({});
    const { data, error } = await supabase.from('vegetable_prices').select('veg_id, price');
    if (error) {
      console.error("Error fetching prices:", error);
      throw error;
    }
    const prices: Record<string, number> = {};
    data.forEach(item => {
        prices[item.veg_id] = item.price;
    });
    return prices;
  },

  async setVegetablePrice(vegId: string, price: number): Promise<void> {
    if (!supabase) return Promise.resolve();
    const { error } = await supabase.from('vegetable_prices').upsert({ veg_id: vegId, price: price });
    if (error) {
      console.error("Error setting price:", error);
      throw error;
    }
  },

  async getOrdersForUser(userId: string): Promise<Order[]> {
    if (!supabase) return Promise.resolve([]);
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', userId);
    if (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
    return data.map(o => ({
      ...o,
      userId: o.user_id,
      customerName: o.customer_name,
      isBilled: o.is_billed,
      timestamp: new Date(o.timestamp)
    }));
  },

  async getAllOrders(): Promise<Order[]> {
    if (!supabase) return Promise.resolve([]);
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
    return data.map(o => ({
      ...o,
      userId: o.user_id,
      customerName: o.customer_name,
      isBilled: o.is_billed,
      timestamp: new Date(o.timestamp)
    }));
  },
  
  async getBillsForUser(userId: string): Promise<Bill[]> {
    if (!supabase) return Promise.resolve([]);
    const { data, error } = await supabase.from('bills').select('*').eq('user_id', userId);
    if (error) {
      console.error("Error fetching user bills:", error);
      throw error;
    }
    return data.map(b => ({
      ...b,
      orderId: b.order_id,
      userId: b.user_id,
      customerName: b.customer_name,
      totalCost: b.total_cost,
      timestamp: new Date(b.timestamp)
    }));
  },

  async getAllBills(): Promise<Bill[]> {
    if (!supabase) return Promise.resolve([]);
    const { data, error } = await supabase.from('bills').select('*');
    if (error) {
      console.error("Error fetching all bills:", error);
      throw error;
    }
    return data.map(b => ({
      ...b,
      orderId: b.order_id,
      userId: b.user_id,
      customerName: b.customer_name,
      totalCost: b.total_cost,
      timestamp: new Date(b.timestamp)
    }));
  },

  async placeOrder(items: OrderItem[], user: User): Promise<Order> {
    if (!supabase) throw new Error("Supabase is not configured.");
    const newOrderData = {
      id: `ORD-${Date.now()}`,
      user_id: user.id,
      customer_name: user.name,
      items: items,
      is_billed: false,
      timestamp: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('orders').insert([newOrderData]).select();
    if (error) {
      console.error("Error placing order:", error);
      throw error;
    }
    const createdOrder = data[0];
    return {
      id: createdOrder.id,
      userId: createdOrder.user_id,
      customerName: createdOrder.customer_name,
      items: createdOrder.items,
      isBilled: createdOrder.is_billed,
      timestamp: new Date(createdOrder.timestamp),
    };
  },
  
  async createBill(order: Order): Promise<Bill> {
    if (!supabase) throw new Error("Supabase is not configured.");
    const prices = await this.getVegetablePrices();
    const billItems: BillItem[] = order.items.map(item => {
        const pricePerKg = prices[item.vegetable.id] || 0;
        return { ...item, pricePerKg, totalPrice: item.quantity * pricePerKg };
    });
    const totalCost = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

    const newBillData = {
      id: `BILL-${order.id}`,
      order_id: order.id,
      user_id: order.userId,
      customer_name: order.customerName,
      items: billItems,
      total_cost: totalCost,
      timestamp: new Date().toISOString(),
    };

    // This should ideally be a database transaction, but for simplicity, we do two separate operations.
    // 1. Create the bill
    const { data: billData, error: billError } = await supabase.from('bills').insert([newBillData]).select();
    if (billError) {
      console.error("Error creating bill:", billError);
      throw billError;
    }
    
    // 2. Update the order to be marked as billed
    const { error: orderError } = await supabase.from('orders').update({ is_billed: true }).eq('id', order.id);
    if(orderError) {
      console.error("Error updating order to billed:", orderError);
      // Note: In a real app, you might want to handle this failure (e.g., delete the bill)
      throw orderError;
    }
    
    const createdBill = billData[0];
    return {
      id: createdBill.id,
      orderId: createdBill.order_id,
      userId: createdBill.user_id,
      customerName: createdBill.customer_name,
      items: createdBill.items,
      totalCost: createdBill.total_cost,
      timestamp: new Date(createdBill.timestamp),
    };
  }
};