import { Product, Review } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "kr-01",
    name: "Heavy Loopback Hoodie",
    price: 180,
    description: "Constructed from ultra-heavyweight 500gsm custom-milled organic cotton loopback. Designed with an oversized boxy silhouette, drop shoulders, double-layered hood without drawcords, and thick ribbed cuffs for a structural drape.",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Off-White", "Onyx Black", "Deep Slate"],
    stock: 24,
    rating: 4.9,
    reviewsCount: 142,
    features: [
      "500gsm 100% organic cotton loopback",
      "Custom pre-shrunk combed yarn",
      "Kangaroo pocket with bar-tack reinforcement",
      "Double-lined hood with zero hardware",
      "Made in Portugal"
    ],
    isFeatured: true,
    isNew: false
  },
  {
    id: "kr-02",
    name: "Modular Cargo Pant",
    price: 210,
    description: "Crafted from structural high-density Japanese nylon-cotton ripstop. Features custom articulated knee panelling, adjustable toggles at the leg opening for modular styling, and deep double-entry utility cargo pockets.",
    category: "Trousers",
    images: [
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive Green", "Onyx Black", "Stone Gray"],
    stock: 18,
    rating: 4.8,
    reviewsCount: 89,
    features: [
      "Water-repellent resin finish",
      "Knee articulation darting",
      "Modular drawcords at waist and ankle hem",
      "Matte-black metal hardware",
      "Italian Cobrax snaps"
    ],
    isFeatured: true,
    isNew: true
  },
  {
    id: "kr-03",
    name: "Atmosphere Graphic Tee",
    price: 90,
    description: "A luxury heavy-combed cotton jersey tee featuring a high-definition tonal print of alpine landscapes on the back, and the minimalist KYRO logo subtle on the front chest. Pre-shrunk with a vintage wash treatment.",
    category: "T-Shirts",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Onyx Black"],
    stock: 45,
    rating: 4.7,
    reviewsCount: 54,
    features: [
      "280gsm long-staple combed cotton",
      "Thick rib collar with shape retention coverstitching",
      "Silkscreen water-base print backing",
      "Hand-washed with mineral enzymes for softness",
      "Slightly drop shoulder visual fit"
    ],
    isFeatured: false,
    isNew: true
  },
  {
    id: "kr-04",
    name: "Technical Shell Jacket",
    price: 380,
    description: "A highly engineered technical mountain shell featuring 3-layer laminated waterproof-breathable membranes. Fully taped interior seams, custom water-guard aqua zippers, and structured brimmed adjustable hood.",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Slate", "Stone Gray"],
    stock: 12,
    rating: 4.9,
    reviewsCount: 31,
    features: [
      "3-Layer laminated nylon shell",
      "20,000mm hydrostatic head waterproof rating",
      "YKK AquaGuard sealed main and pocket zippers",
      "Underarm laser-cut ventilation ports",
      "Cohaesive integrated hood cord-lock adjusters"
    ],
    isFeatured: true,
    isNew: true
  },
  {
    id: "kr-05",
    name: "Acetate D-Frame Sunglasses",
    price: 150,
    description: "Crafted in partnership with master eyewear artisans. Made from premium bio-based Italian cellulose acetate, featuring hand-polished D-frames, sturdy 5-barrel hinges, and 100% UVA/UVB Carl Zeiss green lenses.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["One Size"],
    colors: ["Gloss Black", "Dark Tortoise", "Crystal Olive"],
    stock: 30,
    rating: 4.8,
    reviewsCount: 76,
    features: [
      "Premium Italian Mazzucchelli acetate",
      "Zeiss CR-39 lenses for optical clarity",
      "Dual core-wire engraved metal temple cores",
      "Custom leather storage case with velvet lining",
      "Anti-reflective interior coating"
    ],
    isFeatured: false,
    isNew: false
  },
  {
    id: "kr-06",
    name: "Luxury Modular Vest",
    price: 165,
    description: "A lightweight, water-resistant modular vest featuring functional utility pockets and high-density webbing detail. Ideal layering piece designed to be worn over heavy hoodies or graphic tees.",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["S", "M", "L"],
    colors: ["Onyx Black", "Olive Green"],
    stock: 15,
    rating: 4.6,
    reviewsCount: 22,
    features: [
      "Ripstop nylon construction with DWR finish",
      "Fidlock magnetic utility chest buckle",
      "Multiple interior zip compartments",
      "Double slider front YKK zipper closure",
      "Contrast mesh back venting"
    ],
    isFeatured: false,
    isNew: true
  },
  {
    id: "kr-07",
    name: "Luxury Beanie",
    price: 55,
    description: "Knit from extra-fine merino wool for optimal warmth and soft touch. Features a classic thick double-fold cuff with our signature minimal embroidered KYRO label.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["One Size"],
    colors: ["Stone Gray", "Cream", "Onyx Black"],
    stock: 50,
    rating: 4.9,
    reviewsCount: 110,
    features: [
      "100% Extra-fine Australian Merino Wool",
      "Four-way crown structure knit",
      "Highly breathable yet temperature regulating",
      "Reinforced double rib cuff construction"
    ],
    isFeatured: false,
    isNew: false
  },
  {
    id: "kr-08",
    name: "Asymmetrical Tech Parka",
    price: 420,
    description: "Constructed from 3-layer weatherproof membrane with asymmetrical dual-zip opening, fully taped ergonomic seams, and high-visibility internal straps. A masterclass in modern utilitarian tailoring.",
    category: "Outerwear",
    images: [
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Onyx Black", "Olive Drab"],
    stock: 10,
    rating: 5.0,
    reviewsCount: 18,
    features: [
      "3-layer seam-sealed membrane",
      "Asymmetrical dual YKK storm zippers",
      "Internal backpack carry-straps",
      "Adjustable magnetic cuff straps",
      "Reinforced articulation joints"
    ],
    isFeatured: true,
    isNew: true
  },
  {
    id: "kr-09",
    name: "Premium Distressed Knitwear",
    price: 240,
    description: "Spun from a heavy organic cotton and alpaca wool blend. Features hand-distressed edge wear along the hem and collar, an oversized chunky drop-shoulder fit, and custom waffle knit density panels.",
    category: "Knitwear",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Oatmeal", "Ashen Grey", "Onyx Black"],
    stock: 14,
    rating: 4.9,
    reviewsCount: 34,
    features: [
      "70% Organic Cotton, 30% Alpaca Wool",
      "Hand-frayed distressing throughout",
      "Varying gauge waffle stitch details",
      "Oversized chunky rib mock collar",
      "Made in Japan"
    ],
    isFeatured: true,
    isNew: true
  },
  {
    id: "kr-10",
    name: "Industrial Webbing Belt",
    price: 75,
    description: "Heavy-duty seatbelt-weave nylon belt featuring an authentic military Cobra quick-release buckle, laser-engraved KYRO monogram logo, and reinforced leather end tip.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["One Size"],
    colors: ["Onyx Black", "Safety Orange", "Coyote Tan"],
    stock: 40,
    rating: 4.8,
    reviewsCount: 65,
    features: [
      "High-density ballistic nylon webbing",
      "Custom metal cobra buckle mechanism",
      "Fully adjustable up to 44 inches",
      "Anodized matte black metal finish",
      "Laser-etched monogram serial number"
    ],
    isFeatured: false,
    isNew: true
  },
  {
    id: "kr-11",
    name: "Kyro Combat Boot",
    price: 320,
    description: "Engineered with a premium Italian calfskin leather upper and a vulcanized high-traction rubber lug sole. Features metal speed-lacing hardware, a padded collar, and custom debossed serial monogram.",
    category: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["Onyx Black", "Ashen Grey"],
    stock: 15,
    rating: 4.9,
    reviewsCount: 78,
    features: [
      "Premium Italian calfskin leather",
      "Vibram high-traction rubber lug sole",
      "Waxed cotton speed laces",
      "Reinforced double-stitched welt",
      "Cushioned memory-foam insole"
    ],
    isFeatured: true,
    isNew: true
  },
  {
    id: "kr-12",
    name: "Balaclava Ribbed Mask",
    price: 65,
    description: "Designed for cold-weather utility and modern street silhouette enhancement. Knit from a warm merino wool-blend with rib-knit pattern, secure eye-slit opening, and raw hem detailing.",
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=800"
    ],
    sizes: ["One Size"],
    colors: ["Onyx Black", "Olive Drab", "Deep Slate"],
    stock: 22,
    rating: 4.7,
    reviewsCount: 29,
    features: [
      "Merino wool blend rib-knit",
      "Anti-pill finish with high stretch shape recovery",
      "Reinforced laser-cut eye slit edges",
      "Double-layered thermal crown",
      "Extended length neck gaiter drape"
    ],
    isFeatured: false,
    isNew: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "kr-01",
    author: "Marc A.",
    rating: 5,
    comment: "The weight on this hoodie is incredible. The drape is rigid and structural, exactly like Fear of God and Balenciaga. Definitely worth every dollar.",
    createdAt: "2026-06-15"
  },
  {
    id: "rev-2",
    productId: "kr-01",
    author: "Elena R.",
    rating: 5,
    comment: "Unmatched quality. The fabric has a premium stiffness that softens perfectly after wash but holds its structured box shape. Perfect beige color.",
    createdAt: "2026-06-20"
  },
  {
    id: "rev-3",
    productId: "kr-02",
    author: "Tyler K.",
    rating: 4,
    comment: "Super technical cargo pants. Love the adjustable cuff toggles. I am 6'0 and size 32 fits slightly baggier but has a beautiful relaxed silhouette.",
    createdAt: "2026-06-22"
  },
  {
    id: "rev-4",
    productId: "kr-03",
    author: "Ji-Woo S.",
    rating: 5,
    comment: "Beautiful graphic print. It feels fused into the cotton rather than a cheap plastic transfer. The collar is nice and tight, won't stretch out.",
    createdAt: "2026-06-28"
  }
];

