import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "post-likes",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./post-likes.component.html",
    styleUrl: "./post-likes.component.css",
})
export class PostLikesComponent implements OnInit {
    @Input() set likes(likes: boolean | null) {
        this.#likes = likes;
        this.auxLikes = likes;
    }

    @Output() likesChanged = new EventEmitter<boolean | null>();
    #likes: boolean | null = null;
    auxLikes: boolean | null = null;

    ngOnInit(): void {
        this.restoreLikes();
    }

    restoreLikes() {
        this.auxLikes = this.#likes;
    }

    changeLikes(likes: boolean | null) {
        this.likesChanged.emit(likes);
    }

    toggleLikePost(isLike: boolean) {
        if (isLike) {
            this.likesChanged.emit(this.auxLikes === true ? null : true);
        } else {
            this.likesChanged.emit(this.auxLikes === false ? null : false);
        }
    }
}
