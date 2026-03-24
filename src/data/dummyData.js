// Dummy data for the entire application

export const inventoryItems = [
  { id: 1,  name: 'PP U-CUPS',          supplier: 'Manila Plastics Co.',  size: '12oz', stock: 4800, status: 'In Stock',  orders: 88,  revenue: '₱42,000' },
  { id: 2,  name: 'PP U-CUPS',          supplier: 'PhilPack Industries',  size: '16oz', stock: 3200, status: 'In Stock',  orders: 45,  revenue: '₱28,000' },
  { id: 3,  name: 'PP U-CUPS',          supplier: 'CupMaster Supply',     size: '22oz', stock: 1750, status: 'In Stock',  orders: 23,  revenue: '₱14,500' },
  { id: 4,  name: 'PP Y-CUPS',          supplier: 'ProPack PH',           size: '12oz', stock: 6100, status: 'In Stock',  orders: 67,  revenue: '₱35,000' },
  { id: 5,  name: 'PP Y-CUPS',          supplier: 'Manila Plastics Co.',  size: '16oz', stock: 2900, status: 'In Stock',  orders: 34,  revenue: '₱19,000' },
  { id: 6,  name: 'PP Y-CUPS',          supplier: 'PhilPack Industries',  size: '22oz', stock: 420,  status: 'Low Stock', orders: 12,  revenue: '₱8,400'  },
  { id: 7,  name: 'SLIM CUPS',          supplier: 'CupMaster Supply',     size: '16oz', stock: 5500, status: 'In Stock',  orders: 56,  revenue: '₱63,000' },
  { id: 8,  name: 'SLIM CUPS',          supplier: 'ProPack PH',           size: '22oz', stock: 3800, status: 'In Stock',  orders: 29,  revenue: '₱37,000' },
  { id: 9,  name: 'PET CUPS',           supplier: 'Manila Plastics Co.',  size: '12oz', stock: 280,  status: 'Low Stock', orders: 8,   revenue: '₱9,600'  },
  { id: 10, name: 'PET CUPS',           supplier: 'PhilPack Industries',  size: '16oz', stock: 7200, status: 'In Stock',  orders: 92,  revenue: '₱78,000' },
  { id: 11, name: 'PET CUPS',           supplier: 'CupMaster Supply',     size: '18oz', stock: 4100, status: 'In Stock',  orders: 41,  revenue: '₱31,000' },
  { id: 12, name: 'PET CUPS',           supplier: 'ProPack PH',           size: '22oz', stock: 1500, status: 'In Stock',  orders: 18,  revenue: '₱13,000' },
  { id: 13, name: 'PET U-CUPS',         supplier: 'Manila Plastics Co.',  size: '12oz', stock: 6800, status: 'In Stock',  orders: 73,  revenue: '₱55,000' },
  { id: 14, name: 'PET U-CUPS',         supplier: 'PhilPack Industries',  size: '14oz', stock: 3300, status: 'In Stock',  orders: 37,  revenue: '₱24,000' },
  { id: 15, name: 'PET U-CUPS',         supplier: 'CupMaster Supply',     size: '18oz', stock: 2100, status: 'In Stock',  orders: 15,  revenue: '₱11,500' },
  { id: 16, name: 'PET U-CUPS',         supplier: 'ProPack PH',           size: '22oz', stock: 4700, status: 'In Stock',  orders: 61,  revenue: '₱62,000' },
  { id: 17, name: 'HARD CUPS',          supplier: 'Manila Plastics Co.',  size: '16oz', stock: 390,  status: 'Low Stock', orders: 9,   revenue: '₱18,000' },
  { id: 18, name: 'HARD CUPS',          supplier: 'PhilPack Industries',  size: '22oz', stock: 8000, status: 'In Stock',  orders: 84,  revenue: '₱71,000' },
  { id: 19, name: 'HARD CUPS',          supplier: 'CupMaster Supply',     size: '1L',   stock: 2600, status: 'In Stock',  orders: 27,  revenue: '₱16,000' },
  { id: 20, name: 'SINGLE WALL PAPER',  supplier: 'ProPack PH',           size: '3oz',  stock: 3900, status: 'In Stock',  orders: 49,  revenue: '₱27,000' },
  { id: 21, name: 'SINGLE WALL PAPER',  supplier: 'Manila Plastics Co.',  size: '4oz',  stock: 1100, status: 'In Stock',  orders: 16,  revenue: '₱12,000' },
  { id: 22, name: 'DOUBLE WALL WHITE',  supplier: 'PhilPack Industries',  size: '8oz',  stock: 4300, status: 'In Stock',  orders: 53,  revenue: '₱44,000' },
  { id: 23, name: 'DOUBLE WALL WHITE',  supplier: 'CupMaster Supply',     size: '12oz', stock: 7600, status: 'In Stock',  orders: 78,  revenue: '₱59,000' },
  { id: 24, name: 'DOUBLE WALL WHITE',  supplier: 'ProPack PH',           size: '16oz', stock: 2800, status: 'In Stock',  orders: 32,  revenue: '₱23,000' },
  { id: 25, name: 'DOUBLE WALL BROWN',  supplier: 'Manila Plastics Co.',  size: '8oz',  stock: 5200, status: 'In Stock',  orders: 64,  revenue: '₱48,000' },
  { id: 26, name: 'DOUBLE WALL BROWN',  supplier: 'PhilPack Industries',  size: '12oz', stock: 460,  status: 'Low Stock', orders: 11,  revenue: '₱9,200'  },
  { id: 27, name: 'DOUBLE WALL BROWN',  supplier: 'CupMaster Supply',     size: '16oz', stock: 6400, status: 'In Stock',  orders: 71,  revenue: '₱53,000' },
  { id: 28, name: 'DOUBLE WALL BLACK',  supplier: 'ProPack PH',           size: '8oz',  stock: 3600, status: 'In Stock',  orders: 38,  revenue: '₱29,000' },
  { id: 29, name: 'DOUBLE WALL BLACK',  supplier: 'Manila Plastics Co.',  size: '12oz', stock: 1800, status: 'In Stock',  orders: 20,  revenue: '₱16,000' },
  { id: 30, name: 'DOUBLE WALL BLACK',  supplier: 'PhilPack Industries',  size: '16oz', stock: 4900, status: 'In Stock',  orders: 58,  revenue: '₱41,000' },
]

