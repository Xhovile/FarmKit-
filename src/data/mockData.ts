import React from 'react';
import { Sprout, Book, Store, GraduationCap } from 'lucide-react';

export const marketCategories = [
  { id: 'grains', name: 'Grains & Cereals', nameNy: 'Zambewu' },
  { id: 'legumes', name: 'Legumes', nameNy: 'Nyemba' },
  { id: 'vegetables', name: 'Vegetables', nameNy: 'Masamba' },
  { id: 'fruits', name: 'Fruits', nameNy: 'Zipatso' },
  { id: 'livestock', name: 'Livestock', nameNy: 'Ziweto' },
  { id: 'inputs', name: 'Farm Inputs', nameNy: 'Zofunika pa Famu' },
];

export const deliveryMethods = [
  { id: 'pickup', name: 'Self Pickup', nameNy: 'Kutenga Nokha' },
  { id: 'seller_delivery', name: 'Seller Delivery', nameNy: 'Wogulitsa Adzipereka' },
  { id: 'third_party', name: 'Third-party Transport', nameNy: 'Mayendedwe a Ena' },
];

export const buyerRequests = [
  {
    id: 1,
    buyerName: "Malawi Grain Processors Ltd",
    commodity: "Soya Beans",
    quantity: "500",
    unit: "Metric Tons",
    location: "Lilongwe, Kanengo",
    priceRange: "MK 800 - MK 950 per kg",
    deliveryPreference: "Seller Delivery",
    contactMethod: "Phone/WhatsApp",
    phone: "265888000111",
    status: "Active"
  },
  {
    id: 2,
    buyerName: "Grace Mwale",
    commodity: "Hybrid Maize",
    quantity: "50",
    unit: "Bags (50kg)",
    location: "Blantyre, Limbe",
    priceRange: "MK 40,000 - MK 45,000 per bag",
    deliveryPreference: "Self Pickup",
    contactMethod: "WhatsApp",
    phone: "265999222333",
    status: "Active"
  }
];

export const marketplaceListings = [
  {
    id: 1,
    title: "Fresh Organic Maize",
    category: "grains",
    price: 45000,
    unit: "50kg Bag",
    stockStatus: "In Stock",
    quantity: 100,
    image: "https://picsum.photos/seed/maize/800/600",
    description: "High quality, sun-dried organic maize. Harvested last week. Available in 50kg bags.",
    deliveryMethod: "seller_delivery",
    seller: {
      id: "s1",
      name: "Chifundo Phiri",
      businessName: "Phiri Grain Supplies",
      avatar: "https://picsum.photos/seed/seller1/100/100",
      location: "Lilongwe, Area 25",
      phone: "265888123456",
      type: "Smallholder Farmer",
      verified: true
    }
  },
  {
    id: 2,
    title: "Red Kidney Beans",
    category: "legumes",
    price: 1200,
    unit: "kg",
    stockStatus: "Low Stock",
    quantity: 25,
    image: "https://picsum.photos/seed/beans/800/600",
    description: "Grade A red kidney beans. Very clean and well-sorted. Price per kg.",
    deliveryMethod: "pickup",
    seller: {
      id: "s2",
      name: "Grace Mwale",
      businessName: "Mwale Agro-Enterprises",
      avatar: "https://picsum.photos/seed/seller2/100/100",
      location: "Dedza Boma",
      phone: "265999654321",
      type: "Commercial Farmer",
      verified: false
    }
  },
  {
    id: 3,
    title: "Hybrid Tomato Seedlings",
    category: "inputs",
    price: 5000,
    unit: "Tray (50)",
    stockStatus: "In Stock",
    quantity: 500,
    image: "https://picsum.photos/seed/tomatoes/800/600",
    description: "Strong, disease-resistant tomato seedlings ready for transplanting. Tray of 50.",
    deliveryMethod: "third_party",
    seller: {
      id: "s3",
      name: "John Banda",
      businessName: "Banda Seedlings",
      avatar: "https://picsum.photos/seed/seller3/100/100",
      location: "Ntcheu",
      phone: "265881112233",
      type: "Nursery Specialist",
      verified: true
    }
  }
];

