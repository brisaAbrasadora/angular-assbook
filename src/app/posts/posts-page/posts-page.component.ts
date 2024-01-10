import { Component, OnInit, inject } from "@angular/core";
import { Post } from "../interfaces/post";
import { PostFormComponent } from "../post-form/post-form.component";
import { PostCardComponent } from "../post-card/post-card.component";
import { SearchPostsComponent } from "../search-posts/search-posts.component";
import { PostFilterPipe } from "../pipes/post-filter.pipe";
import { PostsService } from "../services/posts.service";

@Component({
    selector: "posts-page",
    standalone: true,
    imports: [PostFormComponent, PostCardComponent, SearchPostsComponent, PostFilterPipe],
    templateUrl: "./posts-page.component.html",
    styleUrl: "./posts-page.component.css",
})
export class PostsPageComponent implements OnInit {
    ngOnInit(): void {
        this.#postsService.getPosts().subscribe({
            next: (posts) => {
                this.posts = posts;
            },
            error: (error) => console.error(error.message),
        });
    }

    #postsService = inject(PostsService);
    posts: Post[] = [];
    params: string = "";

    addProduct(post: Post) {
        this.posts = [post, ...this.posts];
    }
    deletePost(post: Post) {
        this.#postsService.deletePost(post.id!).subscribe({
            next: () => {
                this.posts = this.posts.filter((p) => p !== post);
            },
            error: (error) => {
                console.error(error.message);
            }
        });
    }
    updateSearch(toSearch: string) {
        this.params = toSearch;
    }
}