export const orders = [
  { id: 'ORD-001', customer: 'ABC Coffee Shop',  email: 'orders@abccoffee.com',     product: 'PP U-CUPS',        size: '16oz', qty: 1000, amount: '₱2,100',  date: 'Mar 10, 2026', status: 'Completed',     payment: 'paid'    },
  { id: 'ORD-002', customer: 'Smoothie Haven',   email: 'john@smoothiehaven.com',    product: 'PET CUPS',         size: '16oz', qty:  500, amount: '₱1,500',  date: 'Mar 12, 2026', status: 'In Production', payment: 'partial' },
  { id: 'ORD-003', customer: 'Bean & Brew',       email: 'lisa@beanandbrew.com',      product: 'DOUBLE WALL WHITE', size: '12oz', qty: 2000, amount: '₱15,600', date: 'Mar 15, 2026', status: 'Scheduled',     payment: 'unpaid'  },
  { id: 'ORD-004', customer: 'Party Central',    email: 'events@partycentral.ph',    product: 'HARD CUPS',        size: '22oz', qty:  500, amount: '₱3,675',  date: 'Mar 14, 2026', status: 'Completed',     payment: 'paid'    },
  { id: 'ORD-005', customer: 'Café Lumière',     email: 'info@cafelumiere.ph',       product: 'SLIM CUPS',        size: '22oz', qty: 1000, amount: '₱4,350',  date: 'Mar 17, 2026', status: 'Pending',       payment: 'unpaid'  },
  { id: 'ORD-006', customer: 'The Daily Grind',  email: 'orders@dailygrind.com',     product: 'PET U-CUPS',       size: '12oz', qty: 3000, amount: '₱22,500', date: 'Mar 18, 2026', status: 'Pending',       payment: 'partial' },
  { id: 'ORD-007', customer: 'Brew Haven',       email: 'info@brewhaven.com',        product: 'DOUBLE WALL BROWN', size: '12oz', qty: 1500, amount: '₱11,250', date: 'Mar 19, 2026', status: 'Scheduled',     payment: 'unpaid'  },
  { id: 'ORD-008', customer: 'Cup & Saucer',     email: 'contact@cupandsaucer.com',  product: 'HARD CUPS',        size: '16oz', qty:  800, amount: '₱6,800',  date: 'Mar 20, 2026', status: 'In Production', payment: 'paid'    },
]

