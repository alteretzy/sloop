import { CartItem, ProductVariant } from '../types/cart';

// Mocks the response from your future backend
const PRODUCT_DATABASE: Record<string, Omit<CartItem, 'quantity' | 'selectedOption'> & { options: ProductVariant[] }> = {
  'shoe': {
    id: 'detected_nike_dunk',
    name: 'Nike Dunk Low Panda',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    options: [
      { vendor: 'StockX', price: 185.00, url: '...', inStock: true, shippingTime: 'Verified' }, // Expensive default
      { vendor: 'Nike', price: 110.00, url: '...', inStock: true, shippingTime: 'Standard' },   // Cheap alternative
    ]
  },
  'bottle': {
    id: 'detected_hydroflask',
    name: 'Hydro Flask 32oz',
    image: 'https://images.unsplash.com/photo-1602143407151-01114192003b?w=500',
    options: [
      { vendor: 'Amazon', price: 44.95, url: '...', inStock: true, shippingTime: 'Prime' },
      { vendor: 'SloopDirect', price: 35.00, url: '...', inStock: true, shippingTime: '5 Days' },
    ]
  },
  'laptop': {
    id: 'detected_macbook',
    name: 'MacBook Air M2',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500',
    options: [
      { vendor: 'Apple', price: 1199.00, url: '...', inStock: true, shippingTime: 'Pickup' },
      { vendor: 'BestBuy', price: 1049.00, url: '...', inStock: true, shippingTime: 'Shipped' },
    ]
  }
};

export const fetchProductDetails = async (detectedLabel: string): Promise<CartItem | null> => {
  // Simulate Network Latency (0.5s) to make it feel real
  await new Promise(resolve => setTimeout(resolve, 500));

  // Normalize label
  const key = detectedLabel.toLowerCase();
  const template = PRODUCT_DATABASE[key] || PRODUCT_DATABASE['shoe']; // Fallback to shoe for demo

  // Construct the CartItem
  return {
    id: template.id,
    name: template.name,
    image: template.image,
    quantity: 1,
    selectedOption: template.options[0], // Default to first (usually expensive) option
    alternatives: template.options
  };
};
import { CartItem } from '../types/cart';
import { Platform } from 'react-native';

// CHANGE THIS to your computer's IP if testing on real device!
const API_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';

export const fetchProductDetails = async (detectedLabel: string): Promise<CartItem | null> => {
  try {
    console.log(`📡 Calling Backend: ${API_URL}/search?q=${detectedLabel}`);
    
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(detectedLabel)}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Map Backend Response to CartItem (Frontend State)
    return {
      id: data.id,
      name: data.name,
      image: data.image,
      quantity: 1, // Default quantity
      selectedOption: data.selected_option,
      alternatives: data.alternatives
    };

  } catch (error) {
    console.error("❌ Sloop Backend Error:", error);
    return null; // Handle error gracefully in UI
  }
};