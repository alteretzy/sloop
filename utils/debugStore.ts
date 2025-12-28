import { useCartStore } from '../store/cartStore';
import { CartItem } from '../types/cart';

export const seedDatabase = () => {
  const { addItem, clearCart } = useCartStore.getState();
  
  // Clear existing to avoid duplicates
  clearCart();

  const mockItems: Omit<CartItem, 'quantity'>[] = [
    {
      id: 'sku_sony_xm5',
      name: 'Sony WH-1000XM5',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=300&auto=format&fit=crop',
      selectedOption: { 
        vendor: 'Amazon', 
        price: 348.00, 
        url: 'https://amazon.com', 
        inStock: true, 
        shippingTime: '1 day' 
      },
      alternatives: [
        { vendor: 'Amazon', price: 348.00, url: '...', inStock: true, shippingTime: '1 day' },
        { vendor: 'SloopDirect', price: 299.00, url: '...', inStock: true, shippingTime: '5 days' }, // Cheaper!
      ]
    },
    {
      id: 'sku_nike_dunk',
      name: 'Nike Dunk Low Retro',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
      selectedOption: { 
        vendor: 'StockX', 
        price: 145.00, 
        url: '...', 
        inStock: true, 
        shippingTime: 'Verified' 
      },
      alternatives: [
        { vendor: 'StockX', price: 145.00, url: '...', inStock: true, shippingTime: 'Verified' },
        { vendor: 'Nike', price: 110.00, url: '...', inStock: true, shippingTime: 'Standard' }, // Cheaper!
      ]
    }
  ];

  mockItems.forEach(item => addItem(item));
  console.log('🌱 Database seeded with expensive defaults.');
};