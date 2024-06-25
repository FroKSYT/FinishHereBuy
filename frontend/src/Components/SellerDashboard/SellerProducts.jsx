/*import React, { useEffect, useState } from "react";
import "./SellerDashboard.css";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/seller-products", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch seller products");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || "Error fetching seller products");
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        // Оновити список продуктів після видалення
        setProducts(products.filter((product) => product._id !== productId));
        alert("Product deleted successfully");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="seller-dashboard">
      <h2>My Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Price: ${product.new_price}</p>
              <p>Old Price: ${product.old_price}</p>
              <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;*/
import React, { useEffect, useState } from "react";
import "./SellerDashboard.css";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/seller-products", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch seller products");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || "Error fetching seller products");
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("http://localhost:4000/removeproduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        throw new Error(data.message || "Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="seller-dashboard">
      <h2>My Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-item">
            <img src={product.image} alt={product.name} />
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Category: {product.category}</p>
              <p>Genre: {product.genre}</p>
              <p>Price: {product.new_price}</p>
              <p>Old Price: {product.old_price}</p>
              <p>Seller: {product.sellerName}</p>
              <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;

