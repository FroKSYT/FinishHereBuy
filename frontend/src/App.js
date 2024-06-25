/*import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import account_banner from "./Components/Assets/banner_account.png";
import key_banner from "./Components/Assets/banner_key.png";
import gift_banner from "./Components/Assets/banner_gift.png";
import LoginSignup from "./Pages/LoginSignup";

function App() {

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop category="all" />} />
          <Route path="/Key" element={<ShopCategory banner={key_banner} category="Key" />} />
          <Route path="/Accounts" element={<ShopCategory banner={account_banner} category="Accounts" />} />
          <Route path="/Gift" element={<ShopCategory banner={gift_banner} category="Gift" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
*/
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import ShopCategory from "./Pages/ShopCategory";
import account_banner from "./Components/Assets/banner_account.png";
import key_banner from "./Components/Assets/banner_key.png";
import gift_banner from "./Components/Assets/banner_gift.png";
import LoginSignup from "./Pages/LoginSignup";
import AddProduct from "./Components/AddProduct/AddProduct";
import SellerDashboard from "./Components/SellerDashboard/SellerDashboard"; // Імпортуйте SellerDashboard

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop category="all" />} />
          <Route path="/Key" element={<ShopCategory banner={key_banner} category="Key" />} />
          <Route path="/Accounts" element={<ShopCategory banner={account_banner} category="Accounts" />} />
          <Route path="/Gift" element={<ShopCategory banner={gift_banner} category="Gift" />} />
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/seller-dashboard" element={<SellerDashboard />} /> {/* Використовуйте element для SellerDashboard */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;


