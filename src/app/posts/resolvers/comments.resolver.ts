import { ResolveFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { PostsService } from "../services/posts.service";
import { EMPTY, catchError } from "rxjs";
import { Comment } from "../interfaces/comments";

export const commentsResolver: ResolveFn<Comment[]> = (route) => {
    console.log("hello from commentResolver");
    return inject(PostsService).getComments(+route.params["id"]).pipe(
        catchError(() => {
            inject(Router).navigate(["/posts"]);
            return EMPTY;
        })
    );
};
