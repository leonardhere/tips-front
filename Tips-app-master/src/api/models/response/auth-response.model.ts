import { ResponseModel } from "./response.model";

export class AuthResponse extends ResponseModel {
    public token:{token:string, expireDate:string} = {token: '', expireDate: ''};
}