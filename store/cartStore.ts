import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartState, CartItem, ProductVariant } from '../types/cart';

// Helper to recalculate totals
const calculateTotals = (items: CartItem[]) => {
  let total = 0;
  let savings = 0;

  items.forEach(item => {
    total += item.selectedOption.price * item.quantity;
    
    // Find the most expensive alternative to calculate "savings"
    const maxPrice = Math.max(...item.alternatives.map(a => a.price));
    savings += (maxPrice - item.selectedOption.price) * item.quantity;
  });

  return { totalPrice: total, totalSavings: savings };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      totalSavings: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === newItem.id);

        let updatedItems;
        if (existingItem) {
          // If item exists, just increment quantity
          updatedItems = items.map((i) =>
            i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          // Add new item with quantity 1
          updatedItems = [...items, { ...newItem, quantity: 1 }];
        }

        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      removeItem: (id) => {
        const { items } = get();
        const updatedItems = items.filter((i) => i.id !== id);
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      updateQuantity: (id, delta) => {
        const { items } = get();
        const updatedItems = items.map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      switchVendor: (itemId, vendorName) => {
        const { items } = get();
        const updatedItems = items.map((item) => {
          if (item.id === itemId) {
            const newOption = item.alternatives.find(a => a.vendor === vendorName);
            if (newOption) {
              return { ...item, selectedOption: newOption };
            }
          }
          return item;
        });
        set({ items: updatedItems, ...calculateTotals(updatedItems) });
      },

      // The "Brain" Feature: Auto-switch to lowest prices
      optimizeCart: () => {
        const { items } = get();
        
        const optimizedItems = items.map((item) => {
          // Sort alternatives by price (ascending)
          const sortedOptions = [...item.alternatives].sort((a, b) => a.price - b.price);
          // Select the cheapest one
          return { ...item, selectedOption: sortedOptions[0] };
        });

        set({ items: optimizedItems, ...calculateTotals(optimizedItems) });
      },

      clearCart: () => set({ items: [], totalPrice: 0, totalSavings: 0 }),
    }),
    {
      name: 'sloop-cart-storage', // Key in AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Persist to device
    }
  )
);