export const messages = [
  {
    id:          1,
    name:        'Maria Santos',
    email:       'maria@example.com',
    subject:     'Bulk Order Inquiry',
    preview:     "Hi, I'm interested in ordering 5000 pieces of 16oz PP U-CUPS with custom logo printing. Can you provide a quote?",
    date:        'Mar 15, 2026, 10:30 AM',
    read:        false,
    replyStatus: 'pending',
  },
  {
    id:          2,
    name:        'John Reyes',
    email:       'john@smoothiehaven.com',
    subject:     'Order Status',
    preview:     'Can you please update me on the status of order ORD-002? We have an event this weekend.',
    date:        'Mar 14, 2026, 2:20 PM',
    read:        true,
    replyStatus: 'replied',
  },
  {
    id:          3,
    name:        'Lisa Chen',
    email:       'lisa@beanandbrew.com',
    subject:     'Custom Design Request',
    preview:     'We need help with designing a logo for our cups. Do you offer design services alongside printing?',
    date:        'Mar 13, 2026, 9:15 AM',
    read:        true,
    replyStatus: 'pending',
  },
  {
    id:          4,
    name:        'Mark Dela Cruz',
    email:       'mark@coffeelab.com',
    subject:     'Sample Request',
    preview:     'Would it be possible to request samples of your double wall cups before placing a bulk order?',
    date:        'Mar 12, 2026, 3:45 PM',
    read:        false,
    replyStatus: 'pending',
  },
]

export const lowStockItems = [
  { name: 'PP Y-CUPS - 22oz',           stock: '420 units',  threshold: 500, severity: 'red'    },
  { name: 'PET CUPS - 12oz',             stock: '280 units',  threshold: 500, severity: 'red'    },
  { name: 'HARD CUPS - 16oz',            stock: '390 units',  threshold: 500, severity: 'red'    },
  { name: 'DOUBLE WALL BROWN - 12oz',    stock: '460 units',  threshold: 500, severity: 'red'    },
  { name: 'Paint - Green',               stock: '15 liters',  threshold: 20,  severity: 'orange' },
  { name: 'Paint - Yellow',              stock: '18 liters',  threshold: 20,  severity: 'orange' },
  { name: 'Silkscreen - Medium',         stock: '8 units',    threshold: 10,  severity: 'orange' },
]

export const recentOrders = [
  { id: 'ORD-001', status: 'Completed',     product: 'PP U-CUPS 16oz',          customer: 'ABC Coffee Shop', amount: '₱2,100'  },
  { id: 'ORD-002', status: 'In Production', product: 'PET CUPS 16oz',            customer: 'Smoothie Haven',  amount: '₱1,500'  },
  { id: 'ORD-003', status: 'Scheduled',     product: 'DOUBLE WALL WHITE 12oz',   customer: 'Bean & Brew',     amount: '₱15,600' },
  { id: 'ORD-004', status: 'Completed',     product: 'HARD CUPS 22oz',           customer: 'Party Central',   amount: '₱3,675'  },
  { id: 'ORD-005', status: 'Pending',       product: 'SLIM CUPS 22oz',           customer: 'Café Lumière',    amount: '₱4,350'  },
]

