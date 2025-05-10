import React, { useState } from "react"
import './Navbar.css'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from "react-router-dom"
const Navbar = () => {
    const [menu, setMenu] = useState("shop");
    return (
        <div className="navbar">
            <div className="nav-logo">
                <p>Electronics</p>
            </div>
            <ul className="nav-menu">
                <li onClick={() => { setMenu("shop") }}><Link to='/'>Shop</Link>{menu === "shop" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("monitor") }}><Link to='/monitor'>Monitor</Link>{menu === "monitor" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("cpu") }}><Link to='/cpu'>CPU</Link>{menu === "cpu" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("computer") }}><Link to='/computer'>Computer</Link>{menu === "computer" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("accessories") }}><Link to='/accessories'>Accessories</Link>{menu === "accessories" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("main") }}><Link to='/main'>Mainboard</Link>{menu === "main" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("case") }}><Link to='/case'>Case</Link>{menu === "case" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("power") }}><Link to='/power'>Power</Link>{menu === "power" ? <h /> : <></>}</li>
                <li onClick={() => { setMenu("hardrive") }}><Link to='/hardrive'>Hardrive</Link>{menu === "hardrive" ? <h /> : <></>}</li>
            </ul>
            <div className="nav-login-cart">
                <Link to='/login'><button>Login</button></Link>
                <Link to='/cart'><img src={cart_icon} alt="" /></Link>
                <div className="nav-cart-count">0</div>
            </div>
        </div>
    )
}

export default Navbar;