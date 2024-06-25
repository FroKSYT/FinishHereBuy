import React from "react";
import AddProduct from "../AddProduct/AddProduct";
import SellerProducts from "./SellerProducts";
import "./SellerDashboard.css";

const SellerDashboard = () => {
  return (
    <div className="seller-dashboard">
      <h1>Seller Dashboard</h1>
      <div className="dashboard-content">
        <div className="add-product-section">
          <h2>Add New Product</h2>
          <AddProduct />
        </div>
        <div className="seller-products-section">
          <SellerProducts />
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
