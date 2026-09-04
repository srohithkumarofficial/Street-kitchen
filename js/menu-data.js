// Street Kitchen - Curated Menu Database
const MENU_DATA = [
  {
    id: "sk-01",
    name: "Smoked Charcoal Chicken Shawarma",
    category: "shawarma",
    price: 180,
    rating: 4.9,
    reviews: 142,
    spicyLevel: 2,
    isVeg: false,
    badge: "Bestseller",
    description: "Slow-roasted marinated chicken shaved over rumali roti, layered with garlic toum, pickled gherkins, and smoked coal infusion.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80",
    tags: ["Signature", "Slow-Roasted", "Juicy"]
  },
  {
    id: "sk-02",
    name: "Truffle Cheese Loaded Shawarma Roll",
    category: "shawarma",
    price: 220,
    rating: 4.8,
    reviews: 98,
    spicyLevel: 1,
    isVeg: false,
    badge: "Chef Special",
    description: "Flame-grilled chicken chunks folded in melted mozzarella, truffle mayo drizzle, jalapenos, and crispy potato straws.",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80",
    tags: ["Cheesy", "Truffle", "Crispy"]
  },
  {
    id: "sk-03",
    name: "Fiery Peri-Peri Paneer Shawarma",
    category: "shawarma",
    price: 160,
    rating: 4.7,
    reviews: 84,
    spicyLevel: 3,
    isVeg: true,
    badge: "Spicy",
    description: "Cottage cheese cubes tossed in African birds-eye chili peri-peri glaze, house pickled peppers, and mint tahini.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Fiery", "Mint Tahini"]
  },
  {
    id: "sk-04",
    name: "Dragon Fire Grilled BBQ Wings",
    category: "grills",
    price: 240,
    rating: 4.9,
    reviews: 187,
    spicyLevel: 3,
    badge: "Must Try",
    isVeg: false,
    description: "8 pieces of juicy chicken wings charred on open live coals, glazed with honey-sriracha dragon fire sauce and toasted sesame.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80",
    tags: ["Smoky", "Live Charcoal", "Glazed"]
  },
  {
    id: "sk-05",
    name: "Afghan Malai Tikka Sizzler",
    category: "grills",
    price: 290,
    rating: 4.8,
    reviews: 110,
    spicyLevel: 1,
    isVeg: false,
    badge: "Creamy",
    description: "Tender boneless chicken steeped in cashew cream, green cardamom, and smoked butter, served sizzling with mint chutney.",
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    tags: ["Rich", "Cashew Cream", "Sizzling"]
  },
  {
    id: "sk-06",
    name: "Tandoori Stuffed Portobello Mushrooms",
    category: "grills",
    price: 230,
    rating: 4.6,
    reviews: 65,
    spicyLevel: 2,
    isVeg: true,
    badge: "New",
    description: "Plump portobello mushrooms stuffed with spiced herb-paneer crumble, roasted over earthen clay tandoor.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Clay Tandoor", "Stuffed"]
  },
  {
    id: "sk-07",
    name: "Midnight Beast Smash Burger",
    category: "burgers",
    price: 260,
    rating: 5.0,
    reviews: 215,
    spicyLevel: 2,
    isVeg: false,
    badge: "#1 Ranked",
    description: "Double smashed tender patties with crispy lacy edges, double aged cheddar, caramelized bourbon onions, and secret street sauce on brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    tags: ["Double Patty", "Brioche", "Smashed"]
  },
  {
    id: "sk-08",
    name: "Crispy Korean Fire Chicken Burger",
    category: "burgers",
    price: 240,
    rating: 4.9,
    reviews: 153,
    spicyLevel: 3,
    isVeg: false,
    badge: "Crunchy",
    description: "Buttermilk fried chicken thigh tossed in sweet-and-spicy Gochujang glaze, kimchi slaw, and toasted black sesame brioche.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    tags: ["Gochujang", "Kimchi Slaw", "Extra Crispy"]
  },
  {
    id: "sk-09",
    name: "Crispy Halloumi & Guacamole Stack",
    category: "burgers",
    price: 220,
    rating: 4.7,
    reviews: 79,
    spicyLevel: 1,
    isVeg: true,
    badge: "Veg Hit",
    description: "Golden griddled halloumi patty, house-made avocado guacamole, roasted red peppers, and arugula in charcoal brioche bun.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    tags: ["Vegetarian", "Guacamole", "Charcoal Bun"]
  },
  {
    id: "sk-10",
    name: "Szechuan Wok-Fired Hakka Noodles",
    category: "wok",
    price: 190,
    rating: 4.8,
    reviews: 168,
    spicyLevel: 2,
    isVeg: true,
    badge: "Wok Hei",
    description: "Tossed at 500°F with intense smoky wok hei, crisp scallions, bell peppers, pak choi, and artisan cracked szechuan peppercorns.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    tags: ["Wok Hei", "Smoky Scallions", "Street Style"]
  },
  {
    id: "sk-11",
    name: "Burnt Garlic Egg & Chicken Fried Rice",
    category: "wok",
    price: 230,
    rating: 4.9,
    reviews: 194,
    spicyLevel: 1,
    isVeg: false,
    badge: "Top Rated",
    description: "Long-grain jasmine rice wok-tossed with aromatic golden burnt garlic, shredded tender chicken, fluffy egg ribbons, and oriental herbs.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    tags: ["Jasmine Rice", "Burnt Garlic", "Aromatic"]
  },
  {
    id: "sk-12",
    name: "Chili Crispy Momos with Fire Dip",
    category: "wok",
    price: 170,
    rating: 4.8,
    reviews: 132,
    spicyLevel: 3,
    isVeg: false,
    badge: "Crispy",
    description: "Crispy pan-fried dumplings tossed in chili oil, crushed roasted peanuts, fried shallots, and spicy Tibetan dipping salsa.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    tags: ["Pan Fried", "Chili Oil", "Peanuts"]
  },
  {
    id: "sk-13",
    name: "Charcoal Black Velvet Shake",
    category: "drinks",
    price: 180,
    rating: 4.9,
    reviews: 120,
    spicyLevel: 0,
    isVeg: true,
    badge: "Aesthetic",
    description: "Activated edible charcoal blended with Belgian dark chocolate, Madagascar vanilla bean gelato, and topped with smoked gold dust.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    tags: ["Dark Choc", "Gold Dust", "Signature"]
  },
  {
    id: "sk-14",
    name: "Smoked Passionfruit & Chili Mojito",
    category: "drinks",
    price: 150,
    rating: 4.7,
    reviews: 88,
    spicyLevel: 1,
    isVeg: true,
    badge: "Refreshing",
    description: "Muddled fresh mint, zesty lime, exotic passionfruit nectar, infused with a hint of bird's eye chili and liquid applewood smoke.",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    tags: ["Passionfruit", "Smoked", "Chilled"]
  },
  {
    id: "sk-15",
    name: "Sizzling S'mores Brownie Skillet",
    category: "drinks",
    price: 210,
    rating: 5.0,
    reviews: 176,
    spicyLevel: 0,
    isVeg: true,
    badge: "Crowd Favorite",
    description: "Warm fudgy walnut brownie served on a cast-iron skillet, topped with toasted marshmallows, vanilla bean ice cream, and hot chocolate ganache.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    tags: ["Cast Iron", "Molten", "Marshmallow"]
  }
];

