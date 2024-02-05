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
import { GeolocationService } from "../../auth/services/geolocation.service";

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
export class PostFormComponent implements OnInit {
    @Input() post!: Post;
    @Input({ transform: numberAttribute }) id!: number;

    constructor() {
        this.resetForm();
    }

    ngOnInit(): void {
        this.title.setValue(this.post?.title);
        this.description.setValue(this.post?.description);
        this.imageBase64 = this.post?.image;
        this.mood.setValue(this.post?.mood ? this.post.mood : 0);
        this.place.setValue(this.post?.place ? this.post.place : "");
        if (this.post?.lat && this.post?.lng) {
            this.coordinates.set({
                latitude: this.post.lat,
                longitude: this.post.lng,
            });
            this.moveMap(this.coordinates());
        } else {
            this.geolocate();
        }
        if (this.post) this.editMode = true;
    }

    #formBuilder = inject(NonNullableFormBuilder);
    #postsService = inject(PostsService);
    #router = inject(Router);
    #geolocationService = inject(GeolocationService);

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

    imageBase64: string | undefined = "";
    saved: boolean = false;
    photoSelected: WritableSignal<boolean> = signal(true);
    disabledLocation: WritableSignal<boolean> = signal(false);
    coordinates: WritableSignal<Coordinates> = signal({
        latitude: 0,
        longitude: 0,
    });
    editMode = false;


    postForm = this.#formBuilder.group(
        {
            title: this.title,
            description: this.description,
            image: this.image,
            mood: this.mood,
            place: this.place,
        },
        {
            validators: formRequiredValidator,
        }
    );

    resetForm(): void {
        this.postForm.reset();
    }

    canDeactivate(): boolean {
        return (
            this.saved ||
            !this.postForm.dirty ||
            confirm("Do you want to leave this page? Post won't be saved.")
        );
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

    test = "";

    addPost(): void {
        if (this.postForm.valid) {
            const post: PostInsert = {
                title: this.title.value,
                description: this.description.value,
                image: this.imageBase64,
                mood: +this.mood.value,
                place: this.place.value,
                lat: this.coordinates().latitude,
                lng: this.coordinates().longitude
            };
            console.log(post);
            if (this.id) {
                this.#postsService.editPost(post, this.id).subscribe({
                    next: () => {
                        this.saved = true;
                        this.#router.navigate(["/posts"]);
                    },
                    error: (error) => {
                        console.error(error.message);
                    },
                });
            } else {
                this.#postsService.addPost(post).subscribe({
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

    resetImage(): void {
        this.image.reset();
        this.imageBase64 = "";
    }

    resetPlace(): void {
        this.post.place = this.post.place ? this.post.place : "";
        this.post.lat = this.post.lat ? this.post.lat : 0;
        this.post.lng = this.post.lng ? this.post.lng : 0;
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
            this.imageBase64 = "";
        }
    }

    changePostType(): void {
        if(this.photoSelected()) {
            this.resetImage();
        } else {
            this.resetPlace();
        }
        this.photoSelected.update((photo) => !photo);
    }

    moveMap(coords: Coordinates) {
        this.coordinates.set(coords);
    }

    geolocate(): void {
        this.#geolocationService.getLocation().subscribe({
            next: (coordinates) => {
                this.coordinates.set({
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude,
                });
                this.moveMap(this.coordinates());
            },
            error: (error) => {
                console.error("Error getting location in register:", error);
                this.disabledLocation.update((disabled) => !disabled);
                this.photoSelected.set(true);
            },
        });
    }
}
