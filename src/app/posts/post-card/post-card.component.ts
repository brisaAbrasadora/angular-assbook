import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Post } from "../interfaces/post";
import { RouterLink } from "@angular/router";
import { PostLikesComponent } from "../post-likes/post-likes.component";
import { PostsService } from "../services/posts.service";

@Component({
    selector: "post-card",
    standalone: true,
    imports: [CommonModule, RouterLink, PostLikesComponent],
    templateUrl: "./post-card.component.html",
    styleUrl: "./post-card.component.css",
})
export class PostCardComponent {
    @Input({required: true}) post!: Post;
    @Output() deleted = new EventEmitter<void>();

    #postsService = inject(PostsService);

    deletePost() {
        this.deleted.emit();
    }

    changeLikes(likes: boolean | null) {
        const oldLikes = this.post.likes;
        this.post.likes = likes;
        if (this.post.likes !== null) {
            this.#postsService
                .addVote(this.post.id!, this.post.likes)
                .subscribe({
                    error: (error) => {
                        console.error(error.message);
                        this.post.likes = oldLikes;
                    },
                });
        } else {
            this.#postsService.deleteVote(this.post.id!).subscribe({
                error: (error) => {
                    console.error(error.message);
                    this.post.likes = oldLikes;
                },
            });
        }
    }
}
