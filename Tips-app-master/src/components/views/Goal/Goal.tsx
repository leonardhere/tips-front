import React, { useState, useEffect } from 'react';
import './Goal.scss';
import useFormState from '../../../common/customHooks/useFormState';
import { CSSTransition } from 'react-transition-group';
import ErrorModal from '../../ui/ErrorModal/ErrorModal';
import { useParams, useHistory } from 'react-router';
import { targetAPI } from '../../../api/goal';
import { AxiosResponse, AxiosError } from 'axios';
import { GoalResponse } from '../../../api/models/response/goal-response.model';
import { useDispatch, useSelector } from 'react-redux';
import { setGoal, editGoalState } from '../../../store/actions/goal-actions';
import moment from 'moment';

const Goal = () => {

    const { id } = useParams();
    const history = useHistory();

    const goalsState = useSelector((state:any) => state.GoalReducer)
    const dispatch = useDispatch();

    const [req, doReq] = useState(false);

    const goalName = useFormState(goalsState?.name);
    const endDate = useFormState(moment(goalsState?.endDate).format('gggg-MM-DD'));
    const sum = useFormState(goalsState?.summa);

    const [error, setError] = useState(false);
    

    const getGoal = () => {
        targetAPI.getGoal()
            .then((response:AxiosResponse<GoalResponse>) => {
                const goals = response.data;
                const goal = goals;
                if(goal && !goal?.isFinished) {
                    dispatch(setGoal(goal))
                    goalName.onChange({target : { value: goal.name }})
                    sum.onChange({target : { value: goal.summa }})
                    endDate.onChange({target : { value: moment(goal.endDate).format('gggg-MM-DD') }})
                }
                doReq(true);
            })
            .catch((err:AxiosError) => console.log(err))
    }

    const createGoal = () => {
        targetAPI.createGoal({
            Name: goalName.value,
            Summa: +sum.value,
            EndDate: `${moment(endDate.value).format('gggg-MM-DD')}T00:00:00.455Z`
        }).then((response:AxiosResponse<GoalResponse>) => {
            history.push('/home/goal/' + response.data.targetId)
        }).catch((err:AxiosError) => {
            setError(true)
            setTimeout(() => setError(false), 3000)
        })
    }

    const editGoal = () => {
        targetAPI.editGoal({
            Name: goalName.value,
            Summa: sum.value,
            EndDate: endDate.value,
            targetID: id ? +id : NaN 
        }).then((response:AxiosResponse<GoalResponse>) => {
            dispatch(editGoalState({name:goalName.value, summa:+sum.value, endDate:endDate.value}))
        }).catch((err:AxiosError) => {
            setError(true)
            setTimeout(() => setError(false), 3000)
        })
    }

    const submitForm = (e:any) => {
        e.preventDefault();
        id ? editGoal() : createGoal();
    }

    useEffect(() => {
        id && !req && !goalsState.name ? getGoal() : null;
    });


    return(
        <form onSubmit={submitForm} className="goal-form">
            <h2>Цель</h2>
            <div className="main-input_with-label">
                <input type="text" name="goal" {...goalName} id="goal" className="main-input" required />
                <label htmlFor="goal" className={goalName.value === '' ? 'null' : 'filled-input_label'}>Название цели</label>
            </div>
            <div className="main-input_with-label">
                <input type="date" name="date" {...endDate}  id="period" className="main-input" required />
                <label htmlFor="period" className={endDate.value === '' ? 'null' : 'filled-input_label'}>Дата</label>
            </div>
            <div className="main-input_with-label">
                <input type="text" name="sum" {...sum} id="sum" className="main-input" required />
                <label htmlFor="sum" className={sum.value === '' ? 'null' : 'filled-input_label'}>Сумма</label>
            </div>
            <button className="main-btn">СОХРАНИТЬ</button>
            <CSSTransition in={error} timeout={300} unmountOnExit classNames="show-hide-animation">
                <div className="error-modal-container"><ErrorModal /></div>
            </CSSTransition>
        </form>
    );
}

export default Goal;