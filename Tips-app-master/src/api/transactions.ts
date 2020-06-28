import { TransactionsResponse } from './models/response/transactions-response.model';
import { AxiosResponse } from 'axios';
import axios from 'axios';
import { environment } from './environments/environment';


export const TransactionsAPI = {
    getTransactions():Promise<AxiosResponse<TransactionsResponse[]>> {
        return axios.get(`${environment.apiEndPoint}/Transaction/GetTransactions`, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            }
        })
    },

    getCurrentMonthTransactions():Promise<AxiosResponse<TransactionsResponse[]>> {
        return axios.get(`${environment.apiEndPoint}/Transaction/GetTransactionsCurrentMonth`, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            }
        })
    }
}