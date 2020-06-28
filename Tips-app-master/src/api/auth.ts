import { RegistrationRequest } from './models/request/registration-request.model';
import { AuthResponse } from './models/response/auth-response.model';
import axios, { AxiosResponse } from "axios"
import { environment } from "./environments/environment"
import { RegistrationResponse } from './models/response/registration-response.model';

export const auth = (login:string, password:string):Promise<AxiosResponse<AuthResponse>> => {
    return axios.post(`${environment.apiEndPoint}/Account/AuthWaiter`, {
        login: login,
        password: password
    })
}

export const register = (person:RegistrationRequest):Promise<AxiosResponse<RegistrationResponse>> => {
    return axios.post(`${environment.apiEndPoint}/Account/RegisterWaiter`, {
        ...person
    })
}