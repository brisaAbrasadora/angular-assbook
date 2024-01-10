import { ResolveFn, Router } from "@angular/router";
import { Post } from "../interfaces/post";
import { inject } from "@angular/core";
import { PostsService } from "../services/posts.service";
import { EMPTY, catchError } from "rxjs";

export const postResolver: ResolveFn<Post> = (route) => {
    return inject(PostsService).getPost(+route.params["id"]).pipe(
        catchError(() => {
            inject(Router).navigate(["/posts"]);
            return EMPTY;
        })
    );
};
