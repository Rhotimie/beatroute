/** Dummy data for the prototype. Everything here is invented. */
const D = {
  user: { name: "Sam Rivera", role: "Sales Rep", id: "E-1042", team: "North Zone" },
  state: { dayIn: false, dayInTime: null, checkedIn: null, cart: {}, draftCount: 2 },
  retailers: [
    { id: 1, name: "Corner Mart", contact: "A. Patel", phone: "555-0101", city: "Springfield", type: "Grocery", stage: "Active", dist: 0.4, due: 1200, last: "2 days ago", x: 22, y: 30 },
    { id: 2, name: "Daily Fresh", contact: "R. Kumar", phone: "555-0102", city: "Springfield", type: "Supermarket", stage: "Active", dist: 1.1, due: 0, last: "6 days ago", x: 55, y: 18 },
    { id: 3, name: "Green Basket", contact: "M. Lopez", phone: "555-0103", city: "Riverton", type: "Grocery", stage: "Prospect", dist: 2.3, due: 340, last: "never", x: 70, y: 55 },
    { id: 4, name: "Sunrise Stores", contact: "J. Chen", phone: "555-0104", city: "Riverton", type: "Convenience", stage: "Active", dist: 3.0, due: 80, last: "today", x: 35, y: 68 },
    { id: 5, name: "City Pantry", contact: "D. Okoye", phone: "555-0105", city: "Lakeside", type: "Wholesale", stage: "Dormant", dist: 4.2, due: 4800, last: "30 days ago", x: 82, y: 78 },
    { id: 6, name: "Hilltop Foods", contact: "S. Ali", phone: "555-0106", city: "Lakeside", type: "Supermarket", stage: "Active", dist: 5.5, due: 0, last: "1 day ago", x: 12, y: 80 }
  ],
  products: [
    { id: 1, name: "Whole Grain Rice 5kg", cat: "Staples", price: 12.5, stock: 40 },
    { id: 2, name: "Sunflower Oil 1L", cat: "Staples", price: 4.2, stock: 120 },
    { id: 3, name: "Orange Juice 1L", cat: "Drinks", price: 2.8, stock: 60 },
    { id: 4, name: "Sparkling Water 6pk", cat: "Drinks", price: 5.1, stock: 15 },
    { id: 5, name: "Oat Cookies 200g", cat: "Snacks", price: 1.9, stock: 200 },
    { id: 6, name: "Salted Crisps 150g", cat: "Snacks", price: 1.6, stock: 90 },
    { id: 7, name: "Dish Soap 500ml", cat: "Home", price: 3.3, stock: 0 }
  ],
  distributors: [
    { id: 1, name: "Metro Wholesale", city: "Springfield", orders: 14, credit: 25000 },
    { id: 2, name: "Valley Supply Co", city: "Riverton", orders: 9, credit: 18000 },
    { id: 3, name: "Lakeshore Traders", city: "Lakeside", orders: 6, credit: 12000 }
  ],
  team: [
    { id: 1, name: "Priya Nair", role: "Sales Rep", visits: 8, status: "In visit" },
    { id: 2, name: "Tom Becker", role: "Sales Rep", visits: 5, status: "Day in" },
    { id: 3, name: "Lena Fischer", role: "Promoter", visits: 11, status: "Day out" },
    { id: 4, name: "Omar Haddad", role: "Sales Rep", visits: 0, status: "On leave" }
  ],
  orders: [
    { id: "SO-2041", retailer: "Corner Mart", total: 182.4, status: "Pending", date: "Today" },
    { id: "SO-2038", retailer: "Daily Fresh", total: 96.0, status: "Approved", date: "Yesterday" },
    { id: "SO-2031", retailer: "Hilltop Foods", total: 310.7, status: "Pending", date: "2 days ago" },
    { id: "SO-2027", retailer: "Sunrise Stores", total: 54.2, status: "Rejected", date: "3 days ago" }
  ],
  schemes: [
    { id: 1, name: "Buy 10 get 1 free", rule: "Oat Cookies 200g", ends: "30 Nov" },
    { id: 2, name: "5% off above 100", rule: "Orders over 100", ends: "15 Dec" },
    { id: 3, name: "Bundle: rice + oil", rule: "Rice 5kg + Oil 1L", ends: "20 Nov" }
  ],
  campaigns: [
    { id: 1, name: "Shelf Display Audit", due: "Due in 3 days", done: 12, total: 20 },
    { id: 2, name: "New Product Launch Survey", due: "Due in 9 days", done: 3, total: 15 }
  ],
  leaves: [
    { type: "Casual", dates: "4-5 Nov", status: "Approved" },
    { type: "Sick", dates: "18 Oct", status: "Approved" },
    { type: "Casual", dates: "28 Dec", status: "Pending" }
  ],
  expenses: [
    { id: 1, label: "Fuel", amt: 42, date: "10 Nov", status: "Approved" },
    { id: 2, label: "Lunch", amt: 14.5, date: "11 Nov", status: "Pending" },
    { id: 3, label: "Parking", amt: 6, date: "12 Nov", status: "Pending" }
  ],
  assets: [
    { name: "Counter Display Stand", qty: 3, at: "Corner Mart" },
    { name: "Chiller Unit", qty: 1, at: "Daily Fresh" },
    { name: "Banner Set", qty: 5, at: "Warehouse" }
  ],
  topics: [
    { name: "Product Range 101", lessons: 6, done: 4 },
    { name: "Closing an Order", lessons: 4, done: 1 },
    { name: "Merchandising Basics", lessons: 5, done: 0 }
  ],
  days: ["M", "T", "W", "T", "F", "S", "S"],
  money: n => "$" + Number(n).toFixed(2)
};
