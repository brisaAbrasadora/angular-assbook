import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Post, PostInsert } from "../interfaces/post";
import { Observable, map } from "rxjs";
import { PostsResponse, SinglePostResponse, TotalLikesResponse } from "../interfaces/responses";

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

    addPost(post: PostInsert): Observable<Post> {
        return this.#http
            .post<Post>(`${this.#postsUrl}`, post);
    }

    editPost(post: PostInsert, id: number): Observable<Post> {
        return this.#http.put<Post>(`${this.#postsUrl}/${id}`, post);
    }

    deletePost(id: number): Observable<void> {
        return this.#http.delete<void>(`${this.#postsUrl}/${id}`);
    }

    addVote(id:number, likes: boolean): Observable<number> {
        return this.#http
            .post<TotalLikesResponse>(`${this.#postsUrl}/${id}/likes`, {"likes": likes})
            .pipe(map((resp) => resp.totalLikes));
    }

    deleteVote(id:number): Observable<number> {
        return this.#http
            .delete<TotalLikesResponse>(`${this.#postsUrl}/${id}/likes`)
            .pipe(map((resp) => resp.totalLikes));
    }
}
