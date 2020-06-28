import axios, { AxiosResponse } from 'axios';
import { environment } from './environments/environment';
import { WalletResponse } from './models/response/order-response.model';


export const WalletAPI = {
    getBalance():Promise<AxiosResponse<WalletResponse>> {
        return axios.get(`${environment.apiEndPoint}/Wallet`, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            }
        })
    },
    
    withdraw(value:number):Promise<AxiosResponse<WalletResponse>> {
        return axios.post(`${environment.apiEndPoint}/Wallet/Withdraw`, {
            balance: value
        },
        {
            headers: { 'Authorization' : localStorage.getItem('token') }
        })
    }
}