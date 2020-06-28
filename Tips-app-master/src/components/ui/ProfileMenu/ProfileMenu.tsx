import React from 'react';
import './ProfileMenu.scss';
import { NavLink, useHistory } from 'react-router-dom';

const ProfileMenu = (props:{closeMenu:any}) => {
    const history = useHistory();
    const handleLogoutClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expireDate');
        localStorage.removeItem('qrcode');
        localStorage.clear();
        history.push('/authorization');
    }

    return(
        <div className="profile-menu">
            <NavLink to="/home" onClick={() => props.closeMenu()}>View Stats</NavLink>
            <NavLink to="/profile"  onClick={() => props.closeMenu()}>Edit Profile</NavLink>
            {/* <NavLink to="/profile">Settings</NavLink> */}
            <a onClick={handleLogoutClick}>Logout</a>
        </div>
    );
}

export default ProfileMenu;