export const dashboardStats = [
  { label: 'Total Stock', value: '111,500', sub: 'Cup units in inventory', subColor: 'text-gray-500', icon: 'package', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { label: 'Total Orders', value: '8', sub: '+3 in progress', subColor: 'text-emerald-600', icon: 'cart', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { label: 'Total Revenue', value: '₱67,775', sub: 'From completed orders', subColor: 'text-gray-500', icon: 'dollar', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { label: 'Low Stock Items', value: '7', sub: 'Needs restocking', subColor: 'text-red-600', icon: 'alert', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
]

export const revenueCategories = [
  { name: 'PET CUPS',     revenue: 152500, orders: 61 },
  { name: 'DBL WALL',     revenue: 131600, orders: 51 },
  { name: 'HARD CUPS',    revenue: 126000, orders: 53 },
  { name: 'SLIM CUPS',    revenue: 110200, orders: 46 },
  { name: 'PP U-CUPS',    revenue: 105000, orders: 40 },
  { name: 'PP Y-CUPS',    revenue: 100000, orders: 39 },
  { name: 'DBL WALL WHT', revenue:  86000, orders: 35 },
  { name: 'DBL WALL BRN', revenue:  84500, orders: 34 },
]

export const topProducts = [
  { name: 'PET CUPS 16oz',          orders: 92  },
  { name: 'PP U-CUPS 12oz',         orders: 88  },
  { name: 'HARD CUPS 22oz',         orders: 84  },
  { name: 'DBL WALL WHITE 12oz',    orders: 78  },
  { name: 'PET U-CUPS 12oz',        orders: 73  },
  { name: 'DBL WALL BROWN 16oz',    orders: 71  },
  { name: 'PP Y-CUPS 12oz',         orders: 67  },
  { name: 'DBL WALL BROWN 8oz',     orders: 64  },
  { name: 'PET U-CUPS 22oz',        orders: 61  },
  { name: 'DBL WALL BLACK 16oz',    orders: 58  },
]

export const monthlyData = [
  { month: 'Jan', revenue:  60000, orders: 320 },
  { month: 'Feb', revenue: 130000, orders: 640 },
  { month: 'Mar', revenue: 200000, orders: 980 },
]

export const weeklySales = [
  { value: 12000, displayValue: '12,000' },
  { value: 15000, displayValue: '15,000' },
  { value: 14000, displayValue: '14,000' },
  { value: 18000, displayValue: '18,000' },
  { value: 21000, displayValue: '21,000' },
  { value: 19500, displayValue: '19,500' },
  { value: 17000, displayValue: '17,000' },
]

export const orderStatusData = [
  { label: 'Completed',     value: 2, color: '#10b981' },
  { label: 'In Production', value: 1, color: '#3b82f6' },
  { label: 'Scheduled',     value: 1, color: '#8b5cf6' },
  { label: 'Pending',       value: 1, color: '#f59e0b' },
]

export const analyticsStats = [
  { label: 'Total Revenue',   value: '₱997,200', icon: 'dollar',   iconColor: 'text-green-600',  trend: 'up',   sub: '+12.5% from last month' },
  { label: 'Total Orders',    value: '1309',      icon: 'package',  iconColor: 'text-blue-600',   trend: 'up',   sub: '+8.3% from last month'  },
  { label: 'Avg Order Value', value: '₱761.80',   icon: 'dollar',   iconColor: 'text-purple-600', trend: 'down', sub: '-2.1% from last month'  },
  { label: 'Completion Rate', value: '40.0%',     icon: 'trending', iconColor: 'text-green-600',  trend: null,   sub: '2 of 5 orders'          },
]