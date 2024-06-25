import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from '../Assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/admin/allproducts');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setAllProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const removeProduct = async (id) => {
    try {
      const response = await fetch('http://localhost:4000/admin/removeproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove product');
      }

      const data = await response.json();

      if (data.success) {
        alert('Product removed successfully');
        fetchProducts(); // Оновлення списку продуктів після видалення
      } else {
        alert('Failed to remove product');
      }
    } catch (error) {
      console.error('Error removing product:', error);
      alert(`Failed to remove product: ${error.message}`);
    }
  };

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Seller Name</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Genre</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.length > 0 ? (
          allProducts.map((product) => (
            <div key={product._id}>
              <div className="listproduct-format-main listproduct-format">
                <img className="listproduct-product-icon" src={product.image} alt="" />
                <p className="cartitems-product-title">{product.name}</p>
                <p className="listproduct-sellername">{product.sellerName}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <p>{product.genre}</p>
                <img
                  onClick={() => removeProduct(product._id)}
                  className="listproduct-remove-icon"
                  src={cross_icon}
                  alt="Remove"
                />
              </div>
              <hr />
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ListProduct;
