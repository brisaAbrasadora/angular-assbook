import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { User } from "../../auth/interfaces/user";
import { UserResponse } from "../../auth/interfaces/responses";
import { ProfilePicture, UserInfo, UserPassword } from "../interfaces/profile";
import { AvatarResponse } from "../interfaces/responses";

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

    updateProfilePicture(profilePicture: ProfilePicture): Observable<string> {
        return this.#http
            .put<AvatarResponse>(`${this.#userUrl}/me/avatar`, profilePicture)
            .pipe(map((resp) => resp.avatar));
    }

    updateProfile(profile: UserInfo): Observable<void> {
        return this.#http
            .put<void>(`${this.#userUrl}/me`, profile);
    }

    updatePassword(password: UserPassword): Observable<void> {
        return this.#http
            .put<void>(`${this.#userUrl}/me/password`, password);
    }
}
