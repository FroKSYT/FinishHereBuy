import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "Accounts",
    new_price: "",
    old_price: "",
    genre: "", 
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Перевірка наявності зображення
      if (!image) {
        alert("Please upload an image");
        return;
      }

      // Перевірка наявності обов'язкових полів
      const { name, genre, category, new_price, old_price } = productDetails;
      if (!name || !genre || !category || !new_price || !old_price) {
        alert("Please fill in all required fields");
        return;
      }

      const formData = new FormData();
      formData.append("productImage", image);
      formData.append("name", name);
      formData.append("genre", genre);
      formData.append("category", category);
      formData.append("new_price", new_price);
      formData.append("old_price", old_price);

      const response = await fetch("http://localhost:4000/admin/addproduct", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();

      if (data.success) {
        alert("Product added successfully");
        setProductDetails({
          name: "",
          category: "Accounts",
          new_price: "",
          old_price: "",
          genre: "", 
        });
        setImage(null);
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again later.");
    }
  };

  return (
    <div className="addproduct">
      <form onSubmit={handleSubmit}>
        <div className="addproduct-itemfield">
          <p>Product title</p>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleChange}
            placeholder="Type here"
            required
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Product genre</p>
          <select
            value={productDetails.genre}
            name="genre"
            className="add-product-selector"
            onChange={handleChange}
            required
          >
            <option value="">Select Genre</option>
            <option value="Racing">Racing</option>
            <option value="Shooter">Shooter</option>
            <option value="Adventure">Adventure</option>
            <option value="Puzzle">Puzzle</option>
            {/* Додайте інші жанри за необхідністю */}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>Product category</p>
          <select
            name="category"
            value={productDetails.category}
            onChange={handleChange}
            className="add-product-selector"
            required
          >
            <option value="Key">Key</option>
            <option value="Accounts">Accounts</option>
            <option value="Gift">Gift</option>
          </select>
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <p>Price</p>
            <input
              type="text"
              name="old_price"
              value={productDetails.old_price}
              onChange={handleChange}
              placeholder="Type here"
              required
            />
          </div>
          <div className="addproduct-itemfield">
            <p>Offer Price</p>
            <input
              type="text"
              name="new_price"
              value={productDetails.new_price}
              onChange={handleChange}
              placeholder="Type here"
              required
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product thumbnail</p>
          <label htmlFor="file-input">
            <img
              className="addproduct-thumbnail-img"
              src={!image ? upload_area : URL.createObjectURL(image)}
              alt="Product Thumbnail"
            />
          </label>
        </div>
        <button type="submit" className="addproduct-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
