import { ResponseModel } from './response.model';
export class RegistrationResponse extends ResponseModel {
    constructor(
        public userID: number,
        public restaurant: Restaurant,
        public person: Person
    ) {
        super();    
    }
}

export enum SexEnum {
    Man = 0,
    Woman = 1
}

export interface Person {
    name: string;
    email?: any;
    address: string;
    passport?: any;
    photoUrl?: any;
    sex?: number;
}

export interface Restaurant {
    restaurantId: number;
    name: string;
    phoneNumber: string;
    address: string;
    createDate: string;
}