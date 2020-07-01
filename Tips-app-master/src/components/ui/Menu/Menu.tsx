import React, { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import './Menu.scss';
import homeIcon from '../../../assets/images/menu/home.svg';
import logo from '../../../assets/images/menu/logo.svg';
import qrIcon from '../../../assets/images/menu/qr.svg';
import privacyIcon from '../../../assets/images/menu/union.svg';
import logoutIcon from '../../../assets/images/logout.svg';
import { link } from 'fs';
import { useDispatch } from 'react-redux';
import { setLogOutState } from '../../../store/actions/auth-actions';

const Menu = (props:{vision:boolean, closeMenu:any}) => {
    const links = [
        { icon: logo, path: '/main', name:'etiquette' },
        { icon: homeIcon, path: '/home', name:'Dashboard' },
        { icon: qrIcon, path: '/home/qr-code', name:'QR-code' },
        { icon: privacyIcon, path: '../../../assets/files/pol.pdf', name:'Conf' }
    ];

    const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('qrcode');
        localStorage.clear();
        history.push('/authorization');
       
        dispatch(setLogOutState());
    }

    useEffect(() => document.body.onresize = () => setWindowWidth(document.documentElement.clientWidth))
    
    return (
        <nav style={props.vision ? {left: 0} : {left: '-100%'}}>
            { windowWidth > 560 ?
                <React.Fragment>
                    <ul>
                        {links.map((link) => 
                            <NavLink exact to={link.path} activeClassName="active-link" key={link.path}><img src={link.icon} alt=""/></NavLink>
                        )}
                        <a onClick={handleLogoutClick}><img src={logoutIcon} alt=""/></a>
                    </ul>
                </React.Fragment> :
                <div className="mobile-menu">
                    <h2>etiquette</h2>
                    <ul>
                        {links.map(link => link.path !== '/main' ?
                            <li key={link.path}>
                                <NavLink exact to={link.path} activeClassName="active-link" onClick={props.closeMenu}>
                                    <img src={link.icon} alt=""/> {link.name}
                                </NavLink>
                            </li> : null
                        )}
                        <li>
                            <a onClick={handleLogoutClick}><img src={logoutIcon} alt=""/> Exit</a>
                        </li>
                    </ul>
                </div>
            }
        </nav>
    ); 
};

export default Menu;