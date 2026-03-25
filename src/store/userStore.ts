import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
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
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      cart: [],
      tableId: null,
      customerName: '',
      phoneNumber: '',
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map((i) => 
               i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { cart: [...state.cart, item] };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map((i) => 
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        ),
      })),
      clearCart: () => set({ cart: [] }),
      setTableId: (id) => set({ tableId: id }),
      setCustomerName: (name) => set({ customerName: name }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
    }),
    {
      name: 'iuh-user-cart',
    }
  )
);
