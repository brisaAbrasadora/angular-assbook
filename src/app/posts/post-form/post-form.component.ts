import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, NonNullableFormBuilder, Validators } from "@angular/forms";
import { PostInsert } from "../interfaces/post";
import { CommonModule } from "@angular/common";
import { PostsService } from "../services/posts.service";
import { Router } from "@angular/router";
import { extensionValidator } from "../../validators/extension.validator";
import { invalidCharactersValidator } from "../../validators/invalidCharacters.validator";
import { formRequiredValidator } from "../../validators/form-required.validator";

@Component({
    selector: "post-form",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./post-form.component.html",
    styleUrl: "./post-form.component.css",
})
export class PostFormComponent {
    #formBuilder = inject(NonNullableFormBuilder);
    #postsService = inject(PostsService);
    #router = inject(Router);

    title: FormControl = this.#formBuilder.control("", [Validators.minLength(5),
        invalidCharactersValidator("^[a-zA-Z][a-zA-Z ]*$")]);
    description: FormControl = this.#formBuilder.control("", Validators.minLength(8));
    image: FormControl = this.#formBuilder.control("", extensionValidator(["jpg", "png", "jpeg",
        "gif", "bmp"]));
    mood: FormControl = this.#formBuilder.control(0);

    imageBase64: string = "";
    saved: boolean = false;

    constructor() {
        this.resetForm();
    }

    postForm = this.#formBuilder.group({
        title: this.title,
        description: this.description,
        image: this.image,
        mood: this.mood,
    }, {
        validators: formRequiredValidator
    });

    resetForm(): void {
        this.postForm.reset();
    }

    canDeactivate(): boolean {
        return this.saved || !this.postForm.dirty || confirm("Do you want to leave this page? Post won't be saved.");
    }

    validClasses(control: FormControl, validClass: string, errorClass: string, ): { [key: string]: boolean } {
        return {
            [validClass]: control.touched && control.valid && control.value,
            [errorClass]: control.touched && control.invalid
        };
    }

    addPost(): void {
        if (this.postForm.valid) {
            const post: PostInsert = {
                ...this.postForm.getRawValue(),
                image: this.imageBase64,
                mood: +this.mood.value
            };
            this.#postsService.addPost(post).subscribe({
                next: () => {
                    this.saved = true;
                    this.#router.navigate(["/posts"]);
                },
                error: (error) => {
                    console.error(error.message);
                }
            });
        }
    }

    resetImage(): void {
        this.image.reset();
        this.imageBase64 = "";
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
        if(this.image.invalid) {
            this.imageBase64 = "";
        }
    }
}
