import { Component, Input, OnInit, inject } from "@angular/core";
import { User } from "../../auth/interfaces/user";
import { BmMapDirective } from "../../bingmaps/bm-map.directive";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { BmMarkerDirective } from "../../bingmaps/bm-marker.directive";
import { RouterLink } from "@angular/router";
import {
    FormControl,
    FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { extensionValidator } from "../../validators/extension.validator";
import { ProfilePicture, UserInfo, UserPassword } from "../interfaces/profile";
import { UserService } from "../services/user.service";
import { CommonModule } from "@angular/common";
import { matchPasswordValidator } from "../../validators/match-password.validator";

@Component({
    selector: "profile-page",
    standalone: true,
    imports: [
        BmMapDirective,
        BmMarkerDirective,
        RouterLink,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: "./profile-page.component.html",
    styleUrl: "./profile-page.component.css",
})
export class ProfilePageComponent implements OnInit {
    @Input() user!: User;

    ngOnInit(): void {
        this.coordinates = {
            latitude: this.user.lat,
            longitude: this.user.lng,
        };
    }

    #formBuilder = inject(NonNullableFormBuilder);
    #userService = inject(UserService);

    coordinates: Coordinates = {
        latitude: 0,
        longitude: 0,
    };
    saved: boolean = false;
    image: FormControl = this.#formBuilder.control(
        "",
        extensionValidator(["jpg", "png", "jpeg", "gif", "bmp"])
    );
    imageForm: FormGroup = this.#formBuilder.group({
        image: this.image,
    });

    email: FormControl = this.#formBuilder.control("", [
        Validators.required,
        Validators.email,
    ]);
    name: FormControl = this.#formBuilder.control("", Validators.required);
    editProfileForm: FormGroup = this.#formBuilder.group({
        email: this.email,
        name: this.name,
    });

    password: FormControl = this.#formBuilder.control("", [
        Validators.required, Validators.minLength(4)
    ]);
    passwordConfirm: FormControl = this.#formBuilder.control(
        "",
        Validators.required
    );
    editPasswordForm: FormGroup = this.#formBuilder.group({
        password: this.password,
        passwordConfirm: this.passwordConfirm,
    }, {
        validators: matchPasswordValidator
    });

    editProfile: boolean = false;
    editPassword: boolean = false;

    updateProfilePicture(event: Event): void {
        const fileInput = event.target as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener("loadend", () => {
            if (!this.image.invalid) {
                const profilePicture: ProfilePicture = {
                    avatar: reader.result as string,
                };
                this.#userService
                    .updateProfilePicture(profilePicture)
                    .subscribe({
                        next: (avatar) => {
                            this.user.avatar = avatar;
                        },
                        error: (err) => {
                            console.error(err.error.message);
                        },
                    });
            }
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

    toggleProfile(): void {
        if (!this.editProfile) {
            this.editProfile = true;
        }
    }

    togglePassword(): void {
        if (!this.editPassword) {
            this.editPassword = true;
        }
    }

    closeEdit(): void {
        if (this.canDeactivate()) {
            this.editPassword = false;
            this.editProfile = false;
            this.email.reset();
            this.name.reset();
            this.password.reset();
            this.passwordConfirm.reset();
        }
    }

    submitEdit(): void {
        if (this.editProfileForm.valid) {
            const profile: UserInfo = {
                name: this.name.value,
                email: this.email.value,
            };

            this.#userService.updateProfile(profile).subscribe({
                next: () => {
                    this.saved = true;
                    this.user.name = profile.name;
                    this.user.email = profile.email;
                    this.closeEdit();
                    this.saved = false;
                },
                error: (error) => {
                    console.error(error.message);
                },
            });
        }
    }

    submitPassword(): void {
        if (this.editPasswordForm.valid) {
            const password: UserPassword = {
                password: this.password.value,
            };

            this.#userService.updatePassword(password).subscribe({
                next: () => {
                    this.saved = true;
                    this.closeEdit();
                    this.saved = false;
                },
                error: (error) => {
                    console.error(error.message);
                },
            });
        }
    }

    canDeactivate(): boolean {
        return (
            this.saved ||
            (!this.editProfileForm.dirty && !this.editPasswordForm.dirty) ||
            confirm("Do you want to leave this page? Changes won't be saved.")
        );
    }
}
