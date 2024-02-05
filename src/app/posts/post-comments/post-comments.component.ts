import { Component, Input, OnInit, WritableSignal, inject, signal } from "@angular/core";
import { PostsService } from "../services/posts.service";
import { Comment, CommentInsert } from "../interfaces/comments";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "post-comments",
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: "./post-comments.component.html",
    styleUrl: "./post-comments.component.css",
})
export class PostCommentsComponent implements OnInit {
    @Input({required: true}) id!: number;

    ngOnInit(): void {
        this.#postsService.getComments(this.id)
            .subscribe({
                next: (comments) => {
                    this.comments.set(comments);
                },
                error: (error) => console.error(error.message),
            });
    }

    constructor() {
        this.resetForm();
    }

    #formBuilder = inject(NonNullableFormBuilder);
    #postsService = inject(PostsService);

    comments: WritableSignal<Comment[]> = signal([]);
    comment: FormControl = this.#formBuilder.control("", Validators.required);

    commentForm = this.#formBuilder.group({
        text: this.comment,
    });
    saved: boolean = false;


    resetForm(): void {
        this.commentForm.reset();
    }

    addComment(): void {
        if (this.commentForm.valid) {
            const comment: CommentInsert = {
                ...this.commentForm.getRawValue()
            };

            this.#postsService.addComment(comment, this.id).subscribe({
                next: (comment) => {
                    this.comments().push(comment);
                    this.saved = true;
                    this.resetForm();
                },
                error: (error) => {
                    console.log(error.message);
                }
            });
        }
    }

    validClasses(control: FormControl, validClass: string, errorClass: string, ): { [key: string]: boolean } {
        return {
            [validClass]: control.touched && control.valid && control.value,
            [errorClass]: control.touched && control.invalid
        };
    }
}
