import React, { useState } from "react";
import "./SellerDashboard.css";
import upload_area from "../Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "Accounts",
    new_price: "",
    old_price: "",
    genre: "" // Додано поле для жанру
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Перевірка наявності зображення
      if (!image) {
        alert("Please upload an image");
        return;
      }

      // Завантаження зображення на сервер
      const formData = new FormData();
      formData.append("product", image);

      const uploadResponse = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.image_url;

      // Додавання продукту на сервер
      const productData = {
        ...productDetails,
        image: imageUrl
      };

      const token = localStorage.getItem("auth-token"); // Отримання токену з локального сховища
      const addProductResponse = await fetch("http://localhost:4000/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Передача токену у заголовку Authorization
        },
        body: JSON.stringify(productData)
      });

      if (!addProductResponse.ok) {
        throw new Error("Failed to add product");
      }

      const responseData = await addProductResponse.json();

      if (responseData.success) {
        alert("Product Added Successfully");
        setProductDetails({
          name: "",
          image: "",
          category: "Accounts",
          new_price: "",
          old_price: "",
          genre: "" // Очистити поле жанру після успішного додавання продукту
        });
        setImage(null);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product");
    }
  };

  const handleChange = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
          />
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
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <p>Product category</p>
          <select
            value={productDetails.category}
            name="category"
            className="add-product-selector"
            onChange={handleChange}
          >
            <option value="Key">Key</option>
            <option value="Accounts">Accounts</option>
            <option value="Gift">Gift</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>Product genre</p>
          <select
            value={productDetails.genre}
            name="genre"
            className="add-product-selector"
            onChange={handleChange}
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
          <p>Product image</p>
          <label htmlFor="file-input">
            <img
              className="addproduct-thumbnail-img"
              src={!image ? upload_area : URL.createObjectURL(image)}
              alt=""
            />
          </label>
          <input
            onChange={handleImageChange}
            type="file"
            name="image"
            id="file-input"
            hidden
          />
        </div>
        <button className="addproduct-btn" type="submit">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