export const INSTAGRAM_POSTS = [
  { id: "ig-1", imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400", likes: "1.2k" },
  { id: "ig-2", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400", likes: "2.4k" },
  { id: "ig-3", imageUrl: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=400", likes: "984" },
  { id: "ig-4", imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400", likes: "3.1k" },
  { id: "ig-5", imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400", likes: "1.5k" },
  { id: "ig-6", imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400", likes: "2.0k" }
];

export const LOOKBOOK_IMAGES = [
  {
    id: "lb-1",
    title: "Muted Horizon",
    tagline: "Vol. 1 - Essential Layering",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200",
    description: "An exploration of heavy luxury loopback textures set against a brutalist backdrop. Showcasing structural boxy drapes in off-white and deep onyx shades."
  },
  {
    id: "lb-2",
    title: "Articulated Alpine",
    tagline: "Vol. 2 - Technical Adaptability",
    imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=1200",
    description: "Bridging the gap between wilderness extreme performance and premium high-street editorial aesthetic. Water-repellent properties, toggle hems, and engineered utility."
  },
  {
    id: "lb-3",
    title: "Monochrome Tokyo",
    tagline: "Vol. 3 - Avant-Garde Silhouettes",
    imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=1200",
    description: "Deep shadows, sharp angles, and raw industrial aesthetics. Tokyo-inspired street styling with modular cargo pants and asymmetrical heavy outer shell systems."
  },
  {
    id: "lb-4",
    title: "Ashen Brutalism",
    tagline: "Vol. 4 - Textured Heavy Knits",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1200",
    description: "Chunky textures colliding with architectural concrete blocks. Spotlighting hand-distressed organic alpaca knitwear and heavy-duty industrial utility belts."
  }
];

export const TESTIMONIALS = [
  {
    quote: "KYRO represents the pinnacle of premium streetwear. The garment weight, the double-lined hoods with zero hardware, the architectural drapes—this is true master-class luxury design.",
    author: "Garrison V.",
    role: "Creative Director, ARCH_Studio"
  },
  {
    quote: "Aime Leon Dore and Fear of God have serious competition. The Modular Cargo pants hold their silhouette flawlessly, adjusting modularly from wide-straight to a clean jogger taper in seconds.",
    author: "René M.",
    role: "Senior Fashion Buyer"
  }
];
