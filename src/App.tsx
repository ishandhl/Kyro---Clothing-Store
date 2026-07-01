import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  User,
  SlidersHorizontal,
  Search,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Plus,
  Minus,
  Star,
  Check,
  Send,
  Sparkles,
  Info,
  Calendar,
  Layers,
  TrendingUp,
  Package,
  ClipboardList,
  Edit,
  Trash2,
  DollarSign,
  Monitor,
  Lock,
  ArrowLeft,
  Settings,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  FileText
} from 'lucide-react';
import { Product, CartItem, Order, Review, User as UserType, AdvisorMessage } from './types';
import { LOOKBOOK_IMAGES, TESTIMONIALS, INSTAGRAM_POSTS } from './data';
import { playSoftClick, playLuxuryHover, playPaymentSuccess, toggleGlobalSound } from './components/AudioEngine';
import CustomCursor from './components/CustomCursor';
export default function App() {
  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'stylist' | 'wishlist' | 'orders' | 'admin'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]); // product IDs
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>({
    email: 'ishandhl92@gmail.com',
    name: 'Ishan',
    role: 'admin', // defaulted to admin so the client can explore both user & admin workflows seamlessly
    isAuthenticated: true
  });
  
  // UX Settings
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [isCursorOn, setIsCursorOn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.sizes[0] || '');
      setSelectedColor(selectedProduct.colors[0] || '');
      setActiveImageIndex(0);
    } else {
      setSelectedSize('');
      setSelectedColor('');
      setActiveImageIndex(0);
    }
  }, [selectedProduct]);

  // Shop Filters
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterColor, setFilterColor] = useState<string>('All');
  const [filterSize, setFilterSize] = useState<string>('All');
  const [filterPrice, setFilterPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Lookbook slider
  const [lookbookIndex, setLookbookIndex] = useState(0);

  // Checkout process
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [shippingForm, setShippingForm] = useState({
    fullName: 'Ishan D.',
    email: 'ishandhl92@gmail.com',
    address: '108 Brutalist Blvd, Flat 4B',
    city: 'Kathmandu',
    country: 'Nepal',
    postalCode: '44600',
    phone: '+977-9851000000'
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'khalti' | 'esewa' | 'cod'>('stripe');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Custom Premium Toast/Modal and Track-by-ID States
  const [toast, setToast] = useState<{ show: boolean; title?: string; message: string } | null>(null);
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [searchOrderError, setSearchOrderError] = useState('');

  // Promo / Coupon code states
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromoCode = () => {
    onBtnClick();
    const code = promoCodeInput.trim().toUpperCase();
    if (code === 'STRIZ_KYRO_01') {
      setAppliedPromo({ code: 'STRIZ_KYRO_01', percent: 15 });
      setPromoError('');
      showToast("STRIZ_KYRO_01 Applied: 15% discount registered on your order value.", "PROMO APPLIED");
    } else if (code === '') {
      setPromoError('Please enter a valid signature code.');
    } else {
      setPromoError('Promo code not found in active ledger.');
    }
  };

  const showToast = (message: string, title?: string) => {
    setToast({ show: true, title, message });
  };

  // AI Stylist Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<AdvisorMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Welcome to the KYRO Styling Atelier. I am your personal design director. Share your style preferences, upcoming travel plans, or aesthetic mood, and I will recommend a bespoke heavy-structured outfit from our exclusive line.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Admin Customizer States (CMS)
  const [cmsConfig, setCmsConfig] = useState({
    heroTitle: 'KYRO',
    heroTagline: 'BUILT DIFFERENT.',
    heroDescription: 'Architectural streetwear silhouettes hand-crafted with heavyweight structural textiles. Engineered with high-density drapes and pristine minimalist detailing.',
    storyTitle: 'METICULOUSLY CRAFTED FOR THE MODERN ICONIST',
    storyText: 'At KYRO, we reject lightweight standards. Our heavy-loopback hoodies weigh an extreme 500gsm for a perfect rigid drop silhouette, complemented by water-resistant high-density Japanese ripstop cargos with Italian Cobrax snaps. Every piece is an architectural monument to modern apparel geometry.'
  });

  // Admin Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 120,
    description: '',
    category: 'Outerwear',
    colors: ['Onyx Black', 'Cream'],
    sizes: ['S', 'M', 'L'],
    stock: 20,
    features: ['100% Cotton', 'Oversized silhouette'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800']
  });

  // Fetch products and reviews from backend
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  // Scroll chat bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatGenerating]);

  // Audio utility wrappings
  const handleSoundToggle = () => {
    const nextVal = !isSoundOn;
    setIsSoundOn(nextVal);
    toggleGlobalSound(nextVal);
    playSoftClick();
  };

  const onBtnClick = () => {
    playSoftClick();
  };

  const onBtnHover = () => {
    playLuxuryHover();
  };

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    onBtnClick();
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Cart Logic
  const addToCart = (product: Product, selectedSize: string, selectedColor: string) => {
    onBtnClick();
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    const existing = cart.find(item => item.id === cartItemId);
    
    if (existing) {
      setCart(cart.map(item => 
        item.id === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, {
        id: cartItemId,
        product,
        quantity: 1,
        selectedSize,
        selectedColor
      }]);
    }
    setIsCartOpen(true);
  };

  const updateCartQuantity = (itemId: string, diff: number) => {
    onBtnClick();
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const nextQty = item.quantity + diff;
    if (nextQty <= 0) {
      setCart(cart.filter(i => i.id !== itemId));
    } else {
      setCart(cart.map(i => 
        i.id === itemId ? { ...i, quantity: nextQty } : i
      ));
    }
  };

  const removeFromCart = (itemId: string) => {
    onBtnClick();
    setCart(cart.filter(i => i.id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Submit checkout order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsPlacingOrder(true);
    onBtnClick();

    const rawSubtotal = getCartTotal();
    const discountAmount = appliedPromo ? Math.round(rawSubtotal * appliedPromo.percent / 100) : 0;
    const subtotal = rawSubtotal - discountAmount;
    const shippingFee = subtotal >= 150 ? 0 : 20;
    const total = subtotal + shippingFee;

    const orderPayload = {
      items: cart,
      subtotal,
      shippingFee,
      total,
      appliedPromoCode: appliedPromo ? appliedPromo.code : null,
      discountAmount,
      shippingAddress: shippingForm,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        playPaymentSuccess();
        setLastPlacedOrder(data.order);
        setOrders(prev => [data.order, ...prev]);
        setCart([]); // Clear cart
        setAppliedPromo(null); // Reset applied promo
        setPromoCodeInput(''); // Reset promo input
        setCheckoutStep('success');
        fetchProducts(); // Refresh products with updated stock
      } else {
        showToast(data.error || "Order routing unfulfilled.", "TRANSACTION FAILED");
      }
    } catch (err) {
      console.error('Order creation error:', err);
      showToast("Could not establish communication with our financial routing nodes.", "CONNECTION ERROR");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleTrackOrderById = async () => {
    onBtnClick();
    if (!searchOrderId.trim()) return;
    setSearchOrderError('');
    setSearchedOrder(null);
    try {
      const res = await fetch(`/api/orders/${searchOrderId.trim().toUpperCase()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSearchedOrder(data.order);
      } else {
        setSearchOrderError(data.error || "Order signature not found inside registry.");
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);
      setSearchOrderError("Registry communication failure.");
    }
  };

  // Chat Styling Advice Trigger
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatGenerating) return;

    onBtnClick();
    const userMsgText = chatInput;
    setChatInput('');

    const newUserMessage: AdvisorMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userMsgText,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newUserMessage]);
    setIsChatGenerating(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMessage]
        })
      });
      const data = await response.json();

      const assistantProducts = data.productIds 
        ? products.filter((p: Product) => data.productIds.includes(p.id))
        : [];

      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'assistant',
        text: data.text,
        createdAt: new Date().toISOString(),
        productRecommendations: assistantProducts
      }]);
    } catch (err) {
      console.error('Error getting styling advice:', err);
      setChatMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'assistant',
        text: "I apologies, but my luxury communication frequencies are experiencing atmospheric interference. Let's try styling another look shortly.",
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsChatGenerating(false);
    }
  };

  // Fetch Reviews from Backend
  const fetchReviews = async (productId: string) => {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  // Write Review
  const handleSubmitReview = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    onBtnClick();
    if (!newReview.comment.trim()) return;

    const createdReview = {
      productId,
      author: currentUser.name || 'Anonymous client',
      rating: newReview.rating,
      comment: newReview.comment
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdReview)
      });
      const data = await res.json();
      if (data.success) {
        showToast("Your design review has been registered.", "REVIEW SUBMITTED");
        setNewReview({ rating: 5, comment: '' });
        await fetchReviews(productId);
        await fetchProducts(); // Refresh products with updated rating/reviewsCount
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      showToast("Review registry nodes unreached.", "SUBMISSION ERROR");
    }
  };

  // Add / Edit products (Admin CMS flow)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    onBtnClick();
    
    try {
      const payload = editingProduct ? { ...editingProduct, ...productForm } : productForm;
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        await fetchProducts();
        setEditingProduct(null);
        setProductForm({
          name: '',
          price: 120,
          description: '',
          category: 'Outerwear',
          colors: ['Onyx Black', 'Cream'],
          sizes: ['S', 'M', 'L'],
          stock: 20,
          features: ['100% Cotton'],
          images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800']
        });
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to remove this luxury item from stock?')) return;
    onBtnClick();
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Update order status from admin panel
  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    onBtnClick();
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Filter & Sort Logic for Catalog
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesColor = filterColor === 'All' || product.colors.includes(filterColor);
    const matchesSize = filterSize === 'All' || product.sizes.includes(filterSize);
    const matchesPrice = product.price <= filterPrice;

    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  // Extract list of all unique colors & sizes for filters
  const allColors = Array.from(new Set(products.flatMap(p => p.colors)));
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes)));

  // Fetch reviews when product selection changes
  useEffect(() => {
    if (selectedProduct) {
      fetchReviews(selectedProduct.id);
    }
  }, [selectedProduct]);

  return (
    <div id="kyro-app" className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col relative select-none selection:bg-[#f5f5f5] selection:text-[#050505]">
      
      {/* Dynamic Custom Cursor */}
      <CustomCursor enabled={isCursorOn} />

      {/* COMPLIMENTARY SHIPPING TICKER */}
      <div className="w-full bg-[#111] text-zinc-400 text-[10px] uppercase font-bold tracking-[0.2em] py-2.5 overflow-hidden border-b border-white/5 select-none">
        <div className="animate-ticker whitespace-nowrap flex gap-12 items-center">
          {Array(8).fill("✦ COMPLIMENTARY WORLDWIDE DELIVERY ON ORDERS OVER $150 ✦ 15% OFF NEW COLLECTION WITH CODE 'STRIZ_KYRO_01' ✦ STREETWEAR ARCHIVE DROPS LIVE").map((text, idx) => (
            <span key={idx} className="flex-shrink-0 font-mono text-[9px] font-bold">{text}</span>
          ))}
        </div>
      </div>

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Brand Area */}
          <div 
            onClick={() => { onBtnClick(); setActiveTab('home'); setSelectedProduct(null); }} 
            onMouseEnter={onBtnHover}
            className="flex items-center gap-3 cursor-pointer select-none group"
            id="kyro-logo-nav"
          >
            {/* Styled Logo matching inspiration image */}
            <svg className="w-8 h-8 text-white group-hover:scale-105 transition-transform" viewBox="0 0 100 100" fill="currentColor">
              <path d="M15,10 H30 L60,50 L85,10 H100 L65,60 L90,90 H75 L50,55 L25,90 H10 L45,45 Z" />
              <path d="M45,65 H55 L65,80 H45 Z" className="opacity-80" />
            </svg>
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-[0.2em] text-white">KYRO</span>
              <span className="text-[7px] tracking-[0.3em] text-zinc-500 uppercase font-mono font-bold">STRIZ DIVISION [01]</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
            <button 
              id="nav-shop"
              onClick={() => { onBtnClick(); setActiveTab('shop'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className={`hover:text-white transition-colors py-2 relative ${activeTab === 'shop' ? 'text-white' : ''}`}
            >
              Shop
              {activeTab === 'shop' && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button 
              id="nav-stylist"
              onClick={() => { onBtnClick(); setActiveTab('stylist'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className={`hover:text-white transition-colors py-2 flex items-center gap-1.5 relative ${activeTab === 'stylist' ? 'text-white' : ''}`}
            >
              <Sparkles className="w-3 h-3 text-white animate-pulse" />
              AI Outfit Stylist
              {activeTab === 'stylist' && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button 
              id="nav-home"
              onClick={() => { onBtnClick(); setActiveTab('home'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className={`hover:text-white transition-colors py-2 relative ${activeTab === 'home' ? 'text-white' : ''}`}
            >
              Lookbook
              {activeTab === 'home' && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button 
              id="nav-orders"
              onClick={() => { onBtnClick(); setActiveTab('orders'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className={`hover:text-white transition-colors py-2 relative ${activeTab === 'orders' ? 'text-white' : ''}`}
            >
              Order Tracking
              {activeTab === 'orders' && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
            <button 
              id="nav-admin"
              onClick={() => { onBtnClick(); setActiveTab('admin'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className={`hover:text-white transition-colors py-2 flex items-center gap-1.5 relative ${activeTab === 'admin' ? 'text-white' : ''}`}
            >
              <Lock className="w-2.5 h-2.5 text-zinc-500" />
              Admin Area
              {activeTab === 'admin' && <motion.div layoutId="navline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />}
            </button>
          </nav>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-4">
            
            {/* Audio Feedback Toggler with Ambient Synth Visualizer */}
            <div className="flex items-center gap-3 bg-zinc-950/80 px-3 py-1.5 border border-white/5 rounded-none font-mono">
              <button 
                id="toggle-sound-btn"
                onClick={handleSoundToggle}
                onMouseEnter={onBtnHover}
                className="text-zinc-400 hover:text-white transition-colors focus:outline-none flex items-center gap-2"
                title={isSoundOn ? "Mute luxury atmosphere clicks" : "Unmute luxury atmosphere clicks"}
              >
                {isSoundOn ? (
                  <div className="flex items-end gap-1 h-4 px-1">
                    <motion.span animate={{ height: [4, 16, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                    <motion.span animate={{ height: [6, 10, 16, 4, 6] }} transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                    <motion.span animate={{ height: [12, 4, 10, 16, 12] }} transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                    <motion.span animate={{ height: [4, 14, 8, 12, 4] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                    <motion.span animate={{ height: [8, 16, 4, 10, 8] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                    <motion.span animate={{ height: [14, 6, 12, 4, 14] }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }} className="w-[2px] bg-white rounded-none" />
                  </div>
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-600 hover:text-zinc-400 transition-colors" />
                )}
                <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-bold hidden lg:inline">
                  {isSoundOn ? "SOUND ON" : "SOUND OFF"}
                </span>
              </button>
            </div>

            {/* Custom Cursor Toggler */}
            <button 
              id="toggle-cursor-btn"
              onClick={() => { onBtnClick(); setIsCursorOn(!isCursorOn); }}
              onMouseEnter={onBtnHover}
              className={`hidden md:block p-2 text-xs uppercase tracking-widest ${isCursorOn ? 'text-white' : 'text-zinc-600'} hover:text-white transition-colors`}
              title="Toggle cinematic luxury cursor"
            >
              [Cursor: {isCursorOn ? "ON" : "OFF"}]
            </button>

            {/* Wishlist Link */}
            <button 
              id="header-wishlist-btn"
              onClick={() => { onBtnClick(); setActiveTab('wishlist'); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className="p-2 text-zinc-400 hover:text-white transition-colors relative"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Cart Button */}
            <button 
              id="header-cart-btn"
              onClick={() => { onBtnClick(); setIsCartOpen(true); }}
              onMouseEnter={onBtnHover}
              className="p-2.5 bg-white text-black hover:bg-zinc-200 transition-colors rounded-full flex items-center justify-center relative"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE LOWER NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#000000] border-t border-white/10 py-3.5 px-6 flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-400">
        <button 
          id="m-nav-shop" 
          onClick={() => { onBtnClick(); setActiveTab('shop'); setSelectedProduct(null); }}
          className={activeTab === 'shop' ? 'text-white font-black' : 'hover:text-white'}
        >
          Shop
        </button>
        <button 
          id="m-nav-stylist" 
          onClick={() => { onBtnClick(); setActiveTab('stylist'); setSelectedProduct(null); }}
          className={`flex items-center gap-1 ${activeTab === 'stylist' ? 'text-white' : 'hover:text-white'}`}
        >
          <Sparkles className="w-3 h-3 text-white" /> Stylist
        </button>
        <button 
          id="m-nav-home" 
          onClick={() => { onBtnClick(); setActiveTab('home'); setSelectedProduct(null); }}
          className={activeTab === 'home' ? 'text-white' : 'hover:text-white'}
        >
          Lookbook
        </button>
        <button 
          id="m-nav-orders" 
          onClick={() => { onBtnClick(); setActiveTab('orders'); setSelectedProduct(null); }}
          className={activeTab === 'orders' ? 'text-white' : 'hover:text-white'}
        >
          Track
        </button>
        <button 
          id="m-nav-admin" 
          onClick={() => { onBtnClick(); setActiveTab('admin'); setSelectedProduct(null); }}
          className={activeTab === 'admin' ? 'text-white font-black' : 'hover:text-white'}
        >
          Admin
        </button>
      </div>

      {/* MAIN APPLICATION ROUTING BODY */}
      <main className="flex-grow pb-24 lg:pb-0">
        
        {/* VIEW 1: PRODUCT DETAILS SCREEN */}
        {selectedProduct ? (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            
            {/* Back to previous navigation trail */}
            <button 
              id="back-to-catalog"
              onClick={() => { onBtnClick(); setSelectedProduct(null); }}
              onMouseEnter={onBtnHover}
              className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white mb-8 transition-colors font-mono font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-white" /> [ Return to Catalog ]
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Product Gallery Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="aspect-[4/5] bg-zinc-950 overflow-hidden relative border-2 border-zinc-900 group transition-colors hover:border-white">
                  <img 
                    src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-luminosity hover:mix-blend-normal"
                  />
                  {selectedProduct.isNew && (
                    <span className="absolute top-4 left-4 bg-white text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                      ✦ NEW RELEASE DROP ✦
                    </span>
                  )}
                </div>

                {selectedProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedProduct.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => { onBtnClick(); setActiveImageIndex(i); }}
                        className={`aspect-[4/5] bg-zinc-950 border-2 overflow-hidden transition-all duration-300 focus:outline-none cursor-pointer ${
                          activeImageIndex === i 
                            ? 'border-white scale-[1.02] shadow-md' 
                            : 'border-zinc-900 hover:border-zinc-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${selectedProduct.name} ${i + 1}`} 
                          className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all" 
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Cart Action Column */}
              <div className="lg:col-span-5 space-y-8 sticky top-28 h-fit">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 tracking-widest uppercase font-mono">
                    <span>{selectedProduct.category}</span>
                    <div className="flex items-center gap-1.5 text-white">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-white font-bold">{selectedProduct.rating}</span>
                      <span className="text-zinc-500">({selectedProduct.reviewsCount} reviews)</span>
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-white leading-tight">
                    {selectedProduct.name}
                  </h1>
                  <p className="text-3xl font-display font-black text-white">${selectedProduct.price}</p>
                </div>

                <hr className="border-zinc-900" />

                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Sizing Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400">
                    <span className="font-mono text-zinc-500">Sizing Scale</span>
                    <button 
                      onClick={() => showToast(`Our silhouettes are intentionally boxy and heavy. We advise taking your exact normal size to achieve the curated luxury editorial drape.`, `KYRO FIT STANDARD`)}
                      className="text-white underline hover:text-white transition-colors font-mono text-[10px]"
                    >
                      [ Sizing Guide ]
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedProduct.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          id={`size-btn-${size}`}
                          onClick={() => { onBtnClick(); setSelectedSize(size); }}
                          onMouseEnter={onBtnHover}
                          className={`border-2 py-3 text-xs font-mono uppercase transition-all rounded-none ${
                            isSelected 
                              ? 'border-white bg-white text-black font-black shadow-[2px_2px_0px_white]' 
                              : 'border-zinc-800 hover:border-white bg-transparent text-zinc-400 hover:text-white'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Select Color Tone</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          onMouseEnter={onBtnHover}
                          onClick={() => { onBtnClick(); setSelectedColor(color); }}
                          className={`flex items-center gap-2 border-2 px-4 py-2.5 rounded-none text-[10px] uppercase tracking-widest transition-all bg-black ${
                            isSelected 
                              ? 'border-white bg-white text-black font-black shadow-[2px_2px_0px_white]' 
                              : 'border-zinc-800 hover:border-white text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span 
                            className="w-2.5 h-2.5 border border-black" 
                            style={{ 
                              backgroundColor: color === 'Off-White' || color === 'Cream' ? '#f5f2eb' : 
                                              color === 'Onyx Black' ? '#111' : 
                                              color === 'Olive Green' ? '#4a5343' : 
                                              color === 'Deep Slate' ? '#2f353b' : '#777' 
                            }} 
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
                  <button
                    id="add-to-cart-selected"
                    onClick={() => addToCart(selectedProduct, selectedSize || selectedProduct.sizes[0], selectedColor || selectedProduct.colors[0])}
                    onMouseEnter={onBtnHover}
                    className="sm:col-span-3 py-4.5 bg-white text-black hover:bg-zinc-200 border-2 border-white hover:translate-x-1 hover:translate-y-1 transition-all uppercase text-xs font-black tracking-[0.2em] shadow-[6px_6px_0px_rgba(255,255,255,0.1)] hover:shadow-none cursor-pointer"
                  >
                    ADD TO CART BAG
                  </button>
                  <button
                    id="add-to-wishlist-selected"
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    onMouseEnter={onBtnHover}
                    className="py-4.5 border-2 border-zinc-800 hover:border-white flex items-center justify-center transition-colors cursor-pointer bg-black text-white hover:bg-white hover:text-black"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-current'}`} />
                  </button>
                </div>

                {/* Sizing Details list */}
                <div className="bg-[#050505] p-6 border-2 border-zinc-900 space-y-4 shadow-[4px_4px_0px_rgba(255,255,255,0.02)]">
                  <p className="text-xs uppercase tracking-widest text-white font-mono font-bold">✦ Garment Anatomy Specification</p>
                  <ul className="space-y-2.5 text-xs text-zinc-400 font-sans">
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-white font-black mr-1 select-none">▪</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Review section */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <h3 className="text-lg uppercase tracking-wider text-white">Client Feedback</h3>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border border-white/5 p-4 rounded bg-zinc-950 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white">{rev.author}</span>
                          <span className="text-zinc-500 font-mono">{rev.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-zinc-400 font-light italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review form */}
                  <form onSubmit={(e) => handleSubmitReview(e, selectedProduct.id)} className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Submit Your Verdict</p>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs text-zinc-500 mr-2">Score:</span>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => { onBtnClick(); setNewReview({ ...newReview, rating: val }); }}
                          className="text-yellow-400"
                        >
                          <Star className={`w-4 h-4 ${newReview.rating >= val ? 'fill-current' : 'text-zinc-700'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder="Comment on fabric weight, silhouette drape, and general comfort..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-zinc-950 border border-white/10 rounded p-3 text-xs text-white focus:outline-none focus:border-white h-20 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors py-2.5 text-[10px] uppercase tracking-widest font-bold"
                    >
                      Post Verdict
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <>
            {/* VIEW 2: HOME & LOOKBOOK SECTION */}
            {activeTab === 'home' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-24"
              >
                
                {/* HERO CAROUSEL / VIDEO ATMOSPHERE HERO */}
                <section 
                  className="relative h-[88vh] flex items-center justify-center overflow-hidden border-b border-zinc-900 bg-zinc-950"
                >
                  {/* Premium Subtle Tech Grid pattern backdrop */}
                  <div className="absolute inset-0 z-0 bg-black opacity-20 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
                  
                  {/* Cinematic Backdrop Image with High Contrast Vignette */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <motion.img 
                      initial={{ scale: 1.08, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.45 }}
                      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                      src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1600" 
                      alt="KYRO Atmospheric editorial brand cover" 
                      className="w-full h-full object-cover mix-blend-luminosity"
                    />
                    {/* Multi-layered cinematic gradient overlays to guarantee pristine contrast and legibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/30 to-zinc-950" />
                  </div>

                  {/* Left bottom decorative designer signature brand line */}
                  <div className="absolute bottom-12 left-8 md:left-12 z-10 hidden md:block">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="border-l border-white/20 pl-4 py-1 space-y-0.5"
                    >
                      <span className="text-[9px] tracking-[0.4em] text-zinc-500 uppercase font-mono block">ATELIER ESTABLISHED</span>
                      <span className="text-[11px] text-white uppercase font-black font-display tracking-[0.2em] block">KYRO COUTURE ©2026</span>
                    </motion.div>
                  </div>

                  {/* Right bottom coordinate design label */}
                  <div className="absolute bottom-12 right-8 md:right-12 z-10 hidden md:block">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 1 }}
                      className="text-right space-y-0.5"
                    >
                      <span className="text-[9px] tracking-[0.3em] text-zinc-500 uppercase font-mono block">PROJECT TYPE</span>
                      <span className="text-[10px] text-zinc-300 uppercase font-mono tracking-widest block">SPECIAL RELEASE STAGE / ACTIVE</span>
                    </motion.div>
                  </div>

                  {/* Central Text Panel with Ultra-Premium Transitions */}
                  <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 cursor-default">
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, letterSpacing: '0.2em', y: -10 }}
                        animate={{ opacity: 1, letterSpacing: '0.5em', y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[10px] text-zinc-400 uppercase block font-mono font-bold"
                      >
                        ✦ PRETERNATURAL APPAREL ✦
                      </motion.div>

                      {/* Clean display typography heading */}
                      <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-7xl md:text-9xl font-display uppercase tracking-tighter text-white leading-none font-black select-none"
                      >
                        {cmsConfig.heroTitle}
                      </motion.h1>

                      {/* Tagline */}
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xs md:text-sm font-mono tracking-[0.5em] text-zinc-400 font-bold uppercase"
                      >
                        {cmsConfig.heroTagline}
                      </motion.p>
                    </div>

                    <motion.p 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-xl mx-auto text-xs md:text-sm text-zinc-400 leading-relaxed font-light tracking-wide px-4"
                    >
                      {cmsConfig.heroDescription}
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2"
                    >
                      <button
                        id="hero-shop-btn"
                        onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                        onMouseEnter={onBtnHover}
                        className="px-10 py-4 bg-white text-black hover:bg-zinc-200 transition-all font-bold text-xs uppercase tracking-[0.25em] w-full sm:w-auto border border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
                      >
                        Enter Collection
                      </button>
                      <button
                        id="hero-stylist-btn"
                        onClick={() => { onBtnClick(); setActiveTab('stylist'); }}
                        onMouseEnter={onBtnHover}
                        className="px-10 py-4 bg-transparent border border-white/30 hover:border-white hover:bg-white/5 transition-all text-white font-bold text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                        AI Styling Studio
                      </button>
                    </motion.div>
                  </div>

                  {/* Scroll indicator overlay */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <span className="text-[8px] tracking-[0.3em] uppercase text-zinc-500 font-mono">SCROLL DOWN</span>
                    <div className="w-[1.5px] h-10 bg-zinc-800 relative overflow-hidden">
                      <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white" 
                      />
                    </div>
                  </div>
                </section>

                {/* HIGH-IMPACT STREETWEAR TICKER RIBBON */}
                <div className="w-full bg-[#000000] py-4 border-y border-white/10 overflow-hidden select-none -rotate-1 relative z-10 shadow-lg shadow-black/80">
                  <div className="animate-ticker-fast whitespace-nowrap flex gap-12 items-center text-white text-xs font-display tracking-[0.3em] uppercase font-black">
                    {Array(8).fill("✦ URBAN CULTURE ARCHIVE ✦ STREETWEAR DIVISION ✦ KYRO ORIGINAL SILHOUETTES ✦ LIMITED RUN RELEASES ✦ DESIGN LOOM STAGE ✦ TOKYO • SEOUL • LA • PARIS • MILAN").map((text, idx) => (
                      <span key={idx} className="flex-shrink-0 text-white">{text}</span>
                    ))}
                  </div>
                </div>

                {/* BRAND STORY / CORE VALUES */}
                <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-8">
                  <div className="flex justify-center">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-500 font-mono">THE MANIFESTO</h2>
                  <p className="editorial-serif text-xl md:text-3xl font-bold text-zinc-200 uppercase tracking-wider leading-relaxed">
                    "{cmsConfig.storyTitle}"
                  </p>
                  <p className="max-w-2xl mx-auto text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                    {cmsConfig.storyText}
                  </p>
                </section>

                {/* CATEGORIES GRID */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">EXPLORE SILHOUETTES</span>
                      <h2 className="text-2xl font-bold uppercase tracking-wider text-white">CURATED CATEGORIES</h2>
                    </div>
                    <button 
                      onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                      className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      All Garments <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: 'Outerwear', desc: 'Heavy weight draping armor', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600', badge: '500GSM' },
                      { name: 'Trousers', desc: 'Japanese cotton-ripstop modular geometry', img: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600', badge: 'RIPSTOP' },
                      { name: 'Accessories', desc: 'Italian cellulose and merino fine knits', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600', badge: 'ZEISS' }
                    ].map((cat) => (
                      <div 
                        key={cat.name} 
                        onClick={() => { onBtnClick(); setFilterCategory(cat.name); setActiveTab('shop'); }}
                        className="group relative aspect-[4/5] bg-black border-2 border-zinc-800 hover:border-white overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:translate-x-1 shadow-[6px_6px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_rgba(255,255,255,0.1)]"
                      >
                        <img 
                          src={cat.img} 
                          alt={cat.name} 
                          className="w-full h-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                        
                        <span className="absolute top-4 right-4 bg-black border border-white/20 text-white text-[8px] font-mono tracking-widest px-2.5 py-1 uppercase">
                          {cat.badge}
                        </span>

                        <div className="absolute bottom-6 left-6 space-y-2">
                          <h3 className="text-2xl font-display uppercase tracking-tight text-white group-hover:text-white transition-colors">{cat.name}</h3>
                          <p className="text-[10px] text-zinc-400 tracking-wide font-mono uppercase">{cat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FEATURED / NEW ARRIVALS CAROUSEL */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] tracking-[0.3em] text-white uppercase font-mono font-bold">✦ THE LATEST DROPS ✦</span>
                      <h2 className="text-3xl font-display uppercase tracking-tight text-white">NEW ARRIVALS</h2>
                    </div>
                    <button 
                      onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                      className="text-xs uppercase tracking-widest text-white hover:text-zinc-400 flex items-center gap-1.5 transition-colors font-bold"
                    >
                      View All Catalog <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {loadingProducts ? (
                    <div className="py-24 text-center text-zinc-500 text-xs tracking-widest uppercase">
                      Loading stock configuration...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.slice(0, 4).map((product) => (
                        <div 
                          key={product.id}
                          className="group relative border-2 border-zinc-900 bg-[#000000] p-4 transition-all hover:border-white hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] duration-300"
                        >
                          {/* Image area */}
                          <div 
                            onClick={() => { onBtnClick(); setSelectedProduct(product); }}
                            className="aspect-[4/5] bg-zinc-950 overflow-hidden relative cursor-pointer border border-zinc-800"
                          >
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className={`w-full h-full object-cover transition-all duration-700 ${product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'} mix-blend-luminosity group-hover:mix-blend-normal`}
                            />
                            {product.images.length > 1 && (
                              <img 
                                src={product.images[1]} 
                                alt={`${product.name} Alternate View`} 
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 mix-blend-luminosity group-hover:mix-blend-normal"
                              />
                            )}
                            {product.isNew ? (
                              <span className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-[0.25em] px-2.5 py-1 z-10">
                                NEW DROP
                              </span>
                            ) : product.isFeatured ? (
                              <span className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-[0.25em] px-2.5 py-1 z-10">
                                LTD RUN
                              </span>
                            ) : null}
                          </div>

                          {/* Detail summary */}
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono">
                              <span className="text-zinc-500">{product.category}</span>
                              <span className="text-white font-bold">${product.price}</span>
                            </div>
                            <h3 
                              onClick={() => { onBtnClick(); setSelectedProduct(product); }}
                              className="font-display text-sm text-white uppercase tracking-tight hover:text-white cursor-pointer truncate transition-colors"
                            >
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                              {/* Add quick option */}
                              <button
                                onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                                className="text-[10px] uppercase font-black tracking-widest text-white hover:text-zinc-400 transition-colors focus:outline-none cursor-pointer"
                              >
                                + QUICK ADD
                              </button>
                              <button 
                                onClick={() => toggleWishlist(product.id)}
                                className="text-zinc-500 hover:text-white transition-colors"
                              >
                                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* EDITORIAL LOOKBOOK EXPLORER */}
                <section className="bg-[#000000] py-24 border-y-2 border-zinc-900">
                  <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
                    <div className="text-center space-y-2">
                      <span className="text-[10px] tracking-[0.4em] text-white uppercase font-mono font-bold">✦ RAW LOOKBOOK EXCLUSIVES ✦</span>
                      <h2 className="text-4xl font-display uppercase tracking-tight text-white">KYRO LOOKBOOKS</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7">
                        <div className="aspect-[16/10] bg-zinc-950 border-2 border-zinc-800 hover:border-white overflow-hidden relative group transition-all duration-300 shadow-[8px_8px_0px_rgba(255,255,255,0.05)] hover:shadow-[8px_8px_0px_rgba(255,255,255,0.1)]">
                          <img 
                            src={LOOKBOOK_IMAGES[lookbookIndex].imageUrl} 
                            alt={LOOKBOOK_IMAGES[lookbookIndex].title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                          
                          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                            <div>
                              <span className="text-[10px] tracking-[0.25em] text-white uppercase font-mono block mb-1 font-bold">
                                {LOOKBOOK_IMAGES[lookbookIndex].tagline}
                              </span>
                              <h3 className="text-2xl font-display uppercase text-white tracking-tight">
                                {LOOKBOOK_IMAGES[lookbookIndex].title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => { onBtnClick(); setLookbookIndex(prev => prev === 0 ? LOOKBOOK_IMAGES.length - 1 : prev - 1); }}
                                className="p-2.5 bg-black border-2 border-white text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => { onBtnClick(); setLookbookIndex(prev => prev === LOOKBOOK_IMAGES.length - 1 ? 0 : prev + 1); }}
                                className="p-2.5 bg-black border-2 border-white text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 space-y-6">
                        <div className="space-y-3">
                          <span className="text-[9px] font-mono tracking-[0.3em] text-zinc-500 uppercase font-bold">
                            EDITORIAL {lookbookIndex + 1} OF {LOOKBOOK_IMAGES.length}
                          </span>
                          <h4 className="text-3xl font-display uppercase tracking-tight text-white">
                            {LOOKBOOK_IMAGES[lookbookIndex].title}
                          </h4>
                          <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                            {LOOKBOOK_IMAGES[lookbookIndex].description}
                          </p>
                        </div>
                        <button
                          onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                          className="px-6 py-4 bg-white text-black border-2 border-black hover:bg-zinc-200 hover:translate-x-1 hover:translate-y-1 transition-all font-black text-xs uppercase tracking-[0.2em] inline-flex items-center gap-2 shadow-[4px_4px_0px_rgba(255,255,255,0.1)] hover:shadow-none"
                        >
                          Shop This Volume <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
                               {/* TESTIMONIALS SLIDER */}
                <section className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-black border-2 border-zinc-900 p-8 shadow-[4px_4px_0px_rgba(255,255,255,0.05)] text-center">
                  <span className="text-[10px] tracking-[0.4em] text-white uppercase font-mono font-bold block">✦ CRITICAL RECEPTION ✦</span>
                  <div className="space-y-6">
                    {TESTIMONIALS.map((test, idx) => (
                      <div key={idx} className="space-y-3 pb-6 border-b border-zinc-900 last:border-0 last:pb-0">
                        <p className="font-display text-lg md:text-xl text-zinc-200 uppercase tracking-tight">
                          "{test.quote}"
                        </p>
                        <p className="text-xs uppercase tracking-widest text-white font-mono">
                          — {test.author} <span className="text-zinc-500">/ {test.role}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* EDITORIAL INSTAGRAM FEED */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
                  <div className="text-center">
                    <span className="text-[10px] tracking-[0.3em] text-white uppercase font-mono font-bold">@KYRO_STUDIO</span>
                    <h2 className="text-3xl font-display uppercase tracking-tight text-white">INSTAGRAM CAPTURES</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {INSTAGRAM_POSTS.map((post) => (
                      <div key={post.id} className="group relative aspect-square bg-zinc-950 border-2 border-zinc-900 hover:border-white overflow-hidden transition-all duration-300">
                        <img 
                          src={post.imageUrl} 
                          alt="Model styling portrait" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity hover:mix-blend-normal" 
                        />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-xs font-mono text-white tracking-widest flex items-center gap-1 font-bold">
                            ✦ {post.likes} LIKES
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* NEWSLETTER */}
                <section className="max-w-3xl mx-auto px-6 py-16 text-center space-y-6 bg-black border-2 border-zinc-800 shadow-[6px_6px_0px_rgba(255,255,255,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  <span className="text-[10px] tracking-[0.4em] text-white uppercase font-mono font-bold block">✦ THE INSIDE GUILD ✦</span>
                  <h2 className="text-3xl font-display uppercase tracking-tight text-white">JOIN THE EXCLUSIVE CIRCLE</h2>
                  <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto leading-relaxed">
                    Be the first to secure access to extremely limited streetwear drops, custom fabric releases, and private product catalog logs.
                  </p>
                  
                  {/* Join circle action state */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      onBtnClick();
                      showToast('Welcome to the KYRO guild. Precise high-density communications are registered to your email.', 'GUILD REGISTERED');
                    }} 
                    className="max-w-md mx-auto flex items-center gap-3 bg-zinc-950 border-2 border-zinc-800 focus-within:border-white p-2 transition-colors"
                  >
                    <input 
                      type="email" 
                      placeholder="ENTER EMAIL ADDRESS" 
                      required
                      className="bg-transparent border-none text-white text-xs font-mono uppercase tracking-widest focus:outline-none flex-grow px-2"
                    />
                    <button 
                      type="submit" 
                      className="bg-white text-black hover:bg-zinc-200 p-2.5 transition-colors cursor-pointer flex items-center justify-center font-bold"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </section>

              </motion.div>
            )}

            {/* VIEW 3: FULL SHOP / PRODUCT CATALOG WITH FILTERS */}
            {activeTab === 'shop' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-7xl mx-auto px-4 md:px-8 py-12"
              >
                <div className="space-y-8">
                  
                  {/* Top Bar / Search and Category tags */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-zinc-900 pb-8">
                    <div>
                      <span className="text-[10px] tracking-[0.4em] text-white font-mono font-bold uppercase">✦ ARCHIVAL CATALOG ✦</span>
                      <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-white">THE FULL COLLECTION</h1>
                    </div>

                    <div className="flex items-center gap-4 bg-black p-3.5 border-2 border-zinc-800 focus-within:border-white max-w-md w-full md:w-auto transition-colors">
                      <Search className="w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Search heavy garments..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none text-xs text-white focus:outline-none w-full md:w-64 uppercase tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  {/* Main Grid: Filters Sidebar + Catalog Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-3 space-y-8 bg-[#000000] p-6 border-2 border-zinc-900 shadow-[6px_6px_0px_rgba(255,255,255,0.03)]">
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest text-white font-mono font-bold flex items-center gap-2">
                          <SlidersHorizontal className="w-3.5 h-3.5 text-white" /> FILTER BY
                        </span>
                        <button 
                          onClick={() => {
                            onBtnClick();
                            setFilterCategory('All');
                            setFilterColor('All');
                            setFilterSize('All');
                            setFilterPrice(500);
                          }}
                          className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white font-mono font-bold transition-colors cursor-pointer"
                        >
                          [ Clear ]
                        </button>
                      </div>

                      <hr className="border-zinc-900" />

                      {/* Category Filter */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">Category</h4>
                        <div className="space-y-2">
                          {['All', 'Outerwear', 'Trousers', 'T-Shirts', 'Accessories'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => { onBtnClick(); setFilterCategory(cat); }}
                              className={`w-full text-left text-xs uppercase tracking-widest py-1.5 border-l-2 pl-3 transition-colors ${filterCategory === cat ? 'border-white text-white font-bold' : 'border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Filter */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">Color Tone</h4>
                        <div className="flex flex-wrap gap-2">
                          {['All', ...allColors].map((col) => (
                            <button
                              key={col}
                              onClick={() => { onBtnClick(); setFilterColor(col); }}
                              className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono border-2 transition-all ${filterColor === col ? 'bg-white text-black border-white font-bold' : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-white'}`}
                            >
                              {col}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Filter */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">Sizing Dimensions</h4>
                        <div className="flex flex-wrap gap-2">
                          {['All', ...allSizes].map((sz) => (
                            <button
                              key={sz}
                              onClick={() => { onBtnClick(); setFilterSize(sz); }}
                              className={`w-10 h-10 border-2 flex items-center justify-center text-[10px] font-mono uppercase transition-all ${filterSize === sz ? 'bg-white text-black border-white font-black' : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-white'}`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Price Limit Filter */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">
                          <span>Max Price</span>
                          <span className="font-mono text-white">${filterPrice}</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="500" 
                          step="10" 
                          value={filterPrice}
                          onChange={(e) => setFilterPrice(Number(e.target.value))}
                          className="w-full accent-white bg-zinc-800 h-1 cursor-pointer"
                        />
                      </div>

                      {/* Sort dropdown */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-mono font-bold">Sort Order</h4>
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full bg-zinc-950 border-2 border-zinc-800 p-2.5 text-xs text-white uppercase tracking-widest focus:outline-none focus:border-white"
                        >
                          <option value="featured">Featured Picks</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="rating">High Customer Verdict</option>
                        </select>
                      </div>

                    </div>

                    {/* Catalog Listing */}
                    <div className="lg:col-span-9 space-y-6">
                      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-500">
                        <span>Showing {sortedProducts.length} premium products</span>
                      </div>

                      {sortedProducts.length === 0 ? (
                        <div className="border border-white/5 py-32 text-center space-y-4">
                          <SlidersHorizontal className="w-8 h-8 text-zinc-700 mx-auto" />
                          <p className="text-zinc-500 text-xs tracking-widest uppercase">No luxury garments match current criteria</p>
                          <button 
                            onClick={() => {
                              onBtnClick();
                              setFilterCategory('All');
                              setFilterColor('All');
                              setFilterSize('All');
                              setFilterPrice(500);
                            }}
                            className="text-xs uppercase tracking-widest text-white underline hover:text-zinc-300"
                          >
                            Reset filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sortedProducts.map((product) => (
                            <div 
                              key={product.id}
                              className="group relative border-2 border-zinc-900 bg-[#000000] p-4 transition-all hover:border-white hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_rgba(255,255,255,0.1)] duration-300"
                            >
                              {/* Product Portrait Image Area */}
                              <div 
                                onClick={() => { onBtnClick(); setSelectedProduct(product); }}
                                className="aspect-[4/5] bg-zinc-950 overflow-hidden relative cursor-pointer border border-zinc-800"
                              >
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className={`w-full h-full object-cover transition-all duration-700 ${product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'} mix-blend-luminosity group-hover:mix-blend-normal`}
                                />
                                {product.images.length > 1 && (
                                  <img 
                                    src={product.images[1]} 
                                    alt={`${product.name} Alternate Spec`} 
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 mix-blend-luminosity group-hover:mix-blend-normal"
                                  />
                                )}
                                {product.isNew ? (
                                  <span className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-[0.25em] px-2.5 py-1 z-10">
                                    NEW RELEASE
                                  </span>
                                ) : product.isFeatured ? (
                                  <span className="absolute top-3 left-3 bg-white text-black text-[8px] font-black uppercase tracking-[0.25em] px-2.5 py-1 z-10">
                                    LTD RUN
                                  </span>
                                ) : null}
                              </div>

                              {/* Details summary */}
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-mono">
                                  <span className="text-zinc-500">{product.category}</span>
                                  <span className="text-white font-bold">${product.price}</span>
                                </div>
                                <h3 
                                  onClick={() => { onBtnClick(); setSelectedProduct(product); }}
                                  className="font-display text-sm text-white uppercase tracking-tight hover:text-white cursor-pointer truncate transition-colors"
                                >
                                  {product.name}
                                </h3>
                                
                                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                                  <button
                                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                                    className="text-[10px] uppercase font-black tracking-widest text-white hover:text-zinc-400 transition-colors focus:outline-none cursor-pointer"
                                  >
                                    + QUICK ADD
                                  </button>
                                  <button 
                                    onClick={() => toggleWishlist(product.id)}
                                    className="text-zinc-500 hover:text-white transition-colors animate-pulse"
                                  >
                                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </motion.div>
            )}

            {/* VIEW 4: WISHLIST VIEW */}
            {activeTab === 'wishlist' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-7xl mx-auto px-4 md:px-8 py-12"
              >
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase">SAVED SILHOUETTES</span>
                    <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white">YOUR WISHLIST BAG</h1>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="border border-white/5 py-32 text-center space-y-6">
                      <Heart className="w-12 h-12 text-zinc-800 mx-auto" />
                      <p className="text-zinc-500 text-xs tracking-widest uppercase">Your minimalist wishlist is completely empty</p>
                      <button 
                        onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                        className="px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        Enter Shop Archive
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.filter(p => wishlist.includes(p.id)).map((product) => (
                        <div 
                          key={product.id}
                          className="group relative border border-white/5 bg-zinc-950/20 p-3.5 rounded"
                        >
                          <div 
                            onClick={() => { onBtnClick(); setSelectedProduct(product); }}
                            className="aspect-[4/5] bg-zinc-900 overflow-hidden relative cursor-pointer"
                          >
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-luminosity" />
                          </div>
                          <div className="mt-4 space-y-2">
                            <h3 className="font-bold text-sm text-white uppercase tracking-wide truncate">{product.name}</h3>
                            <p className="font-mono text-xs text-zinc-400">${product.price}</p>
                            <div className="flex items-center justify-between pt-2">
                              <button
                                onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                                className="text-[10px] uppercase font-bold tracking-widest text-white hover:underline"
                              >
                                Move to Cart
                              </button>
                              <button 
                                onClick={() => toggleWishlist(product.id)}
                                className="text-red-500 hover:text-red-400"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 5: ORDER TRACKING SCREEN */}
            {activeTab === 'orders' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto px-4 py-12"
              >
                <div className="space-y-8">
                  <div>
                    <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase">POST-PURCHASE REALTIME PIPELINE</span>
                    <h1 className="text-4xl font-extrabold uppercase tracking-wider text-white">ORDER TRACKING</h1>
                  </div>

                  {/* REALTIME DISPATCH TRACKER SEARCH BAR */}
                  <div className="bg-zinc-950 border border-white/5 p-4 rounded shadow-[4px_4px_0px_rgba(255,255,255,0.03)] space-y-3">
                    <p className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 font-bold">Search Courier Database</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER ORDER SIGNATURE (e.g. KYRO-ORD-123456)"
                        value={searchOrderId}
                        onChange={(e) => setSearchOrderId(e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-none px-3 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white flex-grow font-mono uppercase tracking-widest"
                      />
                      <button 
                        onClick={handleTrackOrderById}
                        className="bg-white text-black hover:bg-zinc-200 px-5 py-2 transition-colors text-xs font-bold uppercase tracking-widest font-mono cursor-pointer"
                      >
                        TRACK
                      </button>
                    </div>
                    {searchOrderError && (
                      <p className="text-[10px] text-red-400 font-mono uppercase tracking-wider">{searchOrderError}</p>
                    )}
                  </div>

                  {/* DISPLAY SEARCHED ORDER LOG IF Matched */}
                  {searchedOrder ? (
                    <div className="border-2 border-white bg-zinc-950 p-6 rounded space-y-6 relative shadow-[8px_8px_0px_rgba(255,255,255,0.05)]">
                      <button 
                        onClick={() => { onBtnClick(); setSearchedOrder(null); setSearchOrderId(''); }}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors text-[9px] uppercase tracking-widest font-mono font-bold cursor-pointer"
                      >
                        [Clear track log]
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold">
                          ✓ FOUND DIRECT SHIPMENT LOG
                        </span>
                      </div>
                      
                      {/* Order metadata banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] tracking-wider text-zinc-500 font-mono">ORDER ID: {searchedOrder.id}</span>
                          <div className="text-xs uppercase text-zinc-300">
                            Total paid: <span className="text-white font-bold font-mono">${searchedOrder.total}</span> via <span className="text-white uppercase font-bold font-mono">{searchedOrder.paymentMethod}</span>
                            {searchedOrder.appliedPromoCode && (
                              <span className="text-emerald-400 text-[9px] uppercase font-mono block mt-1">
                                [✓ PROMO Applied: {searchedOrder.appliedPromoCode} (-${searchedOrder.discountAmount})]
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-white">
                            {searchedOrder.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-emerald-400">
                            {searchedOrder.paymentStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Progression tracker line */}
                      <div className="grid grid-cols-4 gap-2 py-4">
                        {[
                          { label: 'Placed', active: true },
                          { label: 'Processing', active: searchedOrder.status === 'processing' || searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered' },
                          { label: 'Shipped', active: searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered' },
                          { label: 'Delivered', active: searchedOrder.status === 'delivered' }
                        ].map((step, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className={`h-1.5 rounded-full ${step.active ? 'bg-white' : 'bg-zinc-800'}`} />
                            <span className={`text-[10px] uppercase tracking-widest font-mono block text-center ${step.active ? 'text-white font-bold' : 'text-zinc-600'}`}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address overview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/30 p-4 border border-white/5 rounded">
                        <div className="space-y-1.5 text-xs">
                          <p className="uppercase tracking-widest text-zinc-500 text-[10px]">Recipient & Contact</p>
                          <p className="text-white font-semibold">{searchedOrder.shippingAddress.fullName}</p>
                          <p className="text-zinc-400">{searchedOrder.shippingAddress.email}</p>
                          <p className="text-zinc-400">{searchedOrder.shippingAddress.phone}</p>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <p className="uppercase tracking-widest text-zinc-500 text-[10px]">Delivery destination</p>
                          <p className="text-zinc-400">{searchedOrder.shippingAddress.address}</p>
                          <p className="text-zinc-300 font-medium">{searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Items Summary</p>
                        <div className="space-y-2">
                          {searchedOrder.items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between text-xs bg-zinc-900/20 p-2 border border-white/5 rounded">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-12 bg-zinc-900 overflow-hidden rounded">
                                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-white font-bold uppercase truncate">{item.product.name}</p>
                                  <p className="text-[9px] text-zinc-500 uppercase font-mono">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                                </div>
                              </div>
                              <span className="font-mono text-zinc-300">{item.quantity} × ${item.product.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Simulation Controls for testing */}
                      <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-yellow-500">
                          ▲ SIMULATE SHIPMENT LOGISTICS FOR PREVIEW
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              await handleUpdateOrderStatus(searchedOrder.id, 'processing');
                              handleTrackOrderById();
                            }}
                            className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                          >
                            Mark Processing
                          </button>
                          <button
                            onClick={async () => {
                              await handleUpdateOrderStatus(searchedOrder.id, 'shipped');
                              handleTrackOrderById();
                            }}
                            className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                          >
                            Mark Shipped
                          </button>
                          <button
                            onClick={async () => {
                              await handleUpdateOrderStatus(searchedOrder.id, 'delivered');
                              handleTrackOrderById();
                            }}
                            className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : null}

                  {orders.length === 0 ? (
                    <div className="border border-white/5 py-24 text-center bg-zinc-950/40 rounded space-y-4">
                      <Truck className="w-8 h-8 text-zinc-700 mx-auto" />
                      <p className="text-zinc-500 text-xs tracking-widest uppercase">No orders registered under this client signature</p>
                      <button 
                        onClick={() => { onBtnClick(); setActiveTab('shop'); }}
                        className="px-6 py-3 bg-white text-black hover:bg-zinc-200 transition-colors text-xs font-bold uppercase tracking-widest"
                      >
                        Initiate Shopping Drop
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((ord) => (
                        <div key={ord.id} className="border border-white/5 bg-zinc-950 p-6 rounded space-y-6">
                          
                          {/* Order metadata banner */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                            <div className="space-y-1">
                              <span className="text-[10px] tracking-wider text-zinc-500 font-mono">ORDER ID: {ord.id}</span>
                              <div className="text-xs uppercase text-zinc-300">
                                Total paid: <span className="text-white font-bold font-mono">${ord.total}</span> via <span className="text-white uppercase font-bold font-mono">{ord.paymentMethod}</span>
                                {ord.appliedPromoCode && (
                                  <span className="text-emerald-400 text-[9px] uppercase font-mono block mt-1">
                                    [✓ PROMO Applied: {ord.appliedPromoCode} (-${ord.discountAmount})]
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-white">
                                {ord.status.toUpperCase()}
                              </span>
                              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-zinc-900 border border-white/10 text-emerald-400">
                                {ord.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Progression tracker line */}
                          <div className="grid grid-cols-4 gap-2 py-4">
                            {[
                              { label: 'Placed', active: true },
                              { label: 'Processing', active: ord.status === 'processing' || ord.status === 'shipped' || ord.status === 'delivered' },
                              { label: 'Shipped', active: ord.status === 'shipped' || ord.status === 'delivered' },
                              { label: 'Delivered', active: ord.status === 'delivered' }
                            ].map((step, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className={`h-1.5 rounded-full ${step.active ? 'bg-white' : 'bg-zinc-800'}`} />
                                <span className={`text-[10px] uppercase tracking-widest font-mono block text-center ${step.active ? 'text-white font-bold' : 'text-zinc-600'}`}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Address overview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/30 p-4 border border-white/5 rounded">
                            <div className="space-y-1.5 text-xs">
                              <p className="uppercase tracking-widest text-zinc-500 text-[10px]">Recipient & Contact</p>
                              <p className="text-white font-semibold">{ord.shippingAddress.fullName}</p>
                              <p className="text-zinc-400">{ord.shippingAddress.email}</p>
                              <p className="text-zinc-400">{ord.shippingAddress.phone}</p>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <p className="uppercase tracking-widest text-zinc-500 text-[10px]">Delivery destination</p>
                              <p className="text-zinc-400">{ord.shippingAddress.address}</p>
                              <p className="text-zinc-300 font-medium">{ord.shippingAddress.city}, {ord.shippingAddress.country}</p>
                            </div>
                          </div>

                          {/* Order items */}
                          <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Items Summary</p>
                            <div className="space-y-2">
                              {ord.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-xs bg-zinc-900/20 p-2 border border-white/5 rounded">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-12 bg-zinc-900 overflow-hidden rounded">
                                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <p className="text-white font-bold uppercase truncate">{item.product.name}</p>
                                      <p className="text-[9px] text-zinc-500 uppercase font-mono">Size: {item.selectedSize} | Color: {item.selectedColor}</p>
                                    </div>
                                  </div>
                                  <span className="font-mono text-zinc-300">{item.quantity} × ${item.product.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Simulation Controls for testing */}
                          <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                            <span className="text-[9px] uppercase font-mono tracking-widest text-yellow-500">
                              ▲ SIMULATE SHIPMENT LOGISTICS FOR PREVIEW
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'processing')}
                                className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                              >
                                Mark Processing
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                                className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                              >
                                Mark Shipped
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                                className="px-2.5 py-1 text-[9px] uppercase font-mono bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-300"
                              >
                                Mark Delivered
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* VIEW 6: REALTIME GEMINI STYLIST INTERFACE (KYRO STUDIO) */}
            {activeTab === 'stylist' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto px-4 py-12 flex flex-col h-[75vh]"
              >
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" /> KYRO ATELIER
                    </span>
                    <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">AI OUTFIT STYLIST</h1>
                  </div>

                  <div className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded border border-white/5">
                    ● DIRECT COMMUNICATION
                  </div>
                </div>

                {/* Chat Bubbles Scroll Area */}
                <div className="flex-grow overflow-y-auto space-y-6 pr-2 mb-6">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                    >
                      <div 
                        className={`rounded p-4 text-xs leading-relaxed ${
                          msg.sender === 'user' 
                            ? 'bg-white text-black font-medium font-mono uppercase tracking-wider' 
                            : 'bg-zinc-950 border border-white/10 text-zinc-300 font-light'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Display suggested product catalog cards beneath response */}
                      {msg.productRecommendations && msg.productRecommendations.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full">
                          {msg.productRecommendations.map((prod) => (
                            <div 
                              key={prod.id} 
                              className="flex items-center justify-between p-2.5 bg-[#0a0a0a] border border-white/5 rounded text-xs gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-12 bg-zinc-900 rounded overflow-hidden flex-shrink-0">
                                  <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white font-bold truncate uppercase text-[10px]">{prod.name}</p>
                                  <p className="text-[9px] font-mono text-zinc-500">${prod.price}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => { onBtnClick(); setSelectedProduct(prod); }}
                                className="px-2 py-1 bg-zinc-900 hover:bg-white hover:text-black transition-colors border border-white/10 text-[9px] uppercase tracking-widest"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[8px] font-mono text-zinc-600 mt-1.5 uppercase">
                        {msg.sender === 'user' ? 'Client' : 'KYRO Director'}
                      </span>
                    </div>
                  ))}

                  {isChatGenerating && (
                    <div className="flex flex-col items-start max-w-[85%]">
                      <div className="bg-zinc-950 border border-white/10 p-4 rounded text-xs text-zinc-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                        <span>KYRO Director is drafting a garment proposal...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2 bg-zinc-950 p-2.5 border border-white/10 rounded">
                  <input
                    type="text"
                    placeholder="Try: 'Draft an outfit with heavy loopback structures for a rainy autumn day in Milan...'"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isChatGenerating}
                    className="flex-grow bg-transparent border-none text-xs text-white focus:outline-none uppercase tracking-widest font-mono p-2"
                  />
                  <button 
                    type="submit"
                    disabled={isChatGenerating}
                    className="p-3 bg-white text-black hover:bg-zinc-200 transition-colors rounded"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </motion.div>
            )}

            {/* VIEW 7: FULL ADMIN AND CMS CONTROL PANEL */}
            {activeTab === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12"
              >
                
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                  <div className="space-y-1">
                    <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" /> SYSTEM CONTROL CENTER
                    </span>
                    <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">ADMIN DASHBOARD</h1>
                  </div>

                  <div className="text-xs text-zinc-400 font-mono bg-zinc-950 px-3.5 py-1.5 rounded border border-white/10">
                    Logged as: <span className="text-white font-bold">{currentUser.email}</span>
                  </div>
                </div>

                {/* Analytics Metrics Overview row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Cumulative Revenue', val: `$${orders.reduce((sum, o) => sum + o.total, 0)}`, desc: 'From certified orders', icon: DollarSign },
                    { label: 'Active Catalog', val: `${products.length} Items`, desc: 'Unique SKU configurations', icon: Package },
                    { label: 'Processed Orders', val: `${orders.length} Units`, desc: 'Realtime customer queue', icon: ClipboardList },
                    { label: 'Aesthetic Conversion', val: '100%', desc: 'Pre-selected premium flow', icon: TrendingUp }
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-zinc-950 p-6 border border-white/5 rounded space-y-3">
                      <div className="flex items-center justify-between text-zinc-500">
                        <span className="text-[10px] uppercase tracking-widest font-medium">{metric.label}</span>
                        <metric.icon className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="text-2xl font-mono font-bold text-white">{metric.val}</div>
                      <p className="text-[9px] text-zinc-500 uppercase font-mono">{metric.desc}</p>
                    </div>
                  ))}
                </div>

                {/* TWO-COLUMN GRID: PRODUCT INVENTORY MANAGER + CMS CONTROL & ORDERS TABLE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Product Form & Catalogue List */}
                  <div className="lg:col-span-7 space-y-8">
                    
                    {/* Add / Edit Form */}
                    <div className="bg-zinc-950 p-6 border border-white/5 rounded space-y-6">
                      <h3 className="text-lg uppercase tracking-wider text-white flex items-center gap-2">
                        <Edit className="w-4 h-4" /> {editingProduct ? `REFORM PRODUCT: ${editingProduct.name}` : "ADD NEW APPAREL SPECIFICATION"}
                      </h3>

                      <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Garment Title</label>
                            <input
                              type="text"
                              required
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              placeholder="e.g. Heavy Alpine Parka"
                              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Price ($ USD)</label>
                            <input
                              type="number"
                              required
                              value={productForm.price}
                              onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                              placeholder="120"
                              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Editorial Description</label>
                          <textarea
                            required
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Detailed explanation of the fabric weave, weight, zippers, fitting drape etc..."
                            className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white h-24 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Category Segment</label>
                            <select
                              value={productForm.category}
                              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white"
                            >
                              <option value="Outerwear">Outerwear</option>
                              <option value="Trousers">Trousers</option>
                              <option value="T-Shirts">T-Shirts</option>
                              <option value="Accessories">Accessories</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Inventory Stock Units</label>
                            <input
                              type="number"
                              required
                              value={productForm.stock}
                              onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                              placeholder="25"
                              className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-zinc-400 uppercase tracking-widest font-mono text-[9px]">Primary Image URL</label>
                          <input
                            type="text"
                            required
                            value={productForm.images?.[0] || ''}
                            onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="w-full bg-zinc-900 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-white font-mono"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-grow py-3 bg-white text-black hover:bg-zinc-200 transition-colors font-bold uppercase tracking-widest"
                          >
                            {editingProduct ? "APPLY AMENDMENTS" : "SAVE NEW SPECIFICATION"}
                          </button>
                          {editingProduct && (
                            <button
                              type="button"
                              onClick={() => {
                                onBtnClick();
                                setEditingProduct(null);
                                setProductForm({
                                  name: '',
                                  price: 120,
                                  description: '',
                                  category: 'Outerwear',
                                  colors: ['Onyx Black', 'Cream'],
                                  sizes: ['S', 'M', 'L'],
                                  stock: 20,
                                  features: ['100% Cotton'],
                                  images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800']
                                });
                              }}
                              className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white transition-colors font-bold uppercase tracking-widest"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                      </form>
                    </div>

                    {/* Stock Products List with quick controls */}
                    <div className="bg-zinc-950 p-6 border border-white/5 rounded space-y-4">
                      <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-bold">CURRENT REGISTRY RECORDS</h3>
                      
                      <div className="space-y-2">
                        {products.map((prod) => (
                          <div key={prod.id} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-white/5 rounded text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-zinc-900 rounded overflow-hidden">
                                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-white font-bold uppercase">{prod.name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-mono">{prod.category} | ${prod.price} | Stock: {prod.stock}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  onBtnClick();
                                  setEditingProduct(prod);
                                  setProductForm(prod);
                                }}
                                className="p-2 bg-zinc-800 text-zinc-300 hover:text-white rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-2 bg-red-950 text-red-400 hover:text-red-200 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: CMS Controls & Active Orders Table */}
                  <div className="lg:col-span-5 space-y-8">
                    
                    {/* CMS Customization Box */}
                    <div className="bg-zinc-950 p-6 border border-white/5 rounded space-y-4">
                      <h3 className="text-sm uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                        <Settings className="w-4 h-4 text-zinc-500" /> CMS HOMEPAGE CONFIUGRATOR
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                        Customize visual copy on the storefront dynamically. Test and check immediately!
                      </p>

                      <div className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-zinc-500 uppercase font-mono text-[9px]">Hero Title Header</label>
                          <input
                            type="text"
                            value={cmsConfig.heroTitle}
                            onChange={(e) => setCmsConfig({ ...cmsConfig, heroTitle: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 rounded p-2.5 text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 uppercase font-mono text-[9px]">Hero Tagline</label>
                          <input
                            type="text"
                            value={cmsConfig.heroTagline}
                            onChange={(e) => setCmsConfig({ ...cmsConfig, heroTagline: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 rounded p-2.5 text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 uppercase font-mono text-[9px]">Hero Summary Text</label>
                          <textarea
                            value={cmsConfig.heroDescription}
                            onChange={(e) => setCmsConfig({ ...cmsConfig, heroDescription: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 rounded p-2.5 text-white focus:outline-none h-16 resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-zinc-500 uppercase font-mono text-[9px]">Brand Slogan Quote</label>
                          <input
                            type="text"
                            value={cmsConfig.storyTitle}
                            onChange={(e) => setCmsConfig({ ...cmsConfig, storyTitle: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 rounded p-2.5 text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Info Box on API */}
                    <div className="bg-zinc-950 p-6 border border-white/5 rounded space-y-3 text-xs">
                      <h4 className="uppercase tracking-wider font-semibold text-white flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-400" /> API SECURE LAYER
                      </h4>
                      <p className="text-zinc-400 leading-relaxed font-light">
                        All client payments and design styling logs are routed to server endpoints securely. Gemini configuration is handled via server-side process environments.
                      </p>
                      <div className="p-3 bg-zinc-900/50 rounded border border-white/5">
                        <p className="font-mono text-[10px] text-zinc-500">PROXIED ENDPOINT ROUTE: /api/advisor</p>
                        <p className="font-mono text-[10px] text-zinc-500">PROXIED ENDPOINT ROUTE: /api/orders</p>
                      </div>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-black py-16 border-t border-white/5 text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg tracking-[0.2em] text-white">KYRO</span>
              <span className="text-[6px] tracking-[0.25em] text-zinc-600 uppercase">BUILT DIFFERENT</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              Architectural luxury garments forged in heavy structural textiles. Inspired by Apple, Fear of God, and Nothing design.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="text-white uppercase tracking-widest font-semibold">COLLECTIONS</h4>
            <ul className="space-y-2 font-light">
              <li><button onClick={() => { setActiveTab('shop'); setFilterCategory('Outerwear'); }} className="hover:text-white transition-colors text-left uppercase text-[10px]">Outerwear Armor</button></li>
              <li><button onClick={() => { setActiveTab('shop'); setFilterCategory('Trousers'); }} className="hover:text-white transition-colors text-left uppercase text-[10px]">Japanese Ripstop Cargos</button></li>
              <li><button onClick={() => { setActiveTab('shop'); setFilterCategory('Accessories'); }} className="hover:text-white transition-colors text-left uppercase text-[10px]">Merino Wool & Cellulose</button></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="text-white uppercase tracking-widest font-semibold">KYRO CONCIERGE</h4>
            <ul className="space-y-2 font-light text-[10px] uppercase">
              <li><button onClick={() => showToast('KYRO complimentary worldwide trackable express delivery occurs within 3 to 5 business days.', 'SHIPPING & EXPEDITION')} className="hover:text-white transition-colors">Shipping & Import</button></li>
              <li><button onClick={() => showToast('We accept returns in pristine original unworn condition within 14 days.', 'RETURNS POLICY')} className="hover:text-white transition-colors">Returns policy</button></li>
              <li><button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors">Post-Purchase pipeline</button></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="text-white uppercase tracking-widest font-semibold font-mono">CLIENT METADATA</h4>
            <div className="space-y-1 font-mono text-[9px]">
              <p>EMAIL: {currentUser.email}</p>
              <p>ESTABLISHED SIGNATURE: v1.0.3-RELEASE</p>
              <p className="text-zinc-600">© {new Date().getFullYear()} KYRO CO. ALL RIGHTS SECURED.</p>
            </div>
          </div>

        </div>
      </footer>

      {/* OVERLAY DRAWER: CART BAG PANEL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Backdrop click close */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-[#0a0a0a] border-l border-white/5 p-6 flex flex-col justify-between"
              >
                
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-white" />
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white">YOUR SHOPPING BAG</h2>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-grow overflow-y-auto space-y-4 pr-1">
                  
                  {cart.length === 0 ? (
                    <div className="py-24 text-center space-y-4">
                      <ShoppingBag className="w-8 h-8 text-zinc-800 mx-auto" />
                      <p className="text-zinc-500 text-xs tracking-widest uppercase">Your minimalist shopping bag is empty</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-4 p-3 bg-zinc-950 border border-white/5 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-16 bg-zinc-900 overflow-hidden rounded border border-white/5">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white uppercase truncate max-w-[150px]">{item.product.name}</h3>
                            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono mt-0.5">
                              Size: {item.selectedSize} | Color: {item.selectedColor}
                            </p>
                            <p className="text-xs text-zinc-300 font-mono mt-1">${item.product.price}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between h-16">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          
                          <div className="flex items-center border border-white/10 rounded overflow-hidden">
                            <button 
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="p-1 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs text-white font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="p-1 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                </div>

                {/* Drawer Footer and Checkout step */}
                {cart.length > 0 && (
                  <div className="border-t border-white/5 pt-4 space-y-4 mt-4">
                    
                    {checkoutStep === 'cart' && (
                      <>
                        {/* Custom Promo Code Applicator */}
                        <div className="bg-zinc-950 p-3 border border-white/5 space-y-2">
                          <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">PROMOTION SIGNATURE</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="CODE (e.g. STRIZ_KYRO_01)" 
                              value={promoCodeInput}
                              onChange={(e) => setPromoCodeInput(e.target.value)}
                              className="bg-zinc-900 border border-white/10 rounded-none px-2.5 py-1 text-[10px] text-white placeholder-zinc-700 focus:outline-none focus:border-white flex-grow font-mono uppercase"
                            />
                            <button 
                              onClick={handleApplyPromoCode}
                              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 px-3 py-1 text-[9px] font-mono uppercase tracking-widest font-bold cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                          {appliedPromo && (
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] text-emerald-400 font-mono uppercase">✓ {appliedPromo.code} ({appliedPromo.percent}% OFF) Active</p>
                              <button 
                                onClick={() => { onBtnClick(); setAppliedPromo(null); }}
                                className="text-[8px] text-zinc-500 hover:text-white uppercase font-mono underline"
                              >
                                [Remove]
                              </button>
                            </div>
                          )}
                          {promoError && (
                            <p className="text-[9px] text-red-400 font-mono uppercase">{promoError}</p>
                          )}
                        </div>

                        {(() => {
                          const rawSubtotal = getCartTotal();
                          const discountAmount = appliedPromo ? Math.round(rawSubtotal * appliedPromo.percent / 100) : 0;
                          const subtotal = rawSubtotal - discountAmount;
                          const shippingFee = subtotal >= 150 ? 0 : 20;
                          const totalVal = subtotal + shippingFee;

                          return (
                            <>
                              <div className="space-y-1.5 font-mono text-xs text-zinc-400 uppercase">
                                <div className="flex justify-between">
                                  <span>GARMENT SUBTOTAL</span>
                                  <span className="text-white font-bold">${rawSubtotal}</span>
                                </div>
                                {appliedPromo && (
                                  <div className="flex justify-between text-emerald-400">
                                    <span>PROMO DISCOUNT ({appliedPromo.percent}%)</span>
                                    <span>-${discountAmount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span>COURIER SHIPPING</span>
                                  <span>{subtotal >= 150 ? "FREE" : "$20"}</span>
                                </div>
                              </div>
                              
                              <hr className="border-white/5" />

                              <div className="flex justify-between font-mono text-sm uppercase text-white font-bold">
                                <span>TOTAL VALUE</span>
                                <span>${totalVal}</span>
                              </div>
                            </>
                          );
                        })()}

                        <button
                          onClick={() => { onBtnClick(); setCheckoutStep('details'); }}
                          className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors uppercase text-xs font-bold tracking-[0.2em]"
                        >
                          PROCEED TO CHECKOUT
                        </button>
                      </>
                    )}

                    {checkoutStep === 'details' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Step 1 of 2: Shipping</span>
                          <button 
                            onClick={() => setCheckoutStep('cart')} 
                            className="text-[9px] uppercase tracking-widest text-white underline"
                          >
                            Back
                          </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); onBtnClick(); setCheckoutStep('payment'); }} className="space-y-2.5 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="RECIPIENT FULL NAME"
                            value={shippingForm.fullName}
                            onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-2.5 text-white uppercase font-mono text-[10px]"
                          />
                          <input
                            type="email"
                            required
                            placeholder="EMAIL ADDRESS"
                            value={shippingForm.email}
                            onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-2.5 text-white font-mono text-[10px]"
                          />
                          <input
                            type="text"
                            required
                            placeholder="SHIPPING ADDRESS"
                            value={shippingForm.address}
                            onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-2.5 text-white uppercase font-mono text-[10px]"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="CITY"
                              value={shippingForm.city}
                              onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                              className="bg-zinc-900 border border-white/10 p-2.5 text-white uppercase font-mono text-[10px]"
                            />
                            <input
                              type="text"
                              required
                              placeholder="COUNTRY"
                              value={shippingForm.country}
                              onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                              className="bg-zinc-900 border border-white/10 p-2.5 text-white uppercase font-mono text-[10px]"
                            />
                          </div>
                          <input
                            type="text"
                            required
                            placeholder="PHONE NUMBER"
                            value={shippingForm.phone}
                            onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                            className="w-full bg-zinc-900 border border-white/10 p-2.5 text-white font-mono text-[10px]"
                          />
                          <button
                            type="submit"
                            className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 transition-colors uppercase text-xs font-bold tracking-[0.2em]"
                          >
                            CONTINUE TO PAYMENT
                          </button>
                        </form>
                      </div>
                    )}

                    {checkoutStep === 'payment' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Step 2 of 2: Payment Gateway</span>
                          <button 
                            onClick={() => setCheckoutStep('details')} 
                            className="text-[9px] uppercase tracking-widest text-white underline"
                          >
                            Back
                          </button>
                        </div>

                        {/* Payment method toggle options */}
                        <div className="space-y-2">
                          {[
                            { id: 'stripe', label: 'Credit Card / Stripe', desc: 'Secure direct transaction' },
                            { id: 'paypal', label: 'PayPal Gateway', desc: 'Complimentary currency routing' },
                            { id: 'khalti', label: 'Khalti Wallet', desc: 'Local Nepal direct pipeline' },
                            { id: 'esewa', label: 'eSewa Pay', desc: 'Integrated wallet transfer' },
                            { id: 'cod', label: 'Cash on Delivery', desc: 'Settle on packet receipt' }
                          ].map((pay) => (
                            <button
                              key={pay.id}
                              type="button"
                              onClick={() => { onBtnClick(); setPaymentMethod(pay.id as any); }}
                              className={`w-full text-left p-3 border rounded transition-colors flex items-center justify-between ${paymentMethod === pay.id ? 'bg-zinc-900 border-white text-white' : 'bg-transparent border-white/15 text-zinc-400 hover:border-white/40'}`}
                            >
                              <div>
                                <p className="text-xs uppercase tracking-widest font-bold">{pay.label}</p>
                                <p className="text-[9px] text-zinc-500 lowercase font-mono mt-0.5">{pay.desc}</p>
                              </div>
                              {paymentMethod === pay.id && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={handlePlaceOrder}
                          disabled={isPlacingOrder}
                          className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors uppercase text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2"
                        >
                          {isPlacingOrder ? "ROUTING TRANSACTION VALUE..." : "AUTHORIZE TRANSACTION & ORDER"}
                        </button>
                      </div>
                    )}

                    {checkoutStep === 'success' && lastPlacedOrder && (
                      <div className="space-y-4 text-center py-6">
                        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-400/20">
                          ✓
                        </div>
                        <h3 className="text-lg uppercase tracking-wider text-white">TRANSACTION SECURED</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">
                          Your order signature <span className="text-white font-mono font-bold">{lastPlacedOrder.id}</span> is successfully logged inside our shipping databases.
                        </p>
                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={() => { 
                              onBtnClick(); 
                              setIsCartOpen(false); 
                              setActiveTab('orders'); 
                              setCheckoutStep('cart');
                            }}
                            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white transition-colors uppercase text-xs tracking-widest font-bold"
                          >
                            Track Shipment Progress
                          </button>
                          <button
                            onClick={() => {
                              onBtnClick();
                              setIsCartOpen(false);
                              setCheckoutStep('cart');
                            }}
                            className="w-full py-3 bg-transparent hover:underline text-zinc-400 text-xs tracking-widest uppercase"
                          >
                            Dismiss Window
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Custom Premium Modal/Toast Overlay */}
      <AnimatePresence>
        {toast && toast.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#050505] border border-white/15 max-w-md w-full p-6 relative shadow-[8px_8px_0px_rgba(255,255,255,0.05)] rounded-none"
            >
              {/* Close Icon button */}
              <button 
                onClick={() => { onBtnClick(); setToast(null); }}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-5">
                <span className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase font-mono font-bold block">
                  ✦ {toast.title || "KYRO SPECIFICATION"} ✦
                </span>
                
                <p className="text-xs text-zinc-300 font-light leading-relaxed whitespace-pre-line font-sans">
                  {toast.message}
                </p>

                <div className="pt-2">
                  <button 
                    onClick={() => { onBtnClick(); setToast(null); }}
                    className="w-full py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors uppercase text-[10px] font-mono tracking-widest font-bold cursor-pointer"
                  >
                    DISMISS SPECIFICATION
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
