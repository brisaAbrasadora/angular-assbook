import {
    Component,
    OnInit,
    WritableSignal,
    computed,
    inject,
    signal,
} from "@angular/core";
import { Post } from "../interfaces/post";
import { PostCardComponent } from "../post-card/post-card.component";
import { PostsService } from "../services/posts.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "posts-page",
    standalone: true,
    imports: [
        FormsModule,
        PostCardComponent,
    ],
    templateUrl: "./posts-page.component.html",
    styleUrl: "./posts-page.component.css",
})
export class PostsPageComponent implements OnInit {
    ngOnInit(): void {
        this.#postsService.getPosts().subscribe({
            next: (posts) => {
                this.posts.set(posts);
                console.log(posts);
            },
            error: (error) => console.error(error.message),
        });
    }

    #postsService = inject(PostsService);
    posts: WritableSignal<Post[]> = signal([]);
    filteredPosts = computed(() =>
        this.posts().filter(
            (p) =>
                p.description?.toLocaleLowerCase().includes(this.search().toLocaleLowerCase()) ||
                p.title?.toLocaleLowerCase().includes(this.search().toLocaleLowerCase())
        )
    );
    search: WritableSignal<string> = signal("");

    deletePost(post: Post) {
        this.#postsService.deletePost(post.id!).subscribe({
            next: () => {
                this.posts.update((posts) => posts.filter((p) => p !== post));
            },
            error: (error) => {
                console.error(error.message);
            },
        });
    }
}
