import { AvatarResponse } from './models/response/avatar-response.model';
import axios, { AxiosResponse } from 'axios';
import { environment } from './environments/environment';

export const setAvatar = (avatar:FormData):Promise<AxiosResponse<AvatarResponse>> => {
    console.log(avatar)
    return axios.post(`${environment.apiEndPoint}/Photo/CreatePhoto`, avatar, {
        headers: {
            'Authorization' : localStorage.getItem('token'),
            'content-type': 'multipart/form-data'
        }
    })
}

export const getAvatar = ():Promise<AxiosResponse<AvatarResponse>> => {
    return axios.get(`${environment.apiEndPoint}/Photo/GetPhoto`,{ headers: {
        'Authorization' : localStorage.getItem('token')
    } })
}