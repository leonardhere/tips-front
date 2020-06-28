import React, { useEffect, useState } from 'react';
import './Landing.scss';
import { NavLink } from 'react-router-dom';
import blueSpot from '../../../assets/images/landing/blue.svg';
import greenSpot from '../../../assets/images/landing/green.svg';
import graySpot from '../../../assets/images/landing/gray.svg';
import formIcon from '../../../assets/images/landing/form.svg';
import male from '../../../assets/images/landing/male.svg';
import female from '../../../assets/images/landing/female.svg';


const Landing = () => {

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

    return (
        <div className="landing" onMouseMove={listener}>
            <img src={blueSpot} alt="" style={{transform: 'translateX(' + posX/2 + 'px) translateY(' + posY/2 + 'px)'}} className="blue-spot" />
            <img src={greenSpot} alt="" style={{transform: 'translateX(' + -posX/2 + 'px) translateY(' + -posY/2 + 'px)'}} className="green-spot" />
            <img src={graySpot} alt="" style={{transform: 'translateX(' + -posX/1.5 + 'px) translateY(' + -posY/1.5 + 'px)'}} className="gray-spot" />
            { docWidth > 576 ?
                <React.Fragment>
                    <img src={formIcon} alt="" style={{transform: 'translateX(' + -posX + 'px) translateY(' + -posY + 'px)'}} className="form-icon" />
                    <img src={female} alt="" style={{transform: 'translateX(' + posX + 'px) translateY(' + posY + 'px)'}} className="female" />
                    <img src={male} alt="" style={{transform: 'translateX(' + -posX*1.5 + 'px) translateY(' + -posY*1.5 + 'px)'}} className="male" />
                </React.Fragment> : null
            }
            <div className="content">
                <header>
                    <NavLink to={'/registration'}>Sign Up</NavLink>
                    <NavLink to={'/authorization'}>Sign In</NavLink>
                </header>
                <h1>etiquette</h1>
                <h2>a simple ways to say thanks</h2>
                <footer>
                    <NavLink to='/privacy'>Privacy</NavLink>
                    <NavLink to='/terms'>Terms</NavLink>
                    <NavLink to='/contacts'>Contacts</NavLink>
                </footer>
            </div>
        </div>
    );
}

export default Landing;