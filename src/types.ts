export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  id: string; // unique cart item identifier (e.g., product.id + size + color)
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  paymentMethod: 'stripe' | 'paypal' | 'khalti' | 'esewa' | 'cod';
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  paymentStatus: 'pending' | 'paid';
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

export interface AdvisorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  createdAt: string;
  productRecommendations?: Product[];
}