export const cropGuides = [
  {
    id: 'maize',
    name: "Maize (Chimanga)",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec (Rain-fed)",
    spacing: "75cm x 25cm (1 seed per station)",
    fertilizer: "Basal: 23:21:0+4S (at planting). Top: Urea (3-4 weeks after).",
    tips: "Keep field weed-free during the first 6 weeks."
  },
  {
    id: 'tobacco',
    name: "Tobacco (Fodya)",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Dec - Jan",
    spacing: "120cm x 60cm",
    fertilizer: "Basal: Compound D. Top: CAN or Nitrate of Soda.",
    tips: "Requires careful nursery management before transplanting."
  },
  {
    id: 'soya',
    name: "Soya Beans (Soya)",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "45cm x 5cm",
    fertilizer: "Inoculum (Rhizobium) at planting. Single Super Phosphate if needed.",
    tips: "Inoculation is key for high yields and nitrogen fixation."
  },
  {
    id: 'cotton',
    name: "Cotton (Thonje)",
    image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "60cm x 20cm",
    fertilizer: "Basal: Compound L. Boron application is often necessary.",
    tips: "Requires intensive pest management throughout the season."
  },
  {
    id: 'tomatoes',
    name: "Tomatoes (Mapichesi/Matimati)",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Year-round (Irrigation preferred)",
    spacing: "60cm x 45cm",
    fertilizer: "Basal: Compound S. Top: CAN at flowering.",
    tips: "Staking helps prevent fruit rot and diseases."
  },
  {
    id: 'groundnuts',
    name: "Groundnuts (Mtedza)",
    image: "https://images.unsplash.com/photo-1563636619-e9107b1c196e?auto=format&fit=crop&q=80&w=800",
    plantingDates: "Nov - Dec",
    spacing: "30cm x 15cm",
    fertilizer: "Gypsum (Calcium Sulfate) at flowering for pod filling.",
    tips: "Earth up plants to encourage more pods."
  }
];

export const pestsData = [
  {
    id: 'fall-armyworm',
    name: "Fall Armyworm",
    symptoms: "Holes in leaves, sawdust-like droppings in the whorl.",
    organicControl: "Neem oil spray, hand-picking, or putting sand/ash in the whorl.",
    chemicalControl: "Cypermethrin or Belt (Flubendiamide).",
    image: "https://images.unsplash.com/photo-1502622645662-320b7671aa42?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'aphids',
    name: "Aphids",
    symptoms: "Curled leaves, sticky honeydew, stunted growth.",
    organicControl: "Strong water spray, soap water solution, or garlic spray.",
    chemicalControl: "Imidacloprid or Dimethoate.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'tuta-absoluta',
    name: "Tomato Leaf Miner (Tuta)",
    symptoms: "Blotches on leaves, tunnels in stems and fruits.",
    organicControl: "Pheromone traps, removing infested leaves.",
    chemicalControl: "Spinosad or Coragen.",
    image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&q=80&w=800"
  }
];

export const organicFertilizerGuides = [
  {
    id: 'compost',
    name: "Compost Manure (Manyowa a Khola)",
    steps: [
      "Select a shaded site.",
      "Layer 1: Dry stalks/grass (15cm).",
      "Layer 2: Green leaves/waste (15cm).",
      "Layer 3: Animal manure (5cm).",
      "Layer 4: Topsoil (2cm).",
      "Water each layer and repeat until 1.5m high.",
      "Turn every 3-4 weeks. Ready in 3 months."
    ],
    benefits: "Improves soil structure and water retention."
  },
  {
    id: 'liquid-manure',
    name: "Liquid Manure (Manyowa a Madzi)",
    steps: [
      "Fill a sack with 10kg of fresh animal manure.",
      "Suspend the sack in a 50L drum of water.",
      "Cover and let it ferment for 14 days.",
      "Dilute 1 part manure to 3 parts water before applying.",
      "Apply directly to the base of plants.",
    ],
    benefits: "Fast-acting nutrient boost for growing crops."
  }
];

