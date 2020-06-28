import axios, { AxiosResponse } from 'axios';
import { environment } from './environments/environment';
import { OrderResponse } from './models/response/order-response.model';


export const OrderAPI = {
    replenish(id: number, amount: number, rating:number, review: string):Promise<AxiosResponse<OrderResponse>> {
        return axios.post(`${environment.apiEndPoint}/Order/Replenishment`, {
                waiterId: id,
                rating: rating,
                text: review,
                summa: amount
            }
        )
    },
    
    successPayment(data:string, signature: string, v:string):Promise<AxiosResponse> {
        return axios.post(`${environment.apiEndPoint}/Wallet/Withdraw`, {
            data: data,
            signature: signature,
            version: v
        },
        {
            headers: { 'Authorization' : localStorage.getItem('token') }
        })
    }
}