import React, { useState } from 'react';
import './SayThx.scss';
import $ from "jquery";
import 'jquery-mask-plugin';
import logo from '../../../assets/images/saythx/logo.png';
import faqIcon from '../../../assets/images/saythx/faq.png';
import closeIcon from '../../../assets/images/saythx/close.svg';
import shadowBg from '../../../assets/images/saythx/shadow.png';
import appleIcon from '../../../assets/images/saythx/apple.svg';
import photoIcon from '../../../assets/images/saythx/photo.jpg';
import greenSpot from '../../../assets/images/saythx/thxGreenSpot.svg';
import blueSpot from '../../../assets/images/saythx/thxBlueSpot.svg';
import { useParams } from 'react-router';
import { OrderAPI } from '../../../api/order';
import { OrderResponse } from '../../../api/models/response/order-response.model';
import { AxiosResponse, AxiosError } from 'axios';
import useFormState from '../../../common/customHooks/useFormState';


const SayThx = () => {

    const { waiterId, photoUrl, name, rest } = useParams();
    const [rating, setRating] = useState(3);
    const review = useFormState('');

    $(document).ready(function() {
        $("#close_question").click(function() {
            $("#question_block").fadeOut(0);
            $("#bg_bg").fadeOut(0);
        });
        $("#bg_bg").click(function() {
            $("#question_block").fadeOut(0);
            $("#bg_bg").fadeOut(0);
        });
        $("#quest_icon").click(function() {
            $("#question_block").fadeIn(0);
            $("#bg_bg").fadeIn(0);
        });
    
        $("#summ_input_input").mask("9999 руб", { placeholder: " " });
        $("#card_data").mask("99 / 99", { placeholder: " " });
        $("#card_cvc").mask("999", { placeholder: " " });
        $("#card_num").mask("9999 9999 9999 9999", { placeholder: " " });
    
    
    
    
    
        $(".one_select").click(function() {
            var a = $(this).data("size");
            var b = ($("#summ_input_input").val() + '').replace('руб', '').replace(' ', '');
            var aa = parseInt(a);
            var bb = parseInt(b);
            if (bb > 1) {
                var c = aa + bb;
            } else {
                var c = aa;
            }
            $("#summ_input_input").val(c + " руб");
    
        });
        $(".one_star").click(function() {
            var a = $(this).data("number");
            setRating(+a);
            $(".one_star").each(function() {
                var b = $(this).data("number");
                if (a >= b) {
                    $(this).addClass("active_star");
                } else {
                    $(this).removeClass("active_star");
                }
            })
        })
    
    });
    
    const cislo = (event:any) => {
        if (event.keyCode < 48 || event.keyCode > 57)
        event.returnValue= false;
    }

    const getReplenishmentLink = (e:React.MouseEvent) => {
        e.preventDefault();
        const sum = ($("#summ_input_input").val() + '').includes('руб') ? +($("#summ_input_input").val() + '').slice(0,-4) : +($("#summ_input_input").val() + '');
        waiterId && sum  && review.value ?
        OrderAPI.replenish(+waiterId, sum, rating, review.value)
            .then((response:AxiosResponse<OrderResponse>) => {
                location.href = response.data.bankUrl;
            })
            .catch((err:AxiosError) => alert(err)) :
        alert('Заполните все поля')
    }

    return(
        <div className="say-thx">
            <img src={greenSpot} className="thx-spot" alt=""/>
            <img src={blueSpot} className="thx-spot" alt=""/>
            <header className="thx-header">
                <div id="logo">
                    {/* <img src={logo} /> */}
                </div>
                <div id="question_btn">
                    <div id="quest_icon">
                        <img src={faqIcon} />
                    </div>
                </div>
            </header>
            <div id="bg_bg"></div>
            <div id="question_block">
                <div id="close_question">
                    <img src={closeIcon} />
                </div>
                <div id="question_block_in">
                    <h3>Ответы на вопросы</h3>
                    <div className="one_question">
                        <p><b>Как оплатить?</b></p>
                        <p>Введите карту и оплатите</p>
                    </div>
                    <div className="one_question">
                        <p><b>Как оплатить?</b></p>
                        <p>Введите карту и оплатите</p>
                    </div>
                </div>
            </div>
            <main className="thx-main">
                <div id="fl_block">
                    <div id="fl_photo">
                        <div id="img_round"><img src={shadowBg} /></div>
                        <img id="img_photo" src={'http://194.177.23.9:555/' + photoUrl} alt="" />
                    </div>
                    <div id="fl_name">
                        {name}
                    </div>
                    <div id="fl_place">
                        {rest}
                    </div>
                </div>
                <div id="send_block">
                    <div id="summ_block">
                        {/* <div id="summ_input"> */}
                            <input type="text" className="main-input" placeholder="Введите сумму" id="summ_input_input" onKeyPress={cislo} />
                        {/* </div> */}
                        <div id="select_more_summ">
                            <div id="select_1" className="one_select" data-size="100">
                                + 100
                            </div>
                            <div id="select_2" className="one_select" data-size="200">
                                + 200
                            </div>
                            <div id="select_3" className="one_select" data-size="300">
                                + 300
                            </div>
                            <div id="select_4" className="one_select" data-size="500">
                                + 500
                            </div>
                        </div>
                    </div>
                    <div id="comment_block">
                        {/* <div id="comment_input"> */}
                            <textarea className="main-input" style={{marginTop: '15px'}} {...review} placeholder="Расскажите нам о своих впечатлениях" />
                        {/* </div> */}
                        <div id="comment_stars">
                            <div className="one_star active_star" data-number="1"></div>
                            <div className="one_star active_star" data-number="2"></div>
                            <div className="one_star active_star" data-number="3"></div>
                            <div className="one_star" data-number="4"></div>
                            <div className="one_star" data-number="5"></div>
                        </div>
                    </div>
                </div>
                <div id="pay_block">
                    {/* <div className="one_pay_block">
                        <label htmlFor="card_num">Card number</label>
                        <input id="card_num" name="card_num" type="text" placeholder="0000 0000 0000 0000" onKeyPress={cislo} />
                    </div>
                    <div className="one_pay_block_1_2 one_pay_block_1_2_left">
                        <div className="one_pay_block">
                            <label htmlFor="card_data">Valid units</label>
                            <input id="card_data" name="card_data" type="text" placeholder="00 / 00" onKeyPress={cislo} />
                        </div>
                    </div>
                    <div className="one_pay_block_1_2">
                        <div className="one_pay_block">
                            <label htmlFor="card_cvc">CVC / CVV</label>
                            <input id="card_cvc" name="card_cvc" type="text" placeholder="000" onKeyPress={cislo} />
                        </div>
                    </div>
                    <div className="one_pay_block_check">
                        <label className="pure-material-checkbox" htmlFor="card_agree">
                            <input type="checkbox" id="card_agree" />
                            <span>Payment Address is the same as the Delivery Address</span>
                        </label>
                    </div> */}
                    <div className="one_pay_block_btn">
                        <button onClick={getReplenishmentLink}>Оплатить картой</button>
                    </div>
                </div>
                {/* <div id="or">or checkout with </div> */}
                <div id="apple_pay_block" hidden = {true}>
                    <div id="apple_pay_btn">
                        <img src={appleIcon} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SayThx;