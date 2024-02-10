import {
    Component,
    Input,
    OnInit,
    WritableSignal,
    computed,
    inject,
    numberAttribute,
    signal,
} from "@angular/core";
import { Post } from "../interfaces/post";
import { PostCardComponent } from "../post-card/post-card.component";
import { PostsService } from "../services/posts.service";
import { FormsModule } from "@angular/forms";
import { UserService } from "../../profile/services/user.service";
import { Router } from "@angular/router";

@Component({
    selector: "posts-page",
    standalone: true,
    imports: [FormsModule, PostCardComponent],
    templateUrl: "./posts-page.component.html",
    styleUrl: "./posts-page.component.css",
})
export class PostsPageComponent implements OnInit {
    @Input({ transform: numberAttribute }) set creator(creator: number) {
        if (creator) {
            this.#userService.getProfile(creator).subscribe({
                next: (user) => {
                    this.creatorName = user.name;
                    this.#postsService.getUserPosts(user.id!).subscribe({
                        next: (posts) => {
                            this.posts.set(posts);
                        },
                        error: (error) => console.error(error.message),
                    });
                },
                error: () => this.#router.navigate(["/"]),
            });
        } else {
            this.#postsService.getPosts().subscribe({
                next: (posts) => {
                    this.posts.set(posts);
                },
                error: (error) => console.error(error.message),
            });
            this.creatorName = undefined;
        }
    }
    ngOnInit(): void {
        this.creatorName = undefined;
        console.log("hola");
    }

    #postsService = inject(PostsService);
    #userService = inject(UserService);
    #router = inject(Router);
    posts: WritableSignal<Post[]> = signal([]);
    search: WritableSignal<string> = signal("");
    filteredPosts = computed(() =>
        this.search()
            ? this.posts().filter(
                (p) =>
                    p.description
                        ?.toLocaleLowerCase()
                        .includes(this.search().toLocaleLowerCase()) ||
                    p.title
                        ?.toLocaleLowerCase()
                        .includes(this.search().toLocaleLowerCase())
            ) : this.posts()
    );

    creatorName?: string;

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
