import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { DELIVERY_FEE, TAX_RATE, dishById, initialAddresses, initialCards, type Address, type Card } from "@/data";

export type CartLine = { key: string; dishId: string; qty: number; addOns: string[]; unit: number };
export type OrderStatus = "active" | "completed" | "cancelled";
export type Order = {
  id: string;
  lines: CartLine[];
  total: number;
  placedAt: number;
  status: OrderStatus;
  addressId: string;
  reviewed?: boolean;
};

type State = {
  user: { name: string; email: string; phone: string; dob: string } | null;
  cart: CartLine[];
  favorites: string[];
  orders: Order[];
  addresses: Address[];
  addressId: string;
  cards: Card[];
  cardId: string;
  drawer: "cart" | "profile" | null;
  notifications: Record<string, boolean>;
};

type Action =
  | { type: "login"; name?: string; email: string; phone?: string; dob?: string }
  | { type: "logout" }
  | { type: "updateUser"; user: NonNullable<State["user"]> }
  | { type: "add"; dishId: string; qty: number; addOns: string[] }
  | { type: "qty"; key: string; delta: number }
  | { type: "remove"; key: string }
  | { type: "toggleFavorite"; dishId: string }
  | { type: "placeOrder" }
  | { type: "setOrderStatus"; id: string; status: OrderStatus }
  | { type: "reviewed"; id: string }
  | { type: "reorder"; id: string }
  | { type: "addAddress"; address: Address }
  | { type: "selectAddress"; id: string }
  | { type: "addCard"; card: Card }
  | { type: "selectCard"; id: string }
  | { type: "drawer"; drawer: State["drawer"] }
  | { type: "notify"; key: string; value: boolean };

const day = 86_400_000;
const past = (id: string, dishId: string, qty: number, daysAgo: number, status: OrderStatus): Order => {
  const unit = dishById(dishId)!.price;
  return { id, lines: [{ key: dishId, dishId, qty, addOns: [], unit }], total: unit * qty, placedAt: Date.now() - daysAgo * day, status, addressId: "a1" };
};

const initial: State = {
  user: null,
  cart: [],
  favorites: ["sushi", "brownie"],
  orders: [
    past("o-101", "curry", 1, 2, "completed"),
    past("o-102", "burger", 2, 9, "completed"),
    past("o-103", "latte", 1, 12, "completed"),
    past("o-104", "cheesecake", 1, 18, "completed"),
    past("o-105", "sushi", 1, 21, "cancelled"),
    past("o-106", "icedtea", 1, 30, "cancelled"),
  ],
  addresses: initialAddresses,
  addressId: initialAddresses[0].id,
  cards: initialCards,
  cardId: initialCards[0].id,
  drawer: null,
  notifications: { general: true, sound: true, soundCall: true, vibrate: false, offers: false, payments: false, promo: false, cashback: false },
};

export const unitPrice = (dishId: string, addOns: string[]) => {
  const dish = dishById(dishId)!;
  return dish.price + dish.addOns.filter((a) => addOns.includes(a.id)).reduce((s, a) => s + a.price, 0);
};

export const totals = (lines: CartLine[]) => {
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const delivery = lines.length ? DELIVERY_FEE : 0;
  return { subtotal, tax, delivery, total: subtotal + tax + delivery, count: lines.reduce((s, l) => s + l.qty, 0) };
};

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "login":
      return { ...s, user: { name: a.name ?? "John Smith", email: a.email, phone: a.phone ?? "+1 510 555 0199", dob: a.dob ?? "09/10/1991" } };
    case "logout":
      return { ...s, user: null, drawer: null, cart: [] };
    case "updateUser":
      return { ...s, user: a.user };
    case "add": {
      const key = [a.dishId, ...[...a.addOns].sort()].join("|");
      const existing = s.cart.find((l) => l.key === key);
      return {
        ...s,
        cart: existing
          ? s.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + a.qty } : l))
          : [...s.cart, { key, dishId: a.dishId, qty: a.qty, addOns: a.addOns, unit: unitPrice(a.dishId, a.addOns) }],
      };
    }
    case "qty":
      return { ...s, cart: s.cart.map((l) => (l.key === a.key ? { ...l, qty: l.qty + a.delta } : l)).filter((l) => l.qty > 0) };
    case "remove":
      return { ...s, cart: s.cart.filter((l) => l.key !== a.key) };
    case "toggleFavorite":
      return { ...s, favorites: s.favorites.includes(a.dishId) ? s.favorites.filter((f) => f !== a.dishId) : [...s.favorites, a.dishId] };
    case "placeOrder": {
      if (!s.cart.length) return s;
      const order: Order = { id: `o-${Date.now()}`, lines: s.cart, total: totals(s.cart).total, placedAt: Date.now(), status: "active", addressId: s.addressId };
      return { ...s, orders: [order, ...s.orders], cart: [] };
    }
    case "setOrderStatus":
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, status: a.status } : o)) };
    case "reviewed":
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, reviewed: true } : o)) };
    case "reorder": {
      const order = s.orders.find((o) => o.id === a.id);
      return order ? { ...s, cart: order.lines.map((l) => ({ ...l })), drawer: "cart" } : s;
    }
    case "addAddress":
      return { ...s, addresses: [...s.addresses, a.address], addressId: a.address.id };
    case "selectAddress":
      return { ...s, addressId: a.id };
    case "addCard":
      return { ...s, cards: [a.card, ...s.cards], cardId: a.card.id };
    case "selectCard":
      return { ...s, cardId: a.id };
    case "drawer":
      return { ...s, drawer: a.drawer };
    case "notify":
      return { ...s, notifications: { ...s.notifications, [a.key]: a.value } };
  }
}

// ponytail: in-memory only, add AsyncStorage persistence when state must survive relaunch.
const Ctx = createContext<[State, Dispatch<Action>] | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useReducer(reducer, initial)}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside AppProvider");
  return ctx;
}

export const money = (n: number) => `$${n.toFixed(2)}`;