const RESTAURANT_INFO = {
  name: "Street Kitchen",
  tagline: "Dark Ambience • Fiery Grills • Gourmet Street Flavor",
  rating: 4.8,
  reviewCount: "1.2K+ Happy Foodies",
  coordinates: [13.1190411, 80.2260011],
  address: "Street Kitchen, 200 Feet Radial Road / Kolathur Main Rd, Chennai, Tamil Nadu 600099",
  phone: "+919876543210",
  whatsapp: "919876543210",
  timings: "Open Daily: 12:00 PM – 12:30 AM (Midnight Cravings)",
  googleMapsUrl: "https://www.google.com/maps/place/Street+Kitchen/@13.1190463,80.2234262,17z/data=!3m1!4b1!4m6!3m5!1s0x3a5264513bce7f41:0xc419b61d4429b09a!8m2!3d13.1190411!4d80.2260011!16s%2Fg%2F11g7zw7jft",
  features: [
    {
      title: "Live Open-Flame Kitchen",
      desc: "Watch our master chefs flame-grill and wok-toss your food over blazing 500°F natural lump charcoal.",
      icon: "flame"
    },
    {
      title: "Signature Secret Spices",
      desc: "Over 24 slow-roasted artisan spices crafted in-house for unparalleled depth, aroma, and savor.",
      icon: "sparkles"
    },
    {
      title: "Dark Mood Aesthetics",
      desc: "Designed with industrial obsidian textures, warm neon amber glows, and ambient lo-fi vibes for unforgettable dining.",
      icon: "moon"
    },
    {
      title: "Late Night Cravings",
      desc: "Serving Kolathur and North Chennai with blazing hot food deliveries until 12:30 AM every night.",
      icon: "clock"
    }
  ],
  testimonials: [
    {
      name: "Vigneshwaran R.",
      rating: 5,
      role: "Local Food Critic",
      comment: "The Smoked Charcoal Shawarma here is easily in the top 3 in entire Chennai! The smoky coal aroma penetrates the meat perfectly. The dark aesthetic vibe is next level.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Pooja Sundaram",
      rating: 5,
      role: "Chennai Foodie Club",
      comment: "Unreal Midnight Beast smash burger and sizzling momos. The ambience inside Street Kitchen makes it feel like an upscale underground Tokyo street diner.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Arun Karthik",
      rating: 5,
      role: "Regular Customer",
      comment: "Their quick WhatsApp order feature is super convenient. Hot delivery under 30 minutes in Kolathur and the packaging preserves the crispiness.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"
    }
  ]
};
