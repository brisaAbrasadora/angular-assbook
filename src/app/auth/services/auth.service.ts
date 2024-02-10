import { HttpClient } from "@angular/common/http";
import {
    Injectable,
    Signal,
    WritableSignal,
    inject,
    signal,
} from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { TokenUser, User, UserLogin } from "../interfaces/user";
import { TokenResponse, UserResponse } from "../interfaces/responses";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor() {}

    #logged: WritableSignal<boolean> = signal(false);
    #authUrl = "auth";
    #http = inject(HttpClient);

    get logged(): Signal<boolean> {
        return this.#logged.asReadonly();
    }

    login(data: UserLogin): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/login`, data)
            .pipe(
                map((resp) => {
                    localStorage.setItem("token", resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }

    logout(): void {
        localStorage.removeItem("token");
        this.#logged.set(false);
    }

    isLogged(): Observable<boolean> {
        if (this.logged()) {
            console.log("logged google");
            return of(true);
        } else {
            if (localStorage.getItem("token")) {
                return this.#http
                    .get<TokenResponse>(`${this.#authUrl}/validate`)
                    .pipe(
                        map(() => {
                            this.#logged.set(true);
                            return true;
                        }),
                        catchError(() => {
                            localStorage.removeItem("token");
                            return of(false);
                        })
                    );
            }
            return of(false);
        }
    }

    register(data: User): Observable<User> {
        return this.#http
            .post<UserResponse>(`${this.#authUrl}/register`, data)
            .pipe(map((resp) => resp.user));
    }

    loginGoogle(data: TokenUser): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/google`, data)
            .pipe(
                map((resp) => {
                    localStorage.setItem("token", resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }

    loginFacebook(data: TokenUser): Observable<void> {
        return this.#http
            .post<TokenResponse>(`${this.#authUrl}/facebook`, data)
            .pipe(
                map((resp) => {
                    localStorage.setItem("token", resp.accessToken);
                    this.#logged.set(true);
                })
            );
    }
}
