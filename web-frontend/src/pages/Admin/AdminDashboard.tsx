import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutGrid,
  Package,
  ShoppingBag,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  PauseCircle,
  XCircle,
  Truck,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  LogOut,
  Menu,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ *
 *  StyleHub Admin — single-file dashboard
 * ------------------------------------------------------------------ */

// ---------- design tokens ----------
const T = {
  bg: "#F5EDE1",
  card: "#FFFFFF",
  ink: "#2B2118",
  muted: "#8B7A68",
  border: "#EAE0D0",
  terracotta: "#B3481B",
  terracottaSoft: "#F3DCC7",
  terracottaSofter: "#FBF1E6",
};

// ---------- types ----------
type Category = "Apparel" | "Footwear" | "Accessories" | "Home";

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  image: string;
}

type OrderStatus =
  | "Pending"
  | "Processing"
  | "On Hold"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  name: string;
  qty: number;
}

interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  payment: "Cash on Delivery" | "Card" | "bKash" | "Nagad" | "Rocket";
  status: OrderStatus;
  placedAt: string;
}

// ---------- seed data ----------
const initialProducts: Product[] = [
  {
    id: "P-1001",
    name: "Linen Wrap Shirt",
    category: "Apparel",
    price: 1450,
    stock: 32,
    image: "👕",
  },
  {
    id: "P-1002",
    name: "Suede Ankle Boot",
    category: "Footwear",
    price: 3200,
    stock: 8,
    image: "👢",
  },
  {
    id: "P-1003",
    name: "Woven Tote Bag",
    category: "Accessories",
    price: 990,
    stock: 0,
    image: "👜",
  },
  {
    id: "P-1004",
    name: "Ceramic Table Lamp",
    category: "Home",
    price: 2650,
    stock: 15,
    image: "💡",
  },
  {
    id: "P-1005",
    name: "Tailored Trousers",
    category: "Apparel",
    price: 1800,
    stock: 21,
    image: "👖",
  },
];

const initialOrders: Order[] = [
  {
    id: "ORD-7841",
    customer: "Anika Rahman",
    phone: "01712-345678",
    address: "House 12, Road 5, Block A, Gazipur Sadar",
    items: [
      { name: "Linen Wrap Shirt", qty: 1 },
      { name: "Woven Tote Bag", qty: 1 },
    ],
    total: 2440,
    payment: "Cash on Delivery",
    status: "Pending",
    placedAt: "2026-09-08 10:22",
  },
  {
    id: "ORD-7840",
    customer: "Tanvir Ahmed",
    phone: "01898-221190",
    address: "Flat 4B, Road 11, Dhanmondi, Dhaka",
    items: [{ name: "Suede Ankle Boot", qty: 1 }],
    total: 3200,
    payment: "bKash",
    status: "Processing",
    placedAt: "2026-09-08 09:10",
  },
  {
    id: "ORD-7839",
    customer: "Meherun Nesa",
    phone: "01611-908213",
    address: "Sector 7, Uttara, Dhaka",
    items: [{ name: "Ceramic Table Lamp", qty: 2 }],
    total: 5300,
    payment: "Card",
    status: "On Hold",
    placedAt: "2026-09-07 18:45",
  },
  {
    id: "ORD-7838",
    customer: "Rafiq Islam",
    phone: "01533-774411",
    address: "Chandra, Kaliakair, Gazipur",
    items: [{ name: "Tailored Trousers", qty: 1 }],
    total: 1800,
    payment: "Nagad",
    status: "Delivered",
    placedAt: "2026-09-06 14:02",
  },
  {
    id: "ORD-7837",
    customer: "Sultana Begum",
    phone: "01922-006677",
    address: "Board Bazar, Gazipur",
    items: [{ name: "Linen Wrap Shirt", qty: 2 }],
    total: 2900,
    payment: "Rocket",
    status: "Cancelled",
    placedAt: "2026-09-06 11:37",
  },
];

// monthly sales
const monthlySales: { month: string; sales: number }[] = [
  { month: "Apr", sales: 42000 },
  { month: "May", sales: 51500 },
  { month: "Jun", sales: 47800 },
  { month: "Jul", sales: 63200 },
  { month: "Aug", sales: 58900 },
  { month: "Sep", sales: 71400 },
];

const CATEGORIES: Category[] = ["Apparel", "Footwear", "Accessories", "Home"];

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "On Hold",
  "Delivered",
  "Cancelled",
];

function currency(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

function statusStyle(status: OrderStatus) {
  switch (status) {
    case "Pending":
      return {
        bg: "#FBF1E6",
        fg: "#B3481B",
        dot: "#B3481B",
      };

    case "Processing":
      return {
        bg: "#E8EEFB",
        fg: "#2A4E9C",
        dot: "#2A4E9C",
      };

    case "On Hold":
      return {
        bg: "#F1E9F7",
        fg: "#6B3FA0",
        dot: "#6B3FA0",
      };

    case "Delivered":
      return {
        bg: "#E6F3E9",
        fg: "#2E7D4F",
        dot: "#2E7D4F",
      };

    case "Cancelled":
      return {
        bg: "#FBE7E4",
        fg: "#B23B2E",
        dot: "#B23B2E",
      };
  }
}

// ---------- shared UI ----------
function StatusBadge({ status }: { status: OrderStatus }) {
  const s = statusStyle(status);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: s.bg,
        color: s.fg,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: s.dot,
        }}
      />

      {status}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-xs font-medium"
        style={{
          background: "#FBE7E4",
          color: "#B23B2E",
        }}
      >
        Out of stock
      </span>
    );
  }

  if (stock <= 10) {
    return (
      <span
        className="rounded-full px-2.5 py-1 text-xs font-medium"
        style={{
          background: "#FBF1E6",
          color: "#B3481B",
        }}
      >
        Low · {stock}
      </span>
    );
  }

  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        background: "#E6F3E9",
        color: "#2E7D4F",
      }}
    >
      {stock} in stock
    </span>
  );
}

