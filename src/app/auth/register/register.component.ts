import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import {
    FormControl,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { extensionValidator } from "../../validators/extension.validator";
import { User } from "../interfaces/user";
import { AuthService } from "../services/auth.service";
import { Router, RouterLink } from "@angular/router";
import { matchEmailValidator } from "../../validators/match-email.validator";
import { GeolocationService } from "../services/geolocation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CanComponentDeactivate } from "../../interfaces/can-component-deactivate";
import { ConfirmModalComponent } from "../../modals/confirm-modal/confirm-modal.component";

@Component({
    selector: "register",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit, CanComponentDeactivate {
    ngOnInit(): void {
        this.#geolocationService.getLocation().subscribe({
            next: (coordinates) => {
                this.latitude.setValue(coordinates.latitude);
                this.longitude.setValue(coordinates.longitude);
                console.log("Received coordinates in register:", coordinates.latitude);
            },
            error: (error) => {
                console.error("Error getting location in register:", error);
                this.latitude.setValue(0);
                this.longitude.setValue(0);
            },
        });
    }

    #formBuilder = inject(NonNullableFormBuilder);
    #authService = inject(AuthService);
    #router = inject(Router);
    #modalService = inject(NgbModal);
    #geolocationService = inject(GeolocationService);
    saved: boolean = false;

    avatarBase64: string = "";

    name: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
    ]);
    email: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
        Validators.email,
    ]);
    emailConfirm: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
        Validators.email,
    ]);
    password: FormControl<string> = this.#formBuilder.control("", [
        Validators.required,
        Validators.minLength(4),
    ]);
    avatar: FormControl = this.#formBuilder.control("", [
        Validators.required,
        extensionValidator(["png", "jpg", "jpeg"]),
    ]);
    latitude: FormControl<number | undefined> = this.#formBuilder.control(undefined);
    longitude: FormControl<number | undefined> = this.#formBuilder.control(undefined);

    emailGroup = this.#formBuilder.group(
        {
            email: this.email,
            emailConfirm: this.emailConfirm,
        },
        { validators: matchEmailValidator }
    );

    registerForm = this.#formBuilder.group({
        name: this.name,
        emailGroup: this.emailGroup,
        password: this.password,
        latitude: this.latitude,
        longitude: this.longitude,
        avatar: this.avatar,
    });

    constructor() {
        this.resetForm();
    }

    resetForm(): void {
        this.registerForm.reset();
    }

    register(): void {
        if (this.registerForm.valid) {
            const user: User = {
                name: this.name.getRawValue(),
                email: this.email.getRawValue(),
                password: this.password.getRawValue(),
                avatar: this.avatarBase64,
                lat: this.latitude.getRawValue() as number,
                lng: this.longitude.getRawValue() as number,
            };

            this.#authService.register(user).subscribe({
                next: () => {
                    this.saved = true;
                    this.#router.navigate(["/login"]);
                },
                error: (error) => {
                    console.error(error);
                },
            });
        }
    }

    changeImage(event: Event): void {
        const fileInput = event.target as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener("loadend", () => {
            this.avatarBase64 = reader.result as string;
        });

        if (this.avatar.invalid) {
            this.avatarBase64 = "";
        }
    }

    resetImage(): void {
        this.avatar.reset();
        this.avatarBase64 = "";
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

    // canDeactivate(): boolean {
    //     return (
    //         this.saved ||
    //         !this.registerForm.dirty ||
    //         confirm("Do you want to leave this page? Post won't be saved.")
    //     );
    // }
    
    canDeactivate() {
        if (this.saved || this.registerForm.pristine) {
            return true;
        }
        const modalRef = this.#modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = "Changes not saved";
        modalRef.componentInstance.body = "Do you want to leave the page?";
        return modalRef.result.catch(() => false);
    }
}
