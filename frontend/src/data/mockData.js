export const tileImages = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1615873968403-89e068629265?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1629079447777-1e605162dc8d?w=400&h=300&fit=crop",
]

const NAMES = [
  "Marble Luxe","Terrazzo Classic","Granite Peak","Onyx Shadow","Sandstone Drift",
  "Ivory Gloss","Cobalt Matte","Emerald Slate","Rose Quartz","Charcoal Edge",
  "Arctic White","Sahara Beige","Midnight Black","Forest Green","Ocean Blue",
  "Burnt Sienna","Pearl Cream","Copper Bronze","Lavender Mist","Golden Hour",
]
const SHOPS = ["LuxeTile Co.","StoneWorks","TileWorld","GraniteKing","MarbleMasters","CeramicHub","TileElite","StoneCraft","PremiumTiles","RoyalStone"]
const SIZES = ["600×600mm","800×800mm","300×600mm","1200×600mm","600×1200mm"]
const MATS  = ["Ceramic","Vitrified","Porcelain","Natural Stone","Marble"]
const CATS  = ["Floor","Wall","Outdoor","Bathroom"]

export const productsData = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  shop: SHOPS[i % 10],
  price: (50 + (i * 17.3) % 200).toFixed(2),
  wholesalePrice: (30 + (i * 11.7) % 150).toFixed(2),
  size: SIZES[i % 5],
  material: MATS[i % 5],
  rating: (3 + (i % 5) * 0.4).toFixed(1),
  reviews: 20 + (i * 13) % 200,
  description: "Premium quality tiles with superior finish, ideal for flooring and wall applications in residential and commercial spaces.",
  inStock: i % 5 !== 3,
  image: tileImages[i % tileImages.length],
  category: CATS[i % 4],
}))

const CUSTOMERS = ["Rajan Builders","Priya Interiors","Metro Constructions","Sunrise Homes","Green Valley Corp"]
const CITIES    = ["Mumbai","Delhi","Chennai","Bangalore","Hyderabad"]
const METHODS   = ["Cash","UPI","Card","Online"]
const STATUSES  = ["Completed","Processing","Cancelled","Completed","Completed"]

const rawSales = Array.from({ length: 15 }, (_, i) => ({
  id: `ORD-${1000 + i}`,
  customer: CUSTOMERS[i % 5],
  phone: `+91 98${String(10000000 + i * 1234567).slice(0,8)}`,
  email: `customer${i + 1}@email.com`,
  address: CITIES[i % 5],
  product: productsData[i % 20].name,
  productImage: tileImages[i % tileImages.length],
  brand: "RoyalEdge",
  size: SIZES[i % 3],
  qty: 10 + (i * 7) % 100,
  pricePerUnit: (50 + (i * 13.3) % 100).toFixed(2),
  discount: [5,10,0,15,0][i % 5],
  tax: 18,
  paymentMethod: METHODS[i % 4],
  paymentStatus: i % 4 === 2 ? "Pending" : "Paid",
  orderDate: `2024-${String(Math.floor(i / 2) + 1).padStart(2,"0")}-${String((i * 3 % 28) + 1).padStart(2,"0")}`,
  orderStatus: STATUSES[i % 5],
}))

export const salesData = rawSales.map(s => {
  const sub  = s.qty * parseFloat(s.pricePerUnit)
  const disc = sub * s.discount / 100
  const afterDisc = sub - disc
  const taxAmt = afterDisc * s.tax / 100
  return {
    ...s,
    subtotal:    sub.toFixed(2),
    discountAmt: disc.toFixed(2),
    taxAmt:      taxAmt.toFixed(2),
    totalAmt:    (afterDisc + taxAmt).toFixed(2),
  }
})

export const customersData = [
  "Arun Kumar","Priya Sharma","Rajan Patel","Sunita Mehta","Vikram Singh",
  "Ananya Rao","Deepak Nair","Kavita Joshi","Suresh Reddy","Meena Iyer","Rahul Das","Pooja Gupta",
].map((name, i) => ({
  id: `CUST-${100 + i}`,
  name,
  phone: `+91 9${String(100000000 + i * 98765432).slice(0,9)}`,
  email: `user${i + 1}@example.com`,
  address: ["Mumbai, MH","Delhi, DL","Chennai, TN","Bangalore, KA","Hyderabad, TS"][i % 5],
  orders: 1 + (i * 3) % 20,
  totalPurchase: (5000 + (i * 4321) % 50000).toFixed(2),
}))

export const usersData = [
  { id:"USR-001", name:"Admin User",   email:"admin@royaledge.com",  role:"Admin",         phone:"+91 9876543210", status:"Active" },
  { id:"USR-002", name:"Rajesh Menon", email:"rajesh@royaledge.com", role:"Sales Manager", phone:"+91 9876543211", status:"Active" },
  { id:"USR-003", name:"Sneha Pillai", email:"sneha@royaledge.com",  role:"Staff",         phone:"+91 9876543212", status:"Active" },
  { id:"USR-004", name:"Kiran Babu",   email:"kiran@royaledge.com",  role:"Staff",         phone:"+91 9876543213", status:"Inactive" },
  { id:"USR-005", name:"Divya Nair",   email:"divya@royaledge.com",  role:"Sales Manager", phone:"+91 9876543214", status:"Active" },
]

export const monthlySalesChart = [
  { month:"Jan", sales:42000, orders:34 },
  { month:"Feb", sales:58000, orders:45 },
  { month:"Mar", sales:51000, orders:38 },
  { month:"Apr", sales:73000, orders:56 },
  { month:"May", sales:89000, orders:67 },
  { month:"Jun", sales:96000, orders:74 },
  { month:"Jul", sales:78000, orders:60 },
  { month:"Aug", sales:110000, orders:82 },
  { month:"Sep", sales:95000, orders:71 },
  { month:"Oct", sales:120000, orders:91 },
  { month:"Nov", sales:105000, orders:78 },
  { month:"Dec", sales:140000, orders:105 },
]

export const topSellingProducts = [
  { name:"Marble Luxe",      sales:320, value:64000 },
  { name:"Granite Peak",     sales:280, value:56000 },
  { name:"Onyx Shadow",      sales:210, value:42000 },
  { name:"Terrazzo Classic", sales:190, value:38000 },
  { name:"Ivory Gloss",      sales:160, value:32000 },
]

export const PIE_COLORS = ["#D4A853","#C8965E","#B8845A","#A8724D","#987040"]
