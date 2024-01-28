import { HttpClient } from "@angular/common/http";
import {
    Injectable,
    Signal,
    WritableSignal,
    inject,
    signal,
} from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";
import { User, UserLogin } from "../interfaces/user";
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

    getLocation(): Observable<GeolocationCoordinates> {
        return new Observable<GeolocationCoordinates>((observer) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    observer.next(pos.coords);
                    observer.complete();
                },
                (error) => {
                    switch (error.code) {
                    case error.PERMISSION_DENIED: // User didn't allow the web page to retrieve location
                        observer.error("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE: // Couldn't get the location
                        observer.error("Location information is unavailable.");
                        break;
                    case error.TIMEOUT: // The maximum amount of time to get location information has passed
                        observer.error(
                            "The request to get user location timed out."
                        );
                        break;
                    default:
                        observer.error("An unknown error occurred.");
                        break;
                    }
                }
            );
        });
    }

    // Missing login with Google

    // Missing login with Facebook
}
