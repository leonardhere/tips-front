import React, { useState, useEffect } from 'react';
import './Home.scss';
import DefaultTable from '../../ui/DefaultTable/DefaultTable';
import Filter from '../../ui/Filter/Filter';
import Statistics from '../../ui/Statistics/Statistics';
import { useSelector, useDispatch } from 'react-redux';
import { ReviewsResponse } from '../../../api/models/response/reviews-response.model';
import { getReviews, filterReviews } from '../../../api/reviews';
import { AxiosResponse } from 'axios';
import { setReviews } from '../../../store/actions/reviews-actions';
import checkLoggedIn from '../../../common/checkLoggedIn';
import { getProfileData } from '../../../api/profile';
import { ProfileDataResponse } from '../../../api/models/response/profileData-response.model';
import { setProfileData } from '../../../store/actions/settings-actions';
import successIcon from '../../../assets/images/icons/success.svg';

const Home = () => {

    checkLoggedIn();

    const reviews = useSelector((state:any) => state.ReviewsReducer);
    const profileState = useSelector((state:any) => state.ProfileReducer);
    const dispatch = useDispatch();
    const [req, doReq] = useState(false)

    const getProfile = () => {
        getProfileData()
            .then((response:AxiosResponse<ProfileDataResponse>) => {
                dispatch(setProfileData(response.data));
            })
            .catch(err => console.log(err));
    }

    const getReviewsList = () => {
        getReviews()
            .then((response:AxiosResponse<ReviewsResponse[]>) => {
                dispatch(setReviews(response.data));
                doReq(true);
                allDates = [...reviews]?.sort((a,b) => +(new Date(a.date)) - +(new Date(b.date)))
            })
    }

    const filterList = (type:number, startDate:string = '', endDate: string = '') => {
        filterReviews(type, startDate, endDate)
            .then((response:AxiosResponse<ReviewsResponse[]>) => {
                dispatch(setReviews(response.data));
            })
            .catch(err => console.log(err.response));
    }

    useEffect(() => {
        if(reviews?.length === 0 && req === false) {
            getReviewsList();
            if(!profileState.person.name) {
                getProfile();
            }
        }
    });

    let allDates:string[]=[];
    const period:[string, string] = [allDates[0], allDates[allDates.length-1]];

    return(
        <div className="home">
            <Statistics ratings={reviews?.map((item:ReviewsResponse) => ({rating: item.rating, date: new Date(item.date)}))} />
            <div className="table-container">
                <DefaultTable 
                    headings={['Отзыв', 'Рейтинг', 'Дата', 'Сумма', <img src={successIcon} />]}
                    caption="История" list={reviews?.map((item:ReviewsResponse) => ({ review: item.text, rating: item.rating, date: new Date(item.date), sum: item.summa, isConfirmed: item.isConfirmed}))}
                >
                    <Filter filterList={filterList} initialPeriod={period} />
                </DefaultTable>
            </div>
        </div>
    );
}

export default Home;