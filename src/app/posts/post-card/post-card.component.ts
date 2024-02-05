import { Component, EventEmitter, Input, OnInit, Output, WritableSignal, inject, signal } from "@angular/core";
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
export class PostCardComponent implements OnInit {
    @Input({required: true}) post!: Post;
    @Output() deleted = new EventEmitter<void>();

    #postsService = inject(PostsService);

    ngOnInit(): void {
        this.totalLikes.set(this.post.totalLikes);
        this.oldTotalLikes = this.totalLikes();
    }

    totalLikes: WritableSignal<number> = signal(0);
    oldTotalLikes = 0;
    
    deletePost() {
        this.deleted.emit();
    }

    changeLikes(likes: boolean | null) {
        const oldLikes = this.post.likes;
        this.post.likes = likes;
    
        if (this.post.likes !== null) {
            if (this.post.likes) {
                this.totalLikes.update((num) => oldLikes === null ? num + 1 : num + 2);
            } else {
                this.totalLikes.update((num) => oldLikes === null ? num - 1 : num - 2);
            }
            this.#postsService
                .addVote(this.post.id!, this.post.likes)
                .subscribe({
                    next: (likes) => {
                        this.totalLikes.set(likes);
                    },
                    error: (error) => {
                        console.error(error.message);
                        this.post.likes = oldLikes;
                        this.post.totalLikes = this.oldTotalLikes;
                    },
                });
        } else {
            this.totalLikes.update((num) => oldLikes === true ? num - 1 : num + 1);
            this.#postsService.deleteVote(this.post.id!).subscribe({
                next: (likes) => {
                    this.totalLikes.set(likes);
                },
                error: (error) => {
                    console.error(error.message);
                    this.post.likes = oldLikes;
                    this.post.totalLikes = this.oldTotalLikes;
                },
            });
        }
    }
}
