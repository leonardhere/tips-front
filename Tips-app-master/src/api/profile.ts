import axios, { AxiosResponse } from "axios";
import { ProfileDataResponse } from "./models/response/profileData-response.model";
import { environment } from "./environments/environment";
import { Person } from "./models/response/registration-response.model";

export const getProfileData = ():Promise<AxiosResponse<ProfileDataResponse>> => {
    return axios.get(`${environment.apiEndPoint}/Profile`, {
        headers: {
            'Authorization' : localStorage.getItem('token')
        }
    })
}

export const editProfileData = (restaurantID:number, profile:Person):Promise<AxiosResponse<ProfileDataResponse>> => {
    return axios.post(`${environment.apiEndPoint}/Profile/Edit`, {
        restrauntID: restaurantID,
        ...profile
    }, 
    {
        headers: {
            'Authorization' : localStorage.getItem('token')
        }
    })
}