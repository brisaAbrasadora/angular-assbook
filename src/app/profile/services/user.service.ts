import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { User } from "../../auth/interfaces/user";
import { UserResponse } from "../../auth/interfaces/responses";

@Injectable({
    providedIn: "root",
})
export class UserService {
    constructor() {}

    #userUrl = "users";
    #http = inject(HttpClient);

    getProfile(id?: number): Observable<User> {
        if (id) {
            return this.#http
                .get<UserResponse>(`${this.#userUrl}/${id}`)
                .pipe(map((resp) => resp.user));
        } else {
            return this.#http
                .get<UserResponse>(`${this.#userUrl}/me`)
                .pipe(map((resp) => resp.user));
        }
    }
}
