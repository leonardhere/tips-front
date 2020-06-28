import React, { useState, useEffect } from 'react';
import './AuthLayout.scss';
import blueSpot from '../../../assets/images/landing/blue.svg';
import greenSpot from '../../../assets/images/landing/green.svg';
import graySpot from '../../../assets/images/landing/gray.svg';
import formIcon from '../../../assets/images/landing/form.svg';
import male from '../../../assets/images/landing/auth-bg/male.svg';
import female from '../../../assets/images/landing/auth-bg/female.svg';

const AuthLayout = (props:any) => {

    const [posX, movePosX] = useState(0);
    const [posY, movePosY] = useState(0);
    const [docWidth, setDocWidth] = useState(0);

    const listener = (e:React.MouseEvent) => {
        movePosX((document.documentElement.clientWidth / 2 - e.clientX) / 25)
        movePosY((document.documentElement.clientHeight / 2 - e.clientY) / 25)
    }

    useEffect(() => {
        document.body.onresize = () => {
            setDocWidth(document.documentElement.clientWidth)
        }
    })

    return(
        <React.Fragment>
            <div className="svg-bg">
                <img src={blueSpot} alt="" style={{transform: 'translateX(' + posX/2 + 'px) translateY(' + posY/2 + 'px) rotate(180deg)'}} className="blue-spot" />
                <img src={greenSpot} alt="" style={{transform: 'translateX(' + -posX/2 + 'px) translateY(' + -posY/2 + 'px) rotate(180deg)'}} className="green-spot" />
                <img src={graySpot} alt="" style={{transform: 'translateX(' + -posX/1.5 + 'px) translateY(' + -posY/1.5 + 'px) '}} className="gray-spot" />
                { docWidth > 560 ? 
                    <React.Fragment>
                        <img src={formIcon} alt="" style={{transform: 'translateX(' + -posX + 'px) translateY(' + -posY + 'px)'}} className="form-icon" />
                        <img src={female} alt="" style={{transform: 'translateX(' + posX + 'px) translateY(' + posY + 'px)'}} className="female" />
                        <img src={male} alt="" style={{transform: 'translateX(' + -posX*1.5 + 'px) translateY(' + -posY*1.5 + 'px)'}} className="male" />
                    </React.Fragment> : null}
            </div>
            <div className="auth-component authorization-component" onMouseMove={listener}>
                {props.children}
            </div>
        </React.Fragment>
    );
}

export default AuthLayout;