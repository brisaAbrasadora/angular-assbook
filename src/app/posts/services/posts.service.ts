import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Post } from "../interfaces/post";
import { Observable, map } from "rxjs";
import { PostsResponse, SinglePostResponse } from "../interfaces/responses";

@Injectable({
    providedIn: "root",
})
export class PostsService {
    constructor() {}

    #postsUrl = "posts";
    #http = inject(HttpClient);

    getPosts(): Observable<Post[]> {
        return this.#http
            .get<PostsResponse>(`${this.#postsUrl}`)
            .pipe(map((resp) => resp.posts));
    }

    getPost(id: number): Observable<Post> {
        return this.#http
            .get<SinglePostResponse>(`${this.#postsUrl}/${id}`)
            .pipe(map((resp) => resp.post));
    }

    addPost(post: Post): Observable<Post> {
        return this.#http
            .post<Post>(`${this.#postsUrl}`, post);
    }

    deletePost(id: number): Observable<void> {
        return this.#http.delete<void>(`${this.#postsUrl}/${id}`);
    }

    addVote(id:number, likes: boolean): Observable<void> {
        return this.#http.post<void>(`${this.#postsUrl}/${id}/likes`, {"likes": likes});
    }

    deleteVote(id:number): Observable<void> {
        return this.#http.delete<void>(`${this.#postsUrl}/${id}/likes`);
    }
}
