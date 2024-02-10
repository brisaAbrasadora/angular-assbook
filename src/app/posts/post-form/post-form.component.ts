import {
    Component,
    Input,
    OnInit,
    WritableSignal,
    inject,
    numberAttribute,
    signal,
} from "@angular/core";
import {
    FormControl,
    ReactiveFormsModule,
    NonNullableFormBuilder,
    Validators,
} from "@angular/forms";
import { Post, PostInsert } from "../interfaces/post";
import { CommonModule } from "@angular/common";
import { PostsService } from "../services/posts.service";
import { Router } from "@angular/router";
import { extensionValidator } from "../../validators/extension.validator";
import { invalidCharactersValidator } from "../../validators/invalidCharacters.validator";
import { formRequiredValidator } from "../../validators/form-required.validator";
import { BmMapDirective } from "../../bingmaps/bm-map.directive";
import { BmMarkerDirective } from "../../bingmaps/bm-marker.directive";
import { Coordinates } from "../../bingmaps/interfaces/coordinates";
import { BmAutosuggestDirective } from "../../bingmaps/bm-autosuggest.directive";
import { CanComponentDeactivate } from "../../interfaces/can-component-deactivate";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "../../modals/confirm-modal/confirm-modal.component";

@Component({
    selector: "post-form",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BmMapDirective,
        BmMarkerDirective,
        BmAutosuggestDirective,
    ],
    templateUrl: "./post-form.component.html",
    styleUrl: "./post-form.component.css",
})
export class PostFormComponent implements OnInit, CanComponentDeactivate {
    @Input() post?: Post;
    @Input({ transform: numberAttribute }) id!: number;

    constructor() {
        this.resetForm();
    }

    ngOnInit(): void {
        console.log(`Objeto recibido ${JSON.stringify(this.post, null, 2)}`);
        this.title.setValue(this.post?.title);
        this.description.setValue(this.post?.description);
        this.imageBase64 = this.post?.image;
        this.mood.setValue(this.post?.mood ? this.post.mood : 0);
        this.place.setValue(this.post?.place);
        this.longitude.setValue(this.post?.lng);
        this.latitude.setValue(this.post?.lat);

        if (this.post?.lat && this.post?.lng) {
            this.moveMap({
                latitude: this.post.lat,
                longitude: this.post.lng,
            });
        }
    }

    #formBuilder = inject(NonNullableFormBuilder);
    #postsService = inject(PostsService);
    #router = inject(Router);
    #modalService = inject(NgbModal);

    title: FormControl = this.#formBuilder.control("", [
        Validators.minLength(5),
        invalidCharactersValidator("^[a-zA-Z][a-zA-Z ]*$"),
    ]);
    description: FormControl = this.#formBuilder.control(
        "",
        Validators.minLength(8)
    );
    image: FormControl = this.#formBuilder.control(
        "",
        extensionValidator(["jpg", "png", "jpeg", "gif", "bmp"])
    );
    mood: FormControl = this.#formBuilder.control(0);
    place: FormControl = this.#formBuilder.control("");
    latitude: FormControl = this.#formBuilder.control({
        value: 0,
        disabled: true,
    });
    longitude: FormControl = this.#formBuilder.control({
        value: 0,
        disabled: true,
    });

    imageBase64?: string;
    saved: boolean = false;
    photoSelected: WritableSignal<boolean> = signal(true);
    disabledLocation: WritableSignal<boolean> = signal(false);
    coordinates: WritableSignal<Coordinates> = signal({
        latitude: 0,
        longitude: 0,
    });

    postForm = this.#formBuilder.group(
        {
            title: this.title,
            description: this.description,
            image: this.image,
            mood: this.mood,
            place: this.place,
            latitude: this.latitude,
            longitude: this.longitude,
        },
        {
            validators: formRequiredValidator,
        }
    );

    resetForm(): void {
        this.postForm.reset();
    }

    // canDeactivate(): boolean {
    //     return (
    //         this.saved ||
    //         !this.postForm.dirty ||
    //         confirm("Do you want to leave this page? Post won't be saved.")
    //     );
    // }

    canDeactivate() {
        if (this.saved || this.postForm.pristine) {
            return true;
        }
        const modalRef = this.#modalService.open(ConfirmModalComponent);
        modalRef.componentInstance.title = "Changes not saved";
        modalRef.componentInstance.body = "Do you want to leave the page?";
        return modalRef.result.catch(() => false);
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

    resetImage(): void {
        this.image.reset();
        this.imageBase64 = this.post?.image ? this.post.image : "";
    }

    resetPlace(): void {
        this.place.setValue(this.post?.place ? this.post.place : "");
        this.latitude.setValue(this.post?.lat ? this.post.lat : "");
        this.longitude.setValue(this.post?.lng ? this.post.lng : "");
    }

    changeImage(event: Event): void {
        const fileInput = event.target as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0) {
            return;
        }

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
        reader.addEventListener("loadend", () => {
            this.imageBase64 = reader.result as string;
        });
        if (this.image.invalid) {
            this.imageBase64 = this.post?.image ? this.post.image : "";
        }
    }

    changePostType(): void {
        if (this.photoSelected()) {
            this.resetImage();
        } else {
            this.resetPlace();
        }
        this.photoSelected.update((photo) => !photo);
    }

    moveMap(coords: Coordinates) {
        console.log(`Coordenadas recibidas ${JSON.stringify(coords, null, 2)}`);
        this.coordinates.set({
            latitude: coords.latitude,
            longitude: coords.longitude,
        });
        this.latitude.setValue(coords.latitude);
        this.longitude.setValue(coords.longitude);
    }

    updateAddress(address: string) {
        this.place.setValue(address);
    }

    addPost(): void {
        if (this.postForm.valid) {
            const newPost: PostInsert = {
                title: this.title.value,
                description: this.description.value,
                mood: +this.mood.value,
                image: this.imageBase64,
                place: this.place.value,
                lat: this.latitude.value,
                lng: this.longitude.value,
            };
            if (this.id) {
                this.#postsService.editPost(newPost, this.id).subscribe({
                    next: () => {
                        this.saved = true;
                        this.#router.navigate(["/posts"]);
                    },
                    error: (error) => {
                        console.error(error.message);
                    },
                });
            } else {
                this.#postsService.addPost(newPost).subscribe({
                    next: () => {
                        this.saved = true;
                        this.#router.navigate(["/posts"]);
                    },
                    error: (error) => {
                        console.error(error.message);
                    },
                });
            }
        }
    }
}
