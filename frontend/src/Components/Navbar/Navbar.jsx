/*import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {

  let [menu,setMenu] = useState("shop");
  const {getTotalCartItems} = useContext(ShopContext);

  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='nav'>
      <Link to='/' onClick={()=>{setMenu("shop")}} style={{ textDecoration: 'none' }} className="nav-logo">
        <img src={logo} alt="logo" />
        <p>HereBuy</p>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="" />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={()=>{setMenu("shop")}}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("Key")}}><Link to='/Key' style={{ textDecoration: 'none' }}>Key</Link>{menu==="Key"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("accounts")}}><Link to='/accounts' style={{ textDecoration: 'none' }}>Accounts</Link>{menu==="accounts"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("gift")}}><Link to='/gift' style={{ textDecoration: 'none' }}>Gift</Link>{menu==="gift"?<hr/>:<></>}</li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace("/");}}>Logout</button>
        :<Link to='/login' style={{ textDecoration: 'none' }}><button>Login</button></Link>}
        <Link to="/cart"><img src={cart_icon} alt="cart"/></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar
*/
import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import nav_dropdown from '../Assets/nav_dropdown.png';
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    window.location.replace('/');
  };

  const isLoggedIn = localStorage.getItem('auth-token');
  const userRole = localStorage.getItem('user-role');

  console.log('User Role:', userRole); // Логування ролі користувача

  return (
    <div className='nav'>
      <Link to='/' style={{ textDecoration: 'none' }} className="nav-logo">
        <img src={logo} alt="logo" />
        <p>HereBuy</p>
      </Link>
      <img onClick={dropdown_toggle} className='nav-dropdown' src={nav_dropdown} alt="dropdown" />
      <ul ref={menuRef} className="nav-menu">
        <li><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link></li>
        <li><Link to='/Key' style={{ textDecoration: 'none' }}>Key</Link></li>
        <li><Link to='/Accounts' style={{ textDecoration: 'none' }}>Accounts</Link></li>
        <li><Link to='/Gift' style={{ textDecoration: 'none' }}>Gift</Link></li>
        {isLoggedIn && userRole === 'seller' && (
          <li><Link to='/seller-dashboard' style={{ textDecoration: 'none' }}>Seller Dashboard</Link></li>
        )}
      </ul>
      <div className="nav-login-cart">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to='/login' style={{ textDecoration: 'none' }}>
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart"><img src={cart_icon} alt="cart" /></Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;


