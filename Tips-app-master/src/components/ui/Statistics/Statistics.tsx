import React, { useEffect, useRef, useState } from 'react';
import './Statistics.scss';
import moment from 'moment';
import arrowTopIcon from '../../../assets/images/icons/arrow-top.svg';
import arrowBottomIcon from '../../../assets/images/icons/arrow-bottom.svg';
import { NavLink } from 'react-router-dom';
import { drawChart } from '../Charts/drawChart';
import { targetAPI } from '../../../api/goal';
import { AxiosResponse, AxiosError } from 'axios';
import { GoalResponse } from '../../../api/models/response/goal-response.model';
import { useDispatch, useSelector } from 'react-redux';
import { setGoal } from '../../../store/actions/goal-actions';
import { ReviewsResponse } from '../../../api/models/response/reviews-response.model';

const Statistics = (props:{ ratings: any[] }) => {
    props.ratings.sort((a, b) => a.date - b.date);

    const [windowWidth, setWindowWidth] = useState(document.documentElement.clientWidth);

    const goalState = useSelector((state:any) => state.GoalReducer)
    const paymentsState = useSelector((state:any) => 
                                        state?.ReviewsReducer
                                            .filter((item:ReviewsResponse) => item.isConfirmed)
                                            .map((item:ReviewsResponse) => ({amount: item.summa, date: item.date})))
    const profileState = useSelector((state:any) => state.ProfileReducer)
    const dispatch = useDispatch();

    const [goalReq, doGoalReq] = useState(false)

    // refs to canvases
    const ratingsCanvas = useRef<HTMLCanvasElement>(null);
    const salaryCanvas = useRef<HTMLCanvasElement>(null);
    const goalCanvas = useRef<HTMLCanvasElement>(null);

    const getMiddle = (arr:any[], prop:string) => (arr.reduce((acum, current) => acum + current[prop], 0) / arr?.length).toFixed(2);
    const middleRating = getMiddle(props.ratings, 'rating');
    const middleSalary = getMiddle(paymentsState, 'amount');

    const getGoal = () => {
        targetAPI.getGoal()
            .then((response:AxiosResponse<GoalResponse>) => {
                const goals = response.data;
                const goal = goals;
                if(goal && !goal?.isFinished) {
                    dispatch(setGoal(goal))
                }
            })
            .catch((err:AxiosError) => console.log(err))
    }

    useEffect(() => {
        if (goalState.startDate === '' && !goalReq) {
            getGoal()
            doGoalReq(true)
        }

        document.body.onresize = () => {
            setWindowWidth(document.documentElement.clientWidth)
        }

        drawChart(props.ratings.map(item => ({x: item.date, y: item.rating})), ratingsCanvas, {chartColor: '#FFFFFF'}, 'funcChart', windowWidth - 112);
        paymentsState?.length ? drawChart(paymentsState?.map((item:{date: string, amount: number}) => ({x: +(new Date(item?.date)), y: item?.amount})), salaryCanvas, {chartColor: '#FFFFFF'}, 'funcChart', windowWidth - 112) : null
        !goalState.targetId || isNaN(goalState.userId) ? null : drawChart([goalState.summa, goalState.currentSumma], goalCanvas, {chartColor: ''}, 'pieChart', windowWidth - 112);
    });

    return(
        <React.Fragment>
            {/* <h2>Статистика</h2> */}
            <div className="statistics">
                <div className="statistics-card goal-card">
                    <NavLink to={`/home/goal${goalState.targetId ? '/' + goalState.targetId : ''}`} className="goal-btn"><span></span></NavLink>
                    <h3>Цель {goalState.name}</h3>
                    <p className="date-range">{`${moment(goalState.startDate || new Date(Date.now())).format('DD.MM.gggg')} - ${moment(goalState.endDate || new Date(Date.now())).format('DD.MM.gggg')}`}</p>
                    <canvas ref={goalCanvas} width="140px" height="140px">
                        Your browser don't support canvas.
                    </canvas>
                    <p className="value">&nbsp;{goalState.currentSumma} / <span className="goal-value">{goalState.summa}₽</span></p>
                </div>

                <div className="statistics-card">
                    <h3>Ты уже заработал{profileState?.sex ? 'а' : null}</h3>
                    <p className="date-range">{`${moment(paymentsState[0]?.date).format('DD.MM.gggg')} - ${moment(paymentsState[paymentsState.length-1]?.date).format('DD.MM.gggg')}`}</p>
                    <canvas ref={salaryCanvas} width="350px" height="80px">
                        Your browser don't support canvas.
                    </canvas>
                    <p className="value"><img src={arrowTopIcon} alt=""/>&nbsp;{paymentsState?.reduce((acum:any,curr:any) => acum + curr.amount, 0)}</p>
                </div>

                { !props.ratings || props.ratings.length === 0 ? null : 
                    <div className="statistics-card">
                        <h3>Средняя оценка</h3>
                        <p className="date-range">{`${moment(props.ratings[0].date).format('DD.MM.gggg')} - ${moment(props.ratings[props.ratings.length - 1].date).format('DD.MM.gggg')}`}</p>
                        <canvas ref={ratingsCanvas} width="350px" height="80px">
                            Your browser don't support canvas.
                        </canvas>
                        <p className="value"><img src={arrowTopIcon} alt=""/>&nbsp;{middleRating} <span className="percent"> - middle</span></p>
                    </div>
                }
            </div>
        </React.Fragment>
    );
}

export default Statistics;