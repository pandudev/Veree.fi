import React from 'react'
import { NavLink } from 'react-router-dom';
import { Capitalize } from '../../../utils/capitalize';
import './Navbar.scss';
import logo from './../../../assets/img/vereefi.png';

const Navbar = ({url, navItems, user, logout}) => {

    return (
        <nav className="navbar">
            <div className="container navbar__wrapper">
                <NavLink to="/" className="navbar__brand">
                    <img src={logo} alt="vereefi" />
                </NavLink>
                <ul className="navbar__menu">
                    {
                        navItems.map((item, index) => (
                            <li key={index}>
                            <NavLink  to={`${url}/${item}`} activeClassName="active">{Capitalize(item)}</NavLink>
                        </li>
                        ))
                    }
                </ul>
                {
                    user ? (<button className="navbar__logout" onClick={() => logout()}>Logout</button>) : null
                }
                
            </div>

        </nav>
    )
}

export default Navbar
