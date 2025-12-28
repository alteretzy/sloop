import { create } from 'zustand';

interface CartItem {
  id: string;
  vendorPrices: { vendor: string; price: number }[];
  selectedVendor: string; // Defaults to lowest
}

interface CartState {
  items: CartItem[];
  addToCart: (product: any) => void;
  // Computed selectors helper
  getSavings: () => number;
}

export const useOneCart = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product) => {
    // Logic: Auto-select lowest price vendor on add
    const lowest = product.prices.sort((a, b) => a.price - b.price)[0];
    
    set((state) => ({
      items: [...state.items, { 
        id: product.id, 
        vendorPrices: product.prices, 
        selectedVendor: lowest.vendor 
      }]
    }));
  },
  getSavings: () => {
    const { items } = get();
    // Calculate difference between chosen price and highest price
    return items.reduce((acc, item) => {
      const current = item.vendorPrices.find(v => v.vendor === item.selectedVendor)?.price || 0;
      const highest = Math.max(...item.vendorPrices.map(v => v.price));
      return acc + (highest - current);
    }, 0);
  }
}));