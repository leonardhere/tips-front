import React, { useRef, useState, useEffect } from 'react';
import './ModalPass.scss';

const ModalPass = () => {





    return(
        <div className="ModalPass">
            <h2>Сменить пароль</h2>
            <form>
                <div className="main-input_with-label">
                    <input type="text" className="main-input" />
                    <label>Текущий пароль</label>
                </div>
                <div className="main-input_with-label">
                    <input type="text" className="main-input"/>
                    <label>НОВЫЙ ПАРОЛЬ</label>
                </div>
                <div className="main-input_with-label">
                    <input type="text" className="main-input"/>
                    <label>ПОВТОРИТЕ НОВЫЙ ПАРОЛЬ</label>
                </div>
                <button type="submit" className="main-btn">СОХРАНИТЬ</button>
            </form>
        </div>
    )
}

export default ModalPass