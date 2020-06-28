import React, { useState } from 'react';
import './FAQ.scss';
import toggleIcon from '../../../assets/images/icons/faq-toggle-icon.svg';
import { CSSTransition } from 'react-transition-group';

const FAQ = () => {

    const initialQuestions:{question:string,answer:string,isOpen:boolean}[] = [
        { question: 'Как выводить деньги ?', answer: 'Какие деньги?', isOpen: false }
    ];
    const [questions, setQuestions] = useState(initialQuestions);

    const toggleQuestion = (i:number) => {
        const st = [...questions]
        st[i].isOpen = !st[i].isOpen;
        setQuestions(st);
    }

    return(
        <React.Fragment>
            <h2>FAQ</h2>
            <div className="faq">
                {questions.map((item, index) => <div className="question" key={index}>
                    <button onClick={() => toggleQuestion(index)}>{item.question} <img src={toggleIcon} alt=""/></button>
                    <CSSTransition in={item.isOpen} timeout={300} unmountOnExit classNames="show-hide-animation">
                        <p>{item.answer}</p>
                    </CSSTransition>
                </div>)}
                <h3>Не нашли ответ, напишите в поддержку.</h3>
                <input type="text" name="" id="" placeholder="Ваше сообщение" />
                <button className="main-btn">Задать вопрос</button>
            </div>
        </React.Fragment>
    );
}

export default FAQ;