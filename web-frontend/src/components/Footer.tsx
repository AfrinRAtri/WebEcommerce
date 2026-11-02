import { useState } from "react";

const BRAND = "StyleHub";

const shopLinks = [
  { label: "All Products", href: "/products" },
  { label: "Find Your Perfect Fit", href: "/find-your-fit" },
  { label: "New Arrivals", href: "/products?sort=new" },
  { label: "Sale", href: "/products?sale=true" },
];

const categoryLinks = [
  { label: "Dresses", href: "/category/dresses" },
  { label: "Shoes", href: "/category/shoes" },
  { label: "Bags & Accessories", href: "/category/accessories" },
];

const helpLinks = [
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact Us", href: "/contact" },
];

const promises = [
  { title: "Best price ever", text: "Up to 50% off on selected styles" },
  { title: "Premium quality", text: "Fabrics and finishes we stand behind" },
  { title: "Safe & fast delivery", text: "Free shipping on orders over $75" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-serif text-lg text-[#3b2a20]">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-[#7a6455] transition-colors hover:text-[#c2570c] focus-visible:text-[#c2570c] focus-visible:outline-none focus-visible:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    // TODO: connect to your newsletter API
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-[#fdf3ea] to-[#f8e4d3] text-[#3b2a20]">
      {/* Promise strip */}
      <div className="border-y border-[#ecd3bf]">
        <ul className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:grid-cols-3">
          {promises.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#c2570c]"
              />
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-sm text-[#7a6455]">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main */}
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="font-serif text-3xl font-semibold text-[#c2570c]">
            {BRAND}
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#7a6455]">
            Find something that feels like you.
          </p>

          <p className="mt-8 text-sm font-semibold">
            Get sale alerts and new arrivals
          </p>
          <div className="mt-3 flex max-w-sm overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[#ecd3bf] focus-within:ring-2 focus-within:ring-[#c2570c]">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSubscribed(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Your email address"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm placeholder:text-[#b09a8a] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSubscribe}
              className="m-1 rounded-full bg-gradient-to-b from-[#d4680f] to-[#b04a08] px-5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b2a20]"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-2 h-5 text-xs text-[#b04a08]" role="status">
            {subscribed ? "Thanks! You're on the list." : ""}
          </p>
        </div>

        <LinkColumn title="Shop" links={shopLinks} />
        <LinkColumn title="Categories" links={categoryLinks} />
        <LinkColumn title="Help" links={helpLinks} />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#ecd3bf]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-[#7a6455] sm:flex-row">
          <p>© 2026 {BRAND}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#c2570c]">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-[#c2570c]">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
