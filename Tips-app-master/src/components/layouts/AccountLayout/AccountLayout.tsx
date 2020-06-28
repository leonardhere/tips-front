import React, { useState } from 'react';
import './AccountLayout.scss';
import { useRouteMatch, useLocation, Switch, Route } from 'react-router';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { RenderModalComponent } from '../../../root/Router';
import Menu from '../../ui/Menu/Menu';
import Sidebar from '../../ui/Sidebar/Sidebar';
import Withdrawal from '../../views/Withdrawal/Withdrawal';
import QRCode from '../../views/QRCode/QRCode';
import Goal from '../../views/Goal/Goal';

const AccountLayout = (props:any) => {
    let location = useLocation();
    const {path} = useRouteMatch();
    const [menu, toggleMenu] = useState(false);

    return(
        <React.Fragment>
            <Menu vision={document.documentElement.clientWidth <= 600 ? menu : true} closeMenu={() => toggleMenu(false)} />
            <Sidebar showMenuComponent={(e:any) => toggleMenu(e)} menuState={menu} />
            <div className="view-container">
                {props.children}
                <TransitionGroup className="transition-group">
                    <CSSTransition
                        key={location.pathname}
                        classNames="show-hide-animation"
                        timeout={300}
                    >
                        <Switch location={location}>
                            <Route path={`${path}/withdrawal`} render={props => RenderModalComponent(<Withdrawal />)} />
                            <Route path={`${path}/qr-code`} render={props => RenderModalComponent(<QRCode />)} />
                            <Route path={`${path}/goal/:id`} render={props => RenderModalComponent(<Goal />)} />
                            <Route path={`${path}/goal`} render={props => RenderModalComponent(<Goal />)} />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </React.Fragment>
    )
}

export default AccountLayout;