export const marketPricesData = [
  { commodity: 'Maize (Chimanga)', limbe: 850, lilongwe: 800, mzuzu: 750, unit: 'kg' },
  { commodity: 'Beans (Nyemba)', limbe: 1500, lilongwe: 1400, mzuzu: 1300, unit: 'kg' },
  { commodity: 'Rice (Mpunga)', limbe: 1800, lilongwe: 1750, mzuzu: 1700, unit: 'kg' },
  { commodity: 'Soya Beans', limbe: 900, lilongwe: 850, mzuzu: 800, unit: 'kg' },
];

export const priceTrendData = [
  { month: 'Jan', maize: 600, beans: 1200, rice: 1500 },
  { month: 'Feb', maize: 650, beans: 1250, rice: 1550 },
  { month: 'Mar', maize: 750, beans: 1300, rice: 1600 },
  { month: 'Apr', maize: 800, beans: 1400, rice: 1700 },
  { month: 'May', maize: 850, beans: 1500, rice: 1800 },
];

export const livestockGuides = [
  {
    id: 'poultry',
    name: "Poultry (Nkhuku)",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=800",
    housing: "Well-ventilated house with 1sqm per 5-7 birds.",
    feeding: "Starter mash (0-4 weeks), Grower mash (4-8 weeks), Layer/Broiler mash (8+ weeks).",
    health: "Vaccinate against Newcastle, Gumboro, and Fowl Pox.",
    tips: "Provide clean water at all times and maintain high hygiene."
  },
  {
    id: 'goats',
    name: "Goats (Mbuzi)",
    image: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&q=80&w=800",
    housing: "Raised floor house to keep them dry and clean.",
    feeding: "Browsing/grazing plus supplementary salt licks and legumes.",
    health: "Deworm every 3 months. Watch for foot rot during rainy season.",
    tips: "Boer crossbreeds grow faster and produce more meat."
  },
  {
    id: 'pigs',
    name: "Pigs (Nkhumba)",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800",
    housing: "Concrete floor with good drainage and separate sleeping/feeding areas.",
    feeding: "Pig starter, weaner, and finisher meal. Can supplement with kitchen waste (boiled).",
    health: "Protect from African Swine Fever by restricting visitors and maintaining biosecurity.",
    tips: "Pigs need plenty of shade and water to stay cool."
  }
];

export const performingMarkets = [
  {
    id: 1,
    name: "Limbe Market",
    location: "Blantyre",
    status: "High Demand",
    statusNy: "Zofunika Kwambiri",
    topCommodities: ["Maize", "Beans", "Rice"],
    trend: "Upward",
    description: "Currently the best market for grain sellers in the Southern Region."
  },
  {
    id: 2,
    name: "Tsangano Market",
    location: "Ntcheu",
    status: "Performing",
    statusNy: "Zikuyenda Bwino",
    topCommodities: ["Irish Potatoes", "Cabbage", "Onions"],
    trend: "Stable",
    description: "The hub for horticultural products. Prices are stable this week."
  },
  {
    id: 3,
    name: "Mzuzu Central Market",
    location: "Mzuzu",
    status: "High Demand",
    statusNy: "Zofunika Kwambiri",
    topCommodities: ["Soya Beans", "Groundnuts"],
    trend: "Upward",
    description: "High demand for legumes due to export processing activities."
  }
];

export const verifiedTraining = [
  {
    id: 1,
    title: "Climate-Smart Agriculture",
    provider: "Ministry of Agriculture",
    duration: "4 Weeks (Online/Field)",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
    description: "Learn techniques to maintain yields despite changing weather patterns.",
    link: "#"
  },
  {
    id: 2,
    title: "Agribusiness Management",
    provider: "LUANAR",
    duration: "6 Weeks (Online)",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=800",
    description: "Transform your farm into a profitable business with proper records and planning.",
    link: "#"
  },
  {
    id: 3,
    title: "Organic Certification",
    provider: "Malawi Organic Growers Association",
    duration: "2 Weeks (Field)",
    image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=800",
    description: "Step-by-step guide to getting your farm certified for premium markets.",
    link: "#"
  }
];

export const seasonalAlerts = [
  {
    id: 1,
    type: "Weather",
    title: "Early Rains Expected",
    titleNy: "Mvula Yoyambirira Ikuyembekezeka",
    severity: "High",
    content: "Meteorological department predicts rains starting mid-November. Prepare your fields now.",
    contentNy: "Dipatimenti ya zanyengo ikuneneratu kuti mvula iyamba pakati pa mwezi wa November. Konzani minda yanu tsopano.",
    date: "Nov 10, 2025"
  },
  {
    id: 2,
    type: "Pest",
    title: "Fall Armyworm Outbreak",
    titleNy: "Kuphulika kwa Chiwombankhanga",
    severity: "Critical",
    content: "Reports of FAW in Salima and Dedza. Scout your maize fields daily.",
    contentNy: "Pali malipoti a chiwombankhanga ku Salima ndi Dedza. Yang'anirani minda yanu ya chimanga tsiku lililonse.",
    date: "Nov 12, 2025"
  },
  {
    id: 3,
    type: "Market",
    title: "Maize Price Inflation",
    titleNy: "Kukwera kwa Mtengo wa Chimanga",
    severity: "Medium",
    content: "Maize prices have risen by 15% in Limbe. Consider selling now if you have surplus.",
    contentNy: "Mitengo ya chimanga yakwera ndi 15% ku Limbe. Ganizirani zogulitsa tsopano ngati muli ndi zotsala.",
    date: "Nov 14, 2025"
  }
];

export const tourSteps = [
  {
    title: "Welcome to FarmKit!",
    titleNy: "Takulandirani ku FarmKit!",
    content: "Your all-in-one digital companion for modern farming in Malawi.",
    contentNy: "Mnzanu wapamtima pa ulimi wamakono m'Malawi muno.",
    icon: Sprout,
    color: "bg-primary"
  },
  {
    title: "Farming Info",
    titleNy: "Zidziwitso za Ulimi",
    content: "Get expert guides on crops, pests, and organic fertilizers.",
    contentNy: "Pezani malangizo a akatswiri pa mbewu, tizilombo, ndi manyowa.",
    icon: Book,
    color: "bg-emerald-500"
  },
  {
    title: "Marketplace",
    titleNy: "Msika",
    content: "Check daily market prices and list your produce for sale.",
    contentNy: "Onani mitengo ya tsiku ndi tsiku ndipo gulitsani zokolola zanu.",
    icon: Store,
    color: "bg-amber-500"
  },
  {
    title: "Expert Knowledge",
    titleNy: "Akatswiri",
    content: "Access curated guides and verified training from NGOs and experts.",
    contentNy: "Pezani malangizo a akatswiri ndi maphunziro kuchokera ku mabungwe.",
    icon: GraduationCap,
    color: "bg-indigo-500"
  }
];

export const experts = [
  {
    id: 1,
    name: "Dr. Kondwani Mwale",
    specialty: "Soil Science & Fertilizers",
    specialtyNy: "Sayansi ya Nthaka ndi Manyowa",
    location: "Lilongwe (NRC)",
    phone: "+265 888 123 456",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100",
    verified: true
  },
  {
    id: 2,
    name: "Agness Banda",
    specialty: "Pest Control & Crop Protection",
    specialtyNy: "Kupewa Tizilombo ndi Kuteteza Mbewu",
    location: "Blantyre (Bvumbwe)",
    phone: "+265 999 654 321",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100",
    verified: true
  },
  {
    id: 3,
    name: "Isaac Tembo",
    specialty: "Livestock Management",
    specialtyNy: "Kasungidwe ka Ziweto",
    location: "Mzuzu (Lunyangwa)",
    phone: "+265 881 789 012",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    verified: true
  }
];

export const successStories = [
  {
    id: 1,
    author: "Banda Family Farm",
    title: "From 10 Bags to 50 Bags!",
    titleNy: "Kuchokera pa Matumba 10 kufika pa 50!",
    content: "Verified Case Study: By following the organic fertilizer guides on FarmKit, the Banda family tripled their harvest this year without buying expensive chemicals.",
    contentNy: "Umboni: Potsatira malangizo a manyowa achilengedwe pa FarmKit, banja la a Banda linachulukitsa zokolola zawo katsatu chaka chino popanda kugula mankhwala okwera mtengo.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400",
    likes: 142
  }
];
