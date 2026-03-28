import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  quantity: number;
}

interface UserState {
  cart: CartItem[];
  tableId: string | null;
  customerName: string;
  phoneNumber: string;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  setTableId: (id: string | null) => void;
  setCustomerName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  lastUpdated: number;
}

const EXPIRE_TIME = 3600000; // 1 hour in ms

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      cart: [],
      tableId: null,
      customerName: '',
      phoneNumber: '',
      lastUpdated: Date.now(),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        const newState = existing
          ? { cart: state.cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i) }
          : { cart: [...state.cart, item] };
        return { ...newState, lastUpdated: Date.now() };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
        lastUpdated: Date.now()
      })),
      updateQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        ),
        lastUpdated: Date.now()
      })),
      clearCart: () => set({ cart: [], lastUpdated: Date.now() }),
      setTableId: (id) => set({ tableId: id, lastUpdated: Date.now() }),
      setCustomerName: (name) => set({ customerName: name, lastUpdated: Date.now() }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone, lastUpdated: Date.now() }),
    }),
    {
      name: 'iuh-user-cart',
      onRehydrateStorage: () => (state) => {
        if (state && state.lastUpdated && Date.now() - state.lastUpdated > EXPIRE_TIME) {
          state.clearCart();
          state.setCustomerName('');
          state.setPhoneNumber('');
          state.setTableId(null);
        }
      },
    }
  )
);
