export class RegistrationRequest {
    constructor(
        public name:string,
        public email:string,
        public restaurantID: number | undefined,
        public password:string,
        public sex: number,
        public address:string
    ) {}
}