import axios, { AxiosResponse } from 'axios';
import { environment } from './environments/environment';
import { ReviewsResponse } from './models/response/reviews-response.model';

export const getReviews = ():Promise<AxiosResponse<ReviewsResponse[]>> => {
    return axios.get(`${environment.apiEndPoint}/Comment/GetComments`, {
        headers: {
            'Authorization' : localStorage.getItem('token')
        }
    })
}

export const filterReviews = (type:number = 3, firstDate?:string, secondDate?:string):Promise<AxiosResponse<ReviewsResponse[]>> => {
    return axios.get(`${environment.apiEndPoint}/Comment/GetCommentsToFilter`, {
        params: type > 2 ? {
            FirstDate: firstDate,
            SecondDate: secondDate
        } : {
            Type: type
        },
        headers: {
            'Authorization' : localStorage.getItem('token')
        }
    })
}