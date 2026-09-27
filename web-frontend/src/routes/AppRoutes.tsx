import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Onboarding from "../pages/Onboarding";

import { CartDrawer } from "../pages/Cart";
import AdminDashboard from "../pages/Admin/AdminDashboard";

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Onboarding */}
        <Route path="/" element={<Onboarding />} />

        {/* Main Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />

        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Floating Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default AppRoutes;
