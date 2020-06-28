import React from 'react';
import "./PreLoader.scss";

const PreLoader = () => {
    return (
        <svg className="preloader" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <filter id="goo" width="300%" height="300%" x="-100%" y="-100%">
                <feGaussianBlur className="blurValue" in="SourceGraphic" stdDeviation="20" result="blur"></feGaussianBlur>
                <feColorMatrix className="matrix" in="blur" mode="matrix" values="1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,23,-7"></feColorMatrix>
            </filter>
            <g className="blurGroup" filter="url(#goo)" fill="#0074D9">
                <circle className="ball ball-1" cx="200" cy="400" r="15"></circle>
                <circle className="ball ball-2" cx="400" cy="400" r="15"></circle>
                <circle className="ball ball-3" cx="600" cy="400" r="15"></circle>
            </g>
        </svg>
    );
}

export default PreLoader;