function SalesChart({ data }: { data: { month: string; sales: number }[] }) {
  return (
    <div
      style={{
        width: "100%",
        height: 260,
      }}
    >
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.terracotta} stopOpacity={0.35} />

              <stop offset="100%" stopColor={T.terracotta} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={T.border} vertical={false} />

          <XAxis
            dataKey="month"
            tick={{
              fill: T.muted,
              fontSize: 12,
            }}
            axisLine={{
              stroke: T.border,
            }}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: T.muted,
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
            width={48}
          />

          <Tooltip
            formatter={(value: number) => [currency(value), "Sales"]}
            contentStyle={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              fontSize: 13,
            }}
            labelStyle={{
              color: T.ink,
              fontWeight: 600,
            }}
          />

          <Area
            type="monotone"
            dataKey="sales"
            stroke={T.terracotta}
            strokeWidth={2.5}
            fill="url(#salesFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- product form modal ----------
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>(
    product ?? {
      id: `P-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      category: "Apparel",
      price: 0,
      stock: 0,
      image: "🛍️",
    },
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(43,33,24,0.45)",
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl p-5 sm:p-6"
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: T.ink }}>
            {product ? "Edit product" : "Add product"}
          </h3>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/5"
          >
            <X size={18} color={T.muted} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl"
              style={{
                background: T.terracottaSofter,
                border: `1px dashed ${T.terracottaSoft}`,
              }}
            >
              {form.image}
            </div>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                background: T.terracottaSofter,
                color: T.terracotta,
              }}
              onClick={() => {
                const options = [
                  "👕",
                  "👖",
                  "👗",
                  "👢",
                  "👜",
                  "💡",
                  "🧢",
                  "🕶️",
                ];

                setForm({
                  ...form,
                  image: options[Math.floor(Math.random() * options.length)],
                });
              }}
            >
              <ImagePlus size={16} />
              Randomize icon
            </button>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: T.ink }}
            >
              Product name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Linen Wrap Shirt"
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: T.terracottaSofter,
                border: `1px solid ${T.border}`,
                color: T.ink,
              }}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: T.ink }}
              >
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Category,
                  })
                }
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: T.terracottaSofter,
                  border: `1px solid ${T.border}`,
                  color: T.ink,
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: T.ink }}
              >
                Price (৳)
              </label>

              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                style={{
                  background: T.terracottaSofter,
                  border: `1px solid ${T.border}`,
                  color: T.ink,
                }}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              style={{ color: T.ink }}
            >
              Stock quantity
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: Number(e.target.value),
                })
              }
              className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
              style={{
                background: T.terracottaSofter,
                border: `1px solid ${T.border}`,
                color: T.ink,
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{
              color: T.muted,
              border: `1px solid ${T.border}`,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => form.name.trim() && onSave(form)}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            style={{
              background: T.terracotta,
            }}
          >
            {product ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- order detail drawer ----------
function OrderDrawer({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}) {
  const s = statusStyle(order.status);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      style={{
        background: "rgba(43,33,24,0.45)",
      }}
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-md overflow-y-auto p-5 sm:p-6"
        style={{
          background: T.card,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium" style={{ color: T.muted }}>
              {order.placedAt}
            </p>

            <h3 className="text-xl font-semibold" style={{ color: T.ink }}>
              {order.id}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-black/5"
          >
            <X size={18} color={T.muted} />
          </button>
        </div>

        <div className="mb-6 rounded-xl p-4" style={{ background: s.bg }}>
          <p className="text-xs font-medium" style={{ color: s.fg }}>
            Current status
          </p>

          <p className="text-base font-semibold" style={{ color: s.fg }}>
            {order.status}
          </p>
        </div>

        <div className="mb-6 space-y-1">
          <p className="text-sm font-semibold" style={{ color: T.ink }}>
            {order.customer}
          </p>

          <p className="text-sm" style={{ color: T.muted }}>
            {order.phone}
          </p>

          <p className="break-words text-sm" style={{ color: T.muted }}>
            {order.address}
          </p>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold" style={{ color: T.ink }}>
            Items
          </p>

          <div
            className="space-y-2 rounded-xl p-3"
            style={{
              background: T.terracottaSofter,
            }}
          >
            {order.items.map((it, i) => (
              <div
                key={i}
                className="flex justify-between text-sm"
                style={{ color: T.ink }}
              >
                <span className="break-words pr-3">
                  {it.name} <span style={{ color: T.muted }}>× {it.qty}</span>
                </span>
              </div>
            ))}

            <div
              className="mt-2 flex flex-wrap justify-between gap-2 border-t pt-2 text-sm font-semibold"
              style={{
                borderColor: T.border,
                color: T.ink,
              }}
            >
              <span>Total ({order.payment})</span>

              <span>{currency(order.total)}</span>
            </div>
          </div>
        </div>

        <p className="mb-2 text-sm font-semibold" style={{ color: T.ink }}>
          Update order
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateStatus(order.id, "On Hold")}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium"
            style={{
              background: "#F1E9F7",
              color: "#6B3FA0",
            }}
          >
            <PauseCircle size={16} />
            Hold
          </button>

          <button
            onClick={() => onUpdateStatus(order.id, "Processing")}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium"
            style={{
              background: "#E8EEFB",
              color: "#2A4E9C",
            }}
          >
            <Truck size={16} />
            Processing
          </button>

          <button
            onClick={() => onUpdateStatus(order.id, "Delivered")}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium"
            style={{
              background: "#E6F3E9",
              color: "#2E7D4F",
            }}
          >
            <CheckCircle2 size={16} />
            Delivered
          </button>

          <button
            onClick={() => onUpdateStatus(order.id, "Cancelled")}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium"
            style={{
              background: "#FBE7E4",
              color: "#B23B2E",
            }}
          >
            <XCircle size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- main dashboard ----------
type Tab = "overview" | "products" | "orders";

export default function AdminDashboard({
  onLogout,
}: {
  onLogout?: () => void;
} = {}) {
  const [tab, setTab] = useState<Tab>("overview");

  const [confirmLogout, setConfirmLogout] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [orders, setOrders] = useState<Order[]>([]);

  const [productModal, setProductModal] = useState<{
    open: boolean;
    editing: Product | null;
  }>({
    open: false,
    editing: null,
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const [orderFilter, setOrderFilter] = useState<OrderStatus | "All">("All");

  const [search, setSearch] = useState("");

  //api connection starts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/order");

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();

        const formattedOrders: Order[] = data.orders.map((order: any) => ({
          id: `ORD-${order.id}`,
          customer: order.customer,
          phone: order.phone,
          address: order.address,
          total: Number(order.total),
          payment: order.payment,
          status: order.status,
          placedAt: new Date(order.placed_at).toLocaleString(),
          items: order.items.map((item: any) => ({
            name: item.product_name,
            qty: item.quantity,
          })),
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Orders fetch error:", error);
      }
    };

    fetchOrders();
  }, []);
  //api connection end

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status === "Delivered")
      .reduce((a, o) => a + o.total, 0);

    const pending = orders.filter((o) => o.status === "Pending").length;

    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= 10,
    ).length;

    const outOfStock = products.filter((p) => p.stock === 0).length;

    return {
      revenue,
      pending,
      lowStock,
      outOfStock,
      totalOrders: orders.length,
      totalProducts: products.length,
    };
  }, [orders, products]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredOrders = orders.filter((o) =>
    orderFilter === "All" ? true : o.status === orderFilter,
  );

  function saveProduct(p: Product) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);

      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [p, ...prev];
    });

    setProductModal({
      open: false,
      editing: null,
    });
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

    setActiveOrder((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev,
    );
  }

  const navItems: {
    key: Tab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: <LayoutGrid size={18} />,
    },
    {
      key: "products",
      label: "Products",
      icon: <Package size={18} />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingBag size={18} />,
    },
  ];

  const handleMobileNav = (key: Tab) => {
    setTab(key);
    setMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    setConfirmLogout(true);
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        background: T.bg,
        color: T.ink,
        fontFamily: "Inter, ui-sans-serif, system-ui",
      }}
    >
      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <div
        className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b px-4 sm:hidden"
        style={{
          background: T.card,
          borderColor: T.border,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{
              background: T.terracotta,
            }}
          >
            S
          </div>

          <span className="text-lg font-semibold">StyleHub</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            background: mobileMenuOpen ? T.terracottaSoft : T.terracottaSofter,
            color: T.terracotta,
          }}
          aria-label="Toggle admin menu"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          style={{
            background: "rgba(43,33,24,0.25)",
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 right-0 top-16 border-b p-4 shadow-xl"
            style={{
              background: T.card,
              borderColor: T.border,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <p
                className="px-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: T.muted }}
              >
                Admin menu
              </p>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => handleMobileNav(item.key)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium"
                    style={{
                      background: active ? T.terracottaSoft : "transparent",
                      color: active ? T.terracotta : T.muted,
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div
              className="my-3"
              style={{
                borderTop: `1px solid ${T.border}`,
              }}
            />

            <button
              onClick={handleMobileLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium"
              style={{
                color: "#B23B2E",
              }}
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside
        className="hidden w-60 shrink-0 flex-col border-r px-4 py-6 sm:flex"
        style={{
          borderColor: T.border,
        }}
      >
        <div className="mb-8 flex items-center gap-2 px-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{
              background: T.terracotta,
            }}
          >
            S
          </div>

          <span className="text-lg font-semibold">StyleHub</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = tab === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                style={{
                  background: active ? T.terracottaSoft : "transparent",
                  color: active ? T.terracotta : T.muted,
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div
            className="rounded-xl p-4 text-xs"
            style={{
              background: T.terracottaSofter,
              color: T.muted,
            }}
          >
            <p className="mb-1 font-semibold" style={{ color: T.ink }}>
              Admin console
            </p>
            Logged in as{" "}
            <span style={{ color: T.terracotta }}>Store Manager</span>
          </div>

          <button
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
            style={{
              color: "#B23B2E",
            }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-8 sm:py-6">
        {/* Topbar */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold" style={{ color: T.ink }}>
              {tab === "overview" && "Dashboard overview"}
              {tab === "products" && "Manage products"}
              {tab === "orders" && "Customer orders"}
            </h1>

            <p className="text-sm" style={{ color: T.muted }}>
              {tab === "overview" &&
                "A quick pulse on how the shop is doing today."}

              {tab === "products" &&
                "Add, edit, or remove items from the storefront."}

              {tab === "orders" &&
                "Track, hold, process, cancel, or deliver orders."}
            </p>
          </div>

          {/* PRODUCT TOP ACTIONS */}

          {tab === "products" && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <div
                className="flex h-10 w-full items-center gap-2 rounded-lg px-3 sm:w-auto"
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                }}
              >
                <Search size={16} color={T.muted} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none sm:w-40"
                />
              </div>

              <button
                onClick={() =>
                  setProductModal({
                    open: true,
                    editing: null,
                  })
                }
                className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold text-white sm:w-auto"
                style={{
                  background: T.terracotta,
                }}
              >
                <Plus size={16} />
                Add product
              </button>
            </div>
          )}

          {/* ORDER FILTER */}

          {tab === "orders" && (
            <div className="relative w-full sm:w-auto">
              <select
                value={orderFilter}
                onChange={(e) =>
                  setOrderFilter(e.target.value as OrderStatus | "All")
                }
                className="w-full appearance-none rounded-lg px-4 py-2.5 pr-9 text-sm font-medium outline-none sm:w-auto"
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  color: T.ink,
                }}
              >
                <option>All</option>

                {ORDER_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                color={T.muted}
              />
            </div>
          )}
        </div>

        {/* =====================================================
            OVERVIEW
        ====================================================== */}

        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                {
                  label: "Delivered revenue",
                  value: currency(stats.revenue),
                },
                {
                  label: "Pending orders",
                  value: stats.pending,
                },
                {
                  label: "Total products",
                  value: stats.totalProducts,
                },
                {
                  label: "Low / out of stock",
                  value: `${stats.lowStock} / ${stats.outOfStock}`,
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl p-4 sm:p-5"
                  style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <p className="text-xs font-medium" style={{ color: T.muted }}>
                    {c.label}
                  </p>

                  <p
                    className="mt-2 break-words text-xl font-semibold sm:text-2xl"
                    style={{ color: T.ink }}
                  >
                    {c.value}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold">Monthly sales</h3>

                  <p className="text-xs" style={{ color: T.muted }}>
                    Total revenue booked per month, last 6 months
                  </p>
                </div>

                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: T.terracottaSoft,
                    color: T.terracotta,
                  }}
                >
                  {currency(monthlySales[monthlySales.length - 1].sales)} this
                  month
                </span>
              </div>

              <SalesChart data={monthlySales} />
            </div>

            <div
              className="rounded-2xl p-4 sm:p-5"
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold">Recent orders</h3>

                <button
                  onClick={() => setTab("orders")}
                  className="text-sm font-medium"
                  style={{
                    color: T.terracotta,
                  }}
                >
                  View all
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => (
                  <div
                    key={o.id}
                    className="flex flex-col gap-2 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                      background: T.terracottaSofter,
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold">{o.customer}</p>

                      <p className="text-xs" style={{ color: T.muted }}>
                        {o.id} · {currency(o.total)}
                      </p>
                    </div>

                    <StatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        {tab === "products" && (
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
            }}
          >
            {/* ================= DESKTOP TABLE ================= */}

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr
                    style={{
                      background: T.terracottaSofter,
                      color: T.muted,
                    }}
                  >
                    <th className="px-5 py-3 font-medium">Product</th>

                    <th className="px-5 py-3 font-medium">Category</th>

                    <th className="px-5 py-3 font-medium">Price</th>

                    <th className="px-5 py-3 font-medium">Stock</th>

                    <th className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t"
                      style={{
                        borderColor: T.border,
                      }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                            style={{
                              background: T.terracottaSofter,
                            }}
                          >
                            {p.image}
                          </div>

                          <div>
                            <p
                              className="font-medium"
                              style={{
                                color: T.ink,
                              }}
                            >
                              {p.name}
                            </p>

                            <p
                              className="text-xs"
                              style={{
                                color: T.muted,
                              }}
                            >
                              {p.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td
                        className="px-5 py-3"
                        style={{
                          color: T.muted,
                        }}
                      >
                        {p.category}
                      </td>

                      <td className="px-5 py-3 font-medium">
                        {currency(p.price)}
                      </td>

                      <td className="px-5 py-3">
                        <StockBadge stock={p.stock} />
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              setProductModal({
                                open: true,
                                editing: p,
                              })
                            }
                            className="rounded-lg p-2"
                            style={{
                              background: T.terracottaSofter,
                              color: T.terracotta,
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="rounded-lg p-2"
                            style={{
                              background: "#FBE7E4",
                              color: "#B23B2E",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-sm"
                        style={{
                          color: T.muted,
                        }}
                      >
                        No products match “{search}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE PRODUCT CARDS ================= */}

            <div
              className="divide-y sm:hidden"
              style={{ borderColor: T.border }}
            >
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4"
                  style={{
                    borderColor: T.border,
                  }}
                >
                  {/* Product heading */}

                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{
                        background: T.terracottaSofter,
                      }}
                    >
                      {p.image}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-semibold"
                            style={{ color: T.ink }}
                          >
                            {p.name}
                          </p>

                          <p
                            className="mt-0.5 text-xs"
                            style={{ color: T.muted }}
                          >
                            {p.id}
                          </p>
                        </div>

                        <p
                          className="shrink-0 text-sm font-bold"
                          style={{ color: T.terracotta }}
                        >
                          {currency(p.price)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product information */}

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div
                      className="rounded-xl p-3"
                      style={{
                        background: T.terracottaSofter,
                      }}
                    >
                      <p
                        className="text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: T.muted }}
                      >
                        Category
                      </p>

                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: T.ink }}
                      >
                        {p.category}
                      </p>
                    </div>

                    <div
                      className="rounded-xl p-3"
                      style={{
                        background: T.terracottaSofter,
                      }}
                    >
                      <p
                        className="mb-1 text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: T.muted }}
                      >
                        Stock
                      </p>

                      <StockBadge stock={p.stock} />
                    </div>
                  </div>

                  {/* Product actions */}

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        setProductModal({
                          open: true,
                          editing: p,
                        })
                      }
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium"
                      style={{
                        background: T.terracottaSofter,
                        color: T.terracotta,
                      }}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium"
                      style={{
                        background: "#FBE7E4",
                        color: "#B23B2E",
                      }}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div
                  className="px-5 py-10 text-center text-sm"
                  style={{
                    color: T.muted,
                  }}
                >
                  No products match “{search}”.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            ORDERS
        ====================================================== */}

        {tab === "orders" && (
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
            }}
          >
            {/* ================= DESKTOP TABLE ================= */}

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr
                    style={{
                      background: T.terracottaSofter,
                      color: T.muted,
                    }}
                  >
                    <th className="px-5 py-3 font-medium">Order</th>

                    <th className="px-5 py-3 font-medium">Customer</th>

                    <th className="px-5 py-3 font-medium">Total</th>

                    <th className="px-5 py-3 font-medium">Payment</th>

                    <th className="px-5 py-3 font-medium">Status</th>

                    <th className="px-5 py-3 text-right font-medium">
                      Quick actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t"
                      style={{
                        borderColor: T.border,
                      }}
                    >
                      <td className="px-5 py-3">
                        <button
                          className="font-medium underline-offset-2 hover:underline"
                          onClick={() => setActiveOrder(o)}
                        >
                          {o.id}
                        </button>

                        <p
                          className="text-xs"
                          style={{
                            color: T.muted,
                          }}
                        >
                          {o.placedAt}
                        </p>
                      </td>

                      <td className="px-5 py-3">{o.customer}</td>

                      <td className="px-5 py-3 font-medium">
                        {currency(o.total)}
                      </td>

                      <td
                        className="px-5 py-3"
                        style={{
                          color: T.muted,
                        }}
                      >
                        {o.payment}
                      </td>

                      <td className="px-5 py-3">
                        <StatusBadge status={o.status} />
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            title="Hold"
                            onClick={() => updateOrderStatus(o.id, "On Hold")}
                            className="rounded-lg p-2"
                            style={{
                              background: "#F1E9F7",
                              color: "#6B3FA0",
                            }}
                          >
                            <PauseCircle size={15} />
                          </button>

                          <button
                            title="Processing"
                            onClick={() =>
                              updateOrderStatus(o.id, "Processing")
                            }
                            className="rounded-lg p-2"
                            style={{
                              background: "#E8EEFB",
                              color: "#2A4E9C",
                            }}
                          >
                            <Truck size={15} />
                          </button>

                          <button
                            title="Mark delivered"
                            onClick={() => updateOrderStatus(o.id, "Delivered")}
                            className="rounded-lg p-2"
                            style={{
                              background: "#E6F3E9",
                              color: "#2E7D4F",
                            }}
                          >
                            <CheckCircle2 size={15} />
                          </button>

                          <button
                            title="Cancel"
                            onClick={() => updateOrderStatus(o.id, "Cancelled")}
                            className="rounded-lg p-2"
                            style={{
                              background: "#FBE7E4",
                              color: "#B23B2E",
                            }}
                          >
                            <XCircle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-10 text-center text-sm"
                        style={{
                          color: T.muted,
                        }}
                      >
                        No orders with this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE ORDER CARDS ================= */}

            <div
              className="divide-y sm:hidden"
              style={{
                borderColor: T.border,
              }}
            >
              {filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-4"
                  style={{
                    borderColor: T.border,
                  }}
                >
                  {/* Order header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <button
                        className="text-sm font-semibold underline-offset-2 hover:underline"
                        style={{ color: T.ink }}
                        onClick={() => setActiveOrder(o)}
                      >
                        {o.id}
                      </button>

                      <p className="mt-1 text-xs" style={{ color: T.muted }}>
                        {o.placedAt}
                      </p>
                    </div>

                    <StatusBadge status={o.status} />
                  </div>

                  {/* Customer */}

                  <div
                    className="mt-4 rounded-xl p-3"
                    style={{
                      background: T.terracottaSofter,
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: T.ink }}
                    >
                      {o.customer}
                    </p>

                    <p className="mt-1 text-xs" style={{ color: T.muted }}>
                      {o.phone}
                    </p>

                    <p
                      className="mt-1 break-words text-xs leading-5"
                      style={{ color: T.muted }}
                    >
                      {o.address}
                    </p>
                  </div>

                  {/* Order details */}

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p
                        className="text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: T.muted }}
                      >
                        Total
                      </p>

                      <p
                        className="mt-1 text-sm font-semibold"
                        style={{ color: T.ink }}
                      >
                        {currency(o.total)}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-[11px] font-medium uppercase tracking-wide"
                        style={{ color: T.muted }}
                      >
                        Payment
                      </p>

                      <p
                        className="mt-1 break-words text-sm font-medium"
                        style={{ color: T.ink }}
                      >
                        {o.payment}
                      </p>
                    </div>
                  </div>

                  {/* Items */}

                  <div className="mt-3">
                    <p
                      className="mb-1.5 text-[11px] font-medium uppercase tracking-wide"
                      style={{ color: T.muted }}
                    >
                      Items
                    </p>

                    <div className="space-y-1">
                      {o.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 text-xs"
                          style={{ color: T.ink }}
                        >
                          <span className="min-w-0 truncate">{item.name}</span>

                          <span className="shrink-0" style={{ color: T.muted }}>
                            × {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    <button
                      title="Hold"
                      onClick={() => updateOrderStatus(o.id, "On Hold")}
                      className="flex h-10 items-center justify-center rounded-xl"
                      style={{
                        background: "#F1E9F7",
                        color: "#6B3FA0",
                      }}
                    >
                      <PauseCircle size={17} />
                    </button>

                    <button
                      title="Processing"
                      onClick={() => updateOrderStatus(o.id, "Processing")}
                      className="flex h-10 items-center justify-center rounded-xl"
                      style={{
                        background: "#E8EEFB",
                        color: "#2A4E9C",
                      }}
                    >
                      <Truck size={17} />
                    </button>

                    <button
                      title="Mark delivered"
                      onClick={() => updateOrderStatus(o.id, "Delivered")}
                      className="flex h-10 items-center justify-center rounded-xl"
                      style={{
                        background: "#E6F3E9",
                        color: "#2E7D4F",
                      }}
                    >
                      <CheckCircle2 size={17} />
                    </button>

                    <button
                      title="Cancel"
                      onClick={() => updateOrderStatus(o.id, "Cancelled")}
                      className="flex h-10 items-center justify-center rounded-xl"
                      style={{
                        background: "#FBE7E4",
                        color: "#B23B2E",
                      }}
                    >
                      <XCircle size={17} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div
                  className="px-5 py-10 text-center text-sm"
                  style={{
                    color: T.muted,
                  }}
                >
                  No orders with this status.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}

      {productModal.open && (
        <ProductModal
          product={productModal.editing}
          onClose={() =>
            setProductModal({
              open: false,
              editing: null,
            })
          }
          onSave={saveProduct}
        />
      )}

      {/* Order Drawer */}

      {activeOrder && (
        <OrderDrawer
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}

      {/* Logout Confirmation */}

      {confirmLogout && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{
            background: "rgba(43,33,24,0.45)",
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-5 sm:p-6"
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
            }}
          >
            <h3 className="text-lg font-semibold" style={{ color: T.ink }}>
              Log out of the admin console?
            </h3>

            <p className="mt-1.5 text-sm" style={{ color: T.muted }}>
              You'll need to sign in again to manage products and orders.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmLogout(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium"
                style={{
                  color: T.muted,
                  border: `1px solid ${T.border}`,
                }}
              >
                Stay signed in
              </button>

              <button
                onClick={() => {
                  setConfirmLogout(false);
                  onLogout?.();
                }}
                className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                style={{
                  background: "#B23B2E",
                }}
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
