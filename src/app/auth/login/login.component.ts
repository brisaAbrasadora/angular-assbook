import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import {
    FormControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { TokenUser, UserLogin } from "../interfaces/user";
import { CommonModule } from "@angular/common";
import { GeolocationService } from "../services/geolocation.service";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { LoadGoogleApiService } from "../google-login/load-google-api.service";
import { Subscription } from "rxjs";
import { GoogleLoginDirective } from "../google-login/google-login.directive";
import { FbLoginDirective } from "../facebook-login/fb-login.directive";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
    selector: "login",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        GoogleLoginDirective,
        FbLoginDirective,
        FaIconComponent
    ],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit, OnDestroy {
    ngOnInit(): void {
        this.#geolocationService.getLocation().subscribe({
            next: (coordinates) => {
                this.#coordinates.latitude = coordinates.latitude;
                this.#coordinates.longitude = coordinates.longitude;
                console.log(
                    "Received coordinates in register:",
                    coordinates.latitude
                );
            },
            error: (error) => {
                console.error("Error getting location in register:", error);
            },
        });

        this.credentialsSub = this.#loadGoogle.credential$.subscribe((resp) => {
            const googleUser: TokenUser = {
                token: resp.credential,
                lat: this.#coordinates.latitude,
                lng: this.#coordinates.longitude,
            };
            console.log(googleUser);
            this.#authService.loginGoogle(googleUser).subscribe({
                next: () => {
                    this.#router.navigate(["/posts"]);
                },
                error: (err) => {
                    console.error(err.error.message);
                },
            });
        });
    }

    ngOnDestroy(): void {
        this.credentialsSub.unsubscribe();
    }

    iconFacebook = faFacebook;
    #formBuilder = inject(NonNullableFormBuilder);
    #router = inject(Router);
    #authService = inject(AuthService);
    #geolocationService = inject(GeolocationService);
    #loadGoogle = inject(LoadGoogleApiService);

    credentialsSub!: Subscription;
    email: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
        Validators.email,
    ]);
    password: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
    ]);
    #coordinates: Coordinates = {
        latitude: 0,
        longitude: 0,
    };

    loginForm = this.#formBuilder.group({
        email: this.email,
        password: this.password,
    });

    login() {
        const data: UserLogin = {
            ...this.loginForm.getRawValue(),
            lat: this.#coordinates.latitude,
            lng: this.#coordinates.longitude,
        };

        console.log(data);
        this.#authService.login(data).subscribe({
            next: () => {
                this.#router.navigate(["/posts"]);
            },
            error: (err) => {
                console.error(err.message);
            },
        });
    }

    validClasses(
        control: FormControl,
        validClass: string,
        errorClass: string
    ): { [key: string]: boolean } {
        return {
            [validClass]: control.touched && control.valid && control.value,
            [errorClass]: control.touched && control.invalid,
        };
    }

    loggedFacebook(resp: fb.StatusResponse) {
        const facebookUser: TokenUser = {
            token: resp.authResponse.accessToken!,
            lat: this.#coordinates.latitude,
            lng: this.#coordinates.longitude,
        };
        console.log(facebookUser);
        this.#authService.loginFacebook(facebookUser).subscribe({
            next: () => {
                this.#router.navigate(["/posts"]);
            },
            error: (err) => {
                console.error(err.error.message);
            },
        });
    }

    showError(error: string) {
        console.error(error);
    }
}
