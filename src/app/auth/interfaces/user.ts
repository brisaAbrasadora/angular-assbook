export interface UserLogin {
    email: string;
    password: string;
    lat?: number;
    lng?: number;
}

export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    lat: number;
    lng: number;
    me?: boolean;
}

export interface TokenUser {
    token: string;
    lat?: number;
    lng?: number;
}
