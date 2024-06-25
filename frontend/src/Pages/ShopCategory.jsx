/*import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png'
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {

  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = () => { 
    fetch('http://localhost:4000/allproducts') 
            .then((res) => res.json()) 
            .then((data) => setAllProducts(data))
    }

    useEffect(() => {
      fetchInfo();
    }, [])
    
  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p><span>Showing 1 - 12</span> out of 54 Products</p>
        <div className="shopcategory-sort">Sort by  <img src={dropdown_icon} alt="" /></div>
      </div>
      <div className="shopcategory-products">
        {allproducts.map((item,i) => {
            if(props.category===item.category)
            {
              return <Item id={item.id} key={i} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>;
            }
            else
            {
              return null;
            }
        })}
      </div>
      <div className="shopcategory-loadmore">
      <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
*/
import React, { useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Item from "../Components/Item/Item";
import { Link } from "react-router-dom";

const ShopCategory = (props) => {
  const [allproducts, setAllProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const fetchInfo = () => { 
    fetch('http://localhost:4000/allproducts')
      .then((res) => res.json()) 
      .then((data) => setAllProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setSelectedGenres([...selectedGenres, name]);
    } else {
      setSelectedGenres(selectedGenres.filter((genre) => genre !== name));
    }
  };

  const filteredProducts = allproducts.filter((item) => {
    if (props.category !== item.category) return false;
    if (selectedGenres.length === 0) return true;
    return selectedGenres.includes(item.genre);
  });

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p><span>Showing {filteredProducts.length}</span> out of {allproducts.length} Products</p>
        <div className="shopcategory-sort" onClick={() => setShowFilters(!showFilters)}>
          Sort by <img src={dropdown_icon} alt="dropdown icon" />
          {showFilters && (
            <div className="genre-checkboxes">
              <label>
                <input
                  type="checkbox"
                  name="Racing"
                  checked={selectedGenres.includes("Racing")}
                  onChange={handleCheckboxChange}
                />
                Racing
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Shooter"
                  checked={selectedGenres.includes("Shooter")}
                  onChange={handleCheckboxChange}
                />
                Shooter
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Adventure"
                  checked={selectedGenres.includes("Adventure")}
                  onChange={handleCheckboxChange}
                />
                Adventure
              </label>
              <label>
                <input
                  type="checkbox"
                  name="Puzzle"
                  checked={selectedGenres.includes("Puzzle")}
                  onChange={handleCheckboxChange}
                />
                Puzzle
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
      </div>
    </div>
  );
};

export default ShopCategory;
