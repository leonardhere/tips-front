import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import creditCardIcon from '../../../assets/images/sidebar/credit-card.svg';
import { CSSTransition } from 'react-transition-group';
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AvatarResponse } from '../../../api/models/response/avatar-response.model';
import { AxiosResponse } from 'axios';
import { getAvatar } from '../../../api/photo';
import { setAvatarState } from '../../../store/actions/settings-actions';

const Sidebar = (props:any) => {

    const profileState = useSelector((state:any) => state.ProfileReducer);
    const dispatch = useDispatch();

    const [req, doReq] = useState(false);

    const [clientWidth, changeClientWidth] = useState(document.documentElement.clientWidth);
    const [wallet, walletVision] = useState(false);
    const [profileMenu, profileMenuVision] = useState(false);

    const getPhoto = () => {
        getAvatar()
            .then((response:AxiosResponse<AvatarResponse>) => {
                dispatch(setAvatarState({photoUrl: response.data.url}))
            })
            .catch(err => console.log(err));
        doReq(true)
    }

    // Handlers
    const showMenu = () => {
        props.showMenuComponent(!props.menuState);
        profileMenu && profileMenuVision(false)
        wallet && walletVision(false)
    }

    const showProfileMenu = () => {
        profileMenuVision(!profileMenu)
        wallet && walletVision(false)
    }

    useEffect(() => {
        if(profileState.person.photoUrl == undefined && !req) {
            getPhoto();
        }
        window.addEventListener('resize', () => {
            changeClientWidth(document.documentElement.clientWidth);
        })
    })

    return (
        <div className="sidebar">

            <NavLink to="/home/withdrawal" className="withdrawal-btn"><img src={creditCardIcon} alt=""/> { clientWidth > 576 ? 'Transfer HUB' : null }</NavLink>

            <button className="activity-btn" />

            {/* Profile Menu */}
            <div className="profile-menu-toggle" onClick={showProfileMenu}>
                <img src={'https://etiquette.ms:230/' + profileState.person.photoUrl} alt="" className="avatar"/>
                {/* <img src={profileToggleIcon} alt=""/> */}
            </div>
            <div className="profile-menu-container">
                <CSSTransition in={profileMenu} timeout={300} unmountOnExit classNames="show-hide-animation">
                    <ProfileMenu closeMenu={() => showProfileMenu()} />
                </CSSTransition>
            </div>

            {/* Mobile Menu toggle-btn */}
            {
                clientWidth <= 600 ? 
                    <button onClick={showMenu} className={props.menuState ? 'burger-menu-btn burger-menu-btn__active':'burger-menu-btn'}><span></span><span></span><span></span></button> :
                    null
            }
        </div>
    );
}

export default Sidebar;