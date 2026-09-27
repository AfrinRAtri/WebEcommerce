import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

/**
 * Cart.tsx — everything in one file: cart state (context + hook) and the
 * floating side-cart drawer UI. Wrap your app once with <CartProvider>,
 * render <CartDrawer /> near the root, then call `useCart()` from any
 * product card to add items — the drawer slides open automatically.
 *
 * Drop-in requirements:
 *  - Tailwind CSS with the `ink` / `accent` tokens:
 *      colors: { ink: "#241C15", accent: "#D65A34" }
 *      fontFamily: { serif: ["Fraunces", "ui-serif", "Georgia"], sans: ["Inter", "ui-sans-serif"] }
 *  - lucide-react for icons.
 *
 * Usage:
 *   // App.tsx
 *   <CartProvider>
 *     <Navbar />
 *     <ShopPage />
 *     <CartDrawer onOrderNow={() => navigate("/checkout")} />
 *   </CartProvider>
 *
 *   // inside a product card
 *   const { addItem } = useCart();
 *   <button onClick={() => addItem({ id: p.id, name: p.name, price: p.price, image: p.image, art: p.art })}>
 *     Add to Cart
 *   </button>
 */

/* --------------------------------- Types --------------------------------- */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  /** real product photo URL */
  image?: string;
  /** CSS gradient fallback shown while `image` loads or if it's absent */
  art: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

/* -------------------------------- Context -------------------------------- */

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: Math.min(9, i.quantity + quantity) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: Math.min(9, quantity) }];
    });
    setIsOpen(true); // adding an item is what pops the floating cart open
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(9, quantity) } : i,
      ),
    );
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a <CartProvider>");
  return ctx;
}

/* -------------------------------- Drawer UI ------------------------------- */

interface CartDrawerProps {
  /** called when "Order Now" is pressed with at least one item in the cart */
  onOrderNow?: () => void;
}

export function CartDrawer({ onOrderNow }: CartDrawerProps) {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    closeCart,
  } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  return (
    <>
      {/* backdrop */}
      <div
        className={[
          "fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={closeCart}
      />

      {/* panel */}
      <aside
        aria-hidden={!isOpen}
        className={[
          "fixed inset-y-0 right-0 z-[90] flex w-full max-w-sm flex-col bg-white shadow-[-24px_0_50px_-20px_rgba(36,28,21,0.5)]",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-lg text-ink">
            <ShoppingBag size={18} strokeWidth={1.8} />
            Your Cart
            {totalItems > 0 && (
              <span className="text-sm font-sans text-ink/40">
                ({totalItems})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5 text-ink/30">
                <ShoppingBag size={24} strokeWidth={1.5} />
              </span>
              <p className="text-sm text-ink/45">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div
                    className="h-20 w-16 shrink-0 overflow-hidden rounded-xl"
                    style={{ background: item.art }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug text-ink/85">
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 text-ink/30 transition-colors hover:text-accent"
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/12">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-ink/60 hover:text-accent"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-5 text-center text-xs font-semibold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-ink/60 hover:text-accent"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-accent">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/8 px-5 py-4">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm text-ink/60">Total</span>
              <span className="text-lg font-semibold text-ink">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={onOrderNow}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_-10px_rgba(214,90,52,0.65)] transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
            >
              Order Now
              <ArrowRight size={16} strokeWidth={2.25} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
