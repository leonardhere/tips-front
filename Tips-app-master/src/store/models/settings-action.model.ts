import { Restaurant } from './../../api/models/response/registration-response.model';
import { Person } from "../../api/models/response/registration-response.model";

export interface SetProfileData {
    userID: number;
    restaurant:Restaurant;
    person:Person;
}