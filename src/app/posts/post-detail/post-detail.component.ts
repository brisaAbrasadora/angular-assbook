import { Component, Input, inject } from "@angular/core";
import { PostCardComponent } from "../post-card/post-card.component";
import { Post } from "../interfaces/post";
import { PostsService } from "../services/posts.service";
import { Router } from "@angular/router";

@Component({
    selector: "post-detail",
    standalone: true,
    imports: [PostCardComponent],
    templateUrl: "./post-detail.component.html",
    styleUrl: "./post-detail.component.css",
})
export class PostDetailComponent  {
    @Input() post!: Post;
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
