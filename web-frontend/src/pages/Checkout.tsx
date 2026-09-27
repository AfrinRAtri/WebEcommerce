import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Truck,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  X,
  Tag,
  CheckCircle2,
  Loader2,
  Lock,
  type LucideIcon,
} from "lucide-react";

import { useCart } from "./Cart";
import { DEMO_SHOP_PRODUCTS } from "./Shop";

/* ---------- Design tokens (StyleHub brand) ---------- */
const ACCENT = "#C1440E";
const ACCENT_DARK = "#9C3609";
const ACCENT_SOFT = "#F3D9C4";
const CREAM = "#FBF3EA";
const PANEL = "#FFFFFF";
const BORDER = "#EEE1D2";
const INK = "#2B2118";
const MUTED = "#8A7B6C";

/* ---------- Payment ---------- */

type PaymentId = "cod" | "card" | "bkash" | "nagad" | "rocket";

interface PaymentMethod {
  id: PaymentId;
  label: string;
  sub: string;
  icon: LucideIcon;
  dot: string | null;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    sub: "Pay when your order arrives",
    icon: Truck,
    dot: null,
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    sub: "Visa, Mastercard, Amex",
    icon: CreditCard,
    dot: null,
  },
  {
    id: "bkash",
    label: "bKash",
    sub: "Pay with your bKash wallet",
    icon: Smartphone,
    dot: "#E2136E",
  },
  {
    id: "nagad",
    label: "Nagad",
    sub: "Pay with your Nagad wallet",
    icon: Smartphone,
    dot: "#F7941D",
  },
  {
    id: "rocket",
    label: "Rocket",
    sub: "Pay with your Rocket wallet",
    icon: Smartphone,
    dot: "#6B2C91",
  },
];

/* ---------- Form ---------- */

interface FormState {
  name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  note: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  walletNumber: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  address: "",
  area: "",
  city: "",
  note: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  walletNumber: "",
};

/* ---------- Checkout Item ---------- */

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  art: string;
  quantity: number;
}

/* ---------- Currency ---------- */

function taka(n: number): string {
  return "৳" + Math.round(n).toLocaleString("en-IN");
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

export default function CheckoutPage() {
  /* ---------- URL product ---------- */

  const [searchParams] = useSearchParams();

  const productId = searchParams.get("product");

  /* ---------- Cart ---------- */

  const { items: cartItems } = useCart();

  /* ---------- UI states ---------- */

  const [bannerOpen, setBannerOpen] = useState(true);

  const [method, setMethod] = useState<PaymentId>("cod");

  const [promo, setPromo] = useState("");

  const [promoApplied, setPromoApplied] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  /* =========================================================
     FIND SELECTED PRODUCT FROM SHOP
  ========================================================= */

  const selectedProduct = useMemo(() => {
    if (!productId) return null;

    return DEMO_SHOP_PRODUCTS.find((product) => product.id === productId);
  }, [productId]);

  /* =========================================================
     DYNAMIC CHECKOUT ITEMS

     Case 1:
     /checkout?product=p2
     → only p2

     Case 2:
     /checkout
     → all cart products
  ========================================================= */

  const checkoutItems: OrderItem[] = useMemo(() => {
    /* ---------- Order Now ---------- */

    if (selectedProduct) {
      return [
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          art: selectedProduct.art,
          quantity: 1,
        },
      ];
    }

    /* ---------- Cart Checkout ---------- */

    return cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      art: item.art,
      quantity: item.quantity,
    }));
  }, [selectedProduct, cartItems]);

  /* =========================================================
     FORM UPDATE
  ========================================================= */

  const update =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({
        ...f,
        [key]: e.target.value,
      }));

  /* =========================================================
     PRICE CALCULATION
  ========================================================= */

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /* 25% seasonal discount */

  const discount = Math.round(subtotal * 0.25);

  const afterDiscount = subtotal - discount;

  /* Promo discount */

  const promoDiscount = promoApplied ? 200 : 0;

  /* Delivery */

  const shipping = afterDiscount - promoDiscount >= 3000 ? 0 : 80;

  /* Final total */

  const total = afterDiscount - promoDiscount + shipping;

  /* =========================================================
     APPLY PROMO
  ========================================================= */

  const handleApplyPromo = () => {
    if (promo.trim().length > 0) {
      setPromoApplied(true);
    }
  };

  /* =========================================================
     SUBMIT ORDER
  ========================================================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          customer: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.area}, ${form.city}`,

          total: total,

          payment: activeMethod.label,

          items: checkoutItems.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Order failed");
      }

      console.log("Order placed successfully:", data);

      setSubmitted(true);
    } catch (error) {
      console.error("Order Error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing the order.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const activeMethod = PAYMENT_METHODS.find((m) => m.id === method)!;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: CREAM,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }

          70% {
            transform: scale(1.08);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes softPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.05);
          }
        }

        .sh-enter {
          animation:
            fadeSlideUp 0.55s ease both;
        }

        .sh-enter-1 {
          animation-delay: 0.05s;
        }

        .sh-enter-2 {
          animation-delay: 0.12s;
        }

        .sh-enter-3 {
          animation-delay: 0.19s;
        }

        .sh-badge-pulse {
          animation:
            softPulse 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* =====================================================
          OFFER BANNER
      ====================================================== */}

      {bannerOpen && (
        <div
          className="w-full text-center relative overflow-hidden"
          style={{
            backgroundColor: ACCENT,
            animation: "slideDown 0.5s ease both",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 py-2.5 px-10 text-sm">
            <span
              className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold sh-badge-pulse"
              style={{
                backgroundColor: "#fff",
                color: ACCENT,
              }}
            >
              50% OFF
            </span>

            <p className="text-white font-medium tracking-wide">
              নতুন সিজন সেল চলছে — নির্বাচিত পণ্যে ৫০% পর্যন্ত ছাড় ·{" "}
              <span className="font-semibold">
                ৳3,000+ অর্ডারে ফ্রি ডেলিভারি
              </span>
            </p>
          </div>

          <button
            onClick={() => setBannerOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss offer banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="border-b"
        style={{
          borderColor: BORDER,
          backgroundColor: PANEL,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span
            className="text-2xl tracking-tight"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: INK,
            }}
          >
            StyleHub
          </span>

          <div
            className="hidden sm:flex items-center gap-2 text-sm"
            style={{ color: MUTED }}
          >
            <span>Cart</span>

            <ChevronRight size={14} />

            <span className="font-semibold" style={{ color: ACCENT }}>
              Checkout
            </span>

            <ChevronRight size={14} />

            <span>Confirmation</span>
          </div>
        </div>
      </header>

      {/* =====================================================
          SUCCESS
      ====================================================== */}

      {submitted ? (
        <SuccessView total={total} onNewOrder={() => setSubmitted(false)} />
      ) : (
        /* ===================================================
           MAIN CHECKOUT
        ==================================================== */

        <main className="max-w-6xl mx-auto px-6 py-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* =================================================
                TOP ROW
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* =================================================
                  SHIPPING
              ================================================= */}

              <section
                className="sh-enter sh-enter-1 rounded-2xl p-6"
                style={{
                  backgroundColor: PANEL,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: INK }}
                >
                  Shipping details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field
                      label="Full name"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Anika Rahman"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Phone number"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="01XXXXXXXXX"
                      type="tel"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Field
                      label="Address"
                      value={form.address}
                      onChange={update("address")}
                      placeholder="House 12, Road 5, Block A"
                      required
                    />
                  </div>

                  <Field
                    label="Area / Thana"
                    value={form.area}
                    onChange={update("area")}
                    placeholder="Gazipur Sadar"
                    required
                  />

                  <Field
                    label="City"
                    value={form.city}
                    onChange={update("city")}
                    placeholder="Gazipur"
                    required
                  />

                  <div className="sm:col-span-2">
                    <Field
                      label="Delivery note (optional)"
                      value={form.note}
                      onChange={update("note")}
                      placeholder="Landmark, preferred time, etc."
                    />
                  </div>
                </div>
              </section>

              {/* =================================================
                  PAYMENT
              ================================================= */}

              <section
                className="sh-enter sh-enter-2 rounded-2xl p-6"
                style={{
                  backgroundColor: PANEL,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{ color: INK }}
                >
                  Payment method
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;

                    const active = method === m.id;

                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className="text-left rounded-xl p-4 flex items-start gap-3 transition-all duration-200"
                        style={{
                          border: `2px solid ${active ? ACCENT : BORDER}`,

                          backgroundColor: active ? ACCENT_SOFT : "#FAF7F2",

                          transform: active ? "translateY(-2px)" : "none",

                          boxShadow: active
                            ? "0 8px 18px rgba(193,68,14,0.15)"
                            : "none",
                        }}
                      >
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative"
                          style={{
                            backgroundColor: active ? ACCENT : "#fff",

                            border: `1px solid ${active ? ACCENT : BORDER}`,
                          }}
                        >
                          <Icon
                            size={16}
                            color={active ? "#fff" : m.dot || MUTED}
                          />

                          {m.dot && (
                            <span
                              className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full border border-white"
                              style={{
                                backgroundColor: m.dot,
                              }}
                            />
                          )}
                        </span>

                        <span className="flex-1">
                          <span
                            className="block text-sm font-semibold"
                            style={{ color: INK }}
                          >
                            {m.label}
                          </span>

                          <span
                            className="block text-xs mt-0.5"
                            style={{ color: MUTED }}
                          >
                            {m.sub}
                          </span>
                        </span>

                        <span
                          className="w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center"
                          style={{
                            borderColor: active ? ACCENT : "#D8CBB9",
                          }}
                        >
                          {active && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: ACCENT,
                              }}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* =================================================
                    CONDITIONAL PAYMENT FIELDS
                ================================================= */}

                <div
                  className="mt-4 pt-4"
                  style={{
                    borderTop: `1px dashed ${BORDER}`,
                  }}
                >
                  {method === "card" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Field
                          label="Card number"
                          value={form.cardNumber}
                          onChange={update("cardNumber")}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <Field
                        label="Expiry"
                        value={form.expiry}
                        onChange={update("expiry")}
                        placeholder="MM/YY"
                      />

                      <Field
                        label="CVV"
                        value={form.cvv}
                        onChange={update("cvv")}
                        placeholder="123"
                        type="password"
                      />
                    </div>
                  )}

                  {(method === "bkash" ||
                    method === "nagad" ||
                    method === "rocket") && (
                    <Field
                      label={`${activeMethod.label} account number`}
                      value={form.walletNumber}
                      onChange={update("walletNumber")}
                      placeholder="01XXXXXXXXX"
                      type="tel"
                    />
                  )}

                  {method === "cod" && (
                    <p
                      className="text-sm flex items-center gap-2"
                      style={{ color: MUTED }}
                    >
                      <Truck size={16} />
                      You'll pay {taka(total)} in cash when your order is
                      delivered.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <section
              className="sh-enter sh-enter-3 rounded-2xl p-6"
              style={{
                backgroundColor: PANEL,
                border: `1px solid ${BORDER}`,
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: INK }}>
                Order summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
                {/* =================================================
                    DYNAMIC ITEMS
                ================================================= */}

                <div className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {/* Product image */}

                      <div
                        className="w-14 h-14 rounded-lg shrink-0 overflow-hidden"
                        style={{
                          backgroundColor: item.art || "#F3D9CF",
                        }}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full"
                            style={{
                              backgroundColor: item.art,
                            }}
                          />
                        )}
                      </div>

                      {/* Product info */}

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: INK }}
                        >
                          {item.name}
                        </p>

                        <p className="text-xs" style={{ color: MUTED }}>
                          Qty {item.quantity}
                        </p>
                      </div>

                      {/* Product price */}

                      <p
                        className="text-sm font-semibold whitespace-nowrap"
                        style={{ color: INK }}
                      >
                        {taka(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  {/* =================================================
                      PROMO
                  ================================================= */}

                  <div className="flex gap-2 pt-2">
                    <div
                      className="flex-1 flex items-center gap-2 rounded-lg px-3"
                      style={{
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      <Tag size={14} color={MUTED} />

                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Promo code"
                        className="w-full py-2 text-sm bg-transparent outline-none"
                        style={{ color: INK }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 rounded-lg text-sm font-semibold transition-colors"
                      style={{
                        backgroundColor: promoApplied ? "#EFE7DC" : "#F1EAE0",

                        color: INK,
                      }}
                    >
                      {promoApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    TOTALS
                ================================================= */}

                <div>
                  <div
                    className="space-y-2 text-sm mb-4"
                    style={{ color: MUTED }}
                  >
                    <Row label="Subtotal" value={taka(subtotal)} />

                    <Row
                      label="Season discount (25%)"
                      value={`- ${taka(discount)}`}
                      accent
                    />

                    {promoApplied && (
                      <Row
                        label="Promo code"
                        value={`- ${taka(promoDiscount)}`}
                        accent
                      />
                    )}

                    <Row
                      label="Delivery"
                      value={shipping === 0 ? "Free" : taka(shipping)}
                      accent={shipping === 0}
                    />
                  </div>

                  {/* Total */}

                  <div
                    className="flex items-center justify-between py-4"
                    style={{
                      borderTop: `1px solid ${BORDER}`,
                    }}
                  >
                    <span className="font-semibold" style={{ color: INK }}>
                      Total
                    </span>

                    <span
                      className="text-xl font-bold"
                      style={{ color: ACCENT }}
                    >
                      {taka(total)}
                    </span>
                  </div>

                  {/* =================================================
                      PLACE ORDER
                  ================================================= */}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full py-3.5 flex items-center justify-center gap-2 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-80"
                    style={{
                      backgroundColor: submitting ? ACCENT_DARK : ACCENT,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Placing your order...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Place order · {taka(total)}
                      </>
                    )}
                  </button>

                  {/* Secure */}

                  <p
                    className="flex items-center justify-center gap-1.5 text-xs mt-3"
                    style={{ color: MUTED }}
                  >
                    <ShieldCheck size={14} />
                    Safe & secure checkout
                  </p>
                </div>
              </div>
            </section>
          </form>
        </main>
      )}
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

interface FieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FieldProps) {
  return (
    <label className="block">
      <span
        className="block text-xs font-medium mb-1.5"
        style={{ color: MUTED }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors"
        style={{
          border: `1px solid ${BORDER}`,
          color: INK,
          backgroundColor: "#FCFAF7",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
        onBlur={(e) => (e.currentTarget.style.borderColor = BORDER)}
      />
    </label>
  );
}

/* =========================================================
   ROW
========================================================= */

interface RowProps {
  label: string;
  value: string;
  accent?: boolean;
}

function Row({ label, value, accent }: RowProps) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>

      <span
        style={{
          color: accent ? "#3F7D4F" : INK,
          fontWeight: accent ? 600 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   SUCCESS VIEW
========================================================= */

interface SuccessViewProps {
  total: number;
  onNewOrder: () => void;
}

function SuccessView({ total, onNewOrder }: SuccessViewProps) {
  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      <div
        className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: ACCENT_SOFT,
          animation: "popIn 0.5s ease both",
        }}
      >
        <CheckCircle2 size={40} color={ACCENT} />
      </div>

      <h1
        className="text-2xl font-semibold mb-2"
        style={{
          color: INK,
          fontFamily: "Georgia, serif",
        }}
      >
        অর্ডার সম্পন্ন হয়েছে!
      </h1>

      <p className="text-sm mb-1" style={{ color: MUTED }}>
        Your order of{" "}
        <span
          style={{
            color: ACCENT,
            fontWeight: 600,
          }}
        >
          {taka(total)}
        </span>{" "}
        has been placed successfully.
      </p>

      <p className="text-sm mb-8" style={{ color: MUTED }}>
        We'll send delivery updates to your phone number shortly.
      </p>

      <button
        onClick={onNewOrder}
        className="rounded-full px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          backgroundColor: ACCENT,
        }}
      >
        Continue shopping
      </button>
    </main>
  );
}
