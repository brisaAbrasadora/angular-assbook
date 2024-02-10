import { Component, Input, OnInit, inject } from "@angular/core";
import { User } from "../../auth/interfaces/user";
import { BmMapDirective } from "../../bingmaps/bm-map.directive";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { BmMarkerDirective } from "../../bingmaps/bm-marker.directive";
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { extensionValidator } from "../../validators/extension.validator";
import { ProfilePicture } from "../interfaces/profile";
import { UserService } from "../services/user.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "profile-page",
    standalone: true,
    imports: [BmMapDirective, BmMarkerDirective, RouterLink, ReactiveFormsModule, CommonModule],
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
    image: FormControl = this.#formBuilder.control("", extensionValidator(["jpg", "png", "jpeg", "gif", "bmp"]));
    imageForm: FormGroup = this.#formBuilder.group({
        image: this.image
    });

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
                this.#userService.updateProfilePicture(profilePicture)
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
}
