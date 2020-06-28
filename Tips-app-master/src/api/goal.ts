import { EditGoalRequest } from './models/request/editGoal-request.model';
import { environment } from './environments/environment';
import axios from 'axios';
import { GoalResponse } from './models/response/goal-response.model';
import { AxiosResponse } from 'axios';
import { CreateGoalRequest } from './models/request/createGoal-request.model';
export const targetAPI = {
    createGoal: (goal:CreateGoalRequest):Promise<AxiosResponse<GoalResponse>> => {
        return axios.post(`${environment.apiEndPoint}/Target/CreateTarget`, null, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            },
            params: {...goal}
        });
    },

    editGoal: (goal:EditGoalRequest):Promise<AxiosResponse<GoalResponse>> => {
        return axios.get(`${environment.apiEndPoint}/Target/EditTarget`, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            },
            params: {...goal}
        });
    },

    getGoal: ():Promise<AxiosResponse<GoalResponse>> => {
        return axios.get(`${environment.apiEndPoint}/Target/GetTarget`, {
            headers: {
                'Authorization' : localStorage.getItem('token')
            }
        });
    },
}