import { CartProvider } from "./pages/Cart";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  );
}

export default App;
