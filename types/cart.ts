// types/cart.ts

export type Vendor = 'Amazon' | 'Nike' | 'Adidas' | 'SloopDirect';

export interface ProductVariant {
  vendor: Vendor;
  price: number;
  url: string;
  inStock: boolean;
  shippingTime: string; // e.g., "2 days"
}

export interface CartItem {
  id: string; // Unique SKU
  name: string;
  image: string;
  quantity: number;
  // The user's current choice
  selectedOption: ProductVariant;
  // All available options (needed for the 'Optimize' function)
  alternatives: ProductVariant[];
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalSavings: number; // Calculated against the most expensive option
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  switchVendor: (itemId: string, vendor: Vendor) => void;
  optimizeCart: () => void; // The "Sloop Magic" button
  clearCart: () => void;
}