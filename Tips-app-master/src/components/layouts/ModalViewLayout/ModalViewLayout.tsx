import React from 'react';
import './ModalViewLayout.scss'
import { NavLink } from 'react-router-dom';
import checkLoggedIn from '../../../common/checkLoggedIn';

const ModalViewLayout = (props:any) => {

    checkLoggedIn();

    return(
        <div className="modal-view-container">
            <div className="modal-view">
                <NavLink to="/home" className="close-modal-btn"><span></span></NavLink>
                {props.children}
            </div>
        </div>
    );
}

export default ModalViewLayout;