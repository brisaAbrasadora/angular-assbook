import { Component, Input, inject } from "@angular/core";
import { PostCardComponent } from "../post-card/post-card.component";
import { Post } from "../interfaces/post";
import { Comment } from "../interfaces/comments";
import { PostsService } from "../services/posts.service";
import { Router } from "@angular/router";
import { PostCommentsComponent } from "../post-comments/post-comments.component";

@Component({
    selector: "post-detail",
    standalone: true,
    imports: [PostCardComponent, PostCommentsComponent],
    templateUrl: "./post-detail.component.html",
    styleUrl: "./post-detail.component.css",
})
export class PostDetailComponent  {
    @Input() post!: Post;
    @Input({required: true}) comments!: Comment[];
    
    #postsService = inject(PostsService);
    #router = inject(Router);
    
    goBack() {
        this.#router.navigate(["/posts"]);
    }

    deletePost(post: Post) {
        this.#postsService.deletePost(post.id!).subscribe({
            next: () => {
                this.#router.navigate(["/posts"]);
            },
            error: (error) => {
                console.error(error.message);
            }
        });
    }
}
