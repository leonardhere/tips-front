import React, { useRef, useState, useEffect } from 'react';
import './QRCode.scss';
import QR from 'qrcode';
import { useSelector } from 'react-redux';

const QRCode = () => {
    const profileState = useSelector((state:any) => state.ProfileReducer);
    const qrCanvas = useRef<HTMLCanvasElement>(null);

    const [canvasVision, changeCanvasVision] = useState(false);
    const [qr,setQr] = useState(localStorage.getItem('qrcode'))

    const generateQRCode = (e:React.MouseEvent) => {
        e.preventDefault()
        changeCanvasVision(true);
        const link = encodeURI(`${location.origin}/#/saythx/${profileState.userID}/${profileState.person.photoUrl}/${profileState.person.name}/${profileState.restaurant.name}`);
        setQr(link);
        setTimeout(() => {
            localStorage.setItem('qrcode', link);
            setQr(localStorage.getItem('qrcode'));
            QR.toCanvas(document.getElementById('qrcode-canvas'), link);
        }, 0)
    }

    useEffect(() => {
        !qr ? setQr(localStorage.getItem('qrcode')) : null
        if(qr && !canvasVision) {
            console.log(qr)
            changeCanvasVision(true);
            setTimeout(() => {
                QR.toCanvas(document.getElementById('qrcode-canvas'), qr);
            }, 0)
        }
    })

    return(
        <div className="qr-code">
            <h2>{qr ? 'YOUR QR-CODE IS READY!' : 'LET’S MAKE THE QR-CODE'}</h2>
            {qr ? null : <button className="main-btn" onClick={generateQRCode}>MAKE</button>}
            { canvasVision ? 
                <canvas id="qrcode-canvas" ref={qrCanvas} width={245} height={245}>
                    Your browser don't support canvas.
                </canvas> :
                null
            }
        </div>
    )
}

export default QRCode;