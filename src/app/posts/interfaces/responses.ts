import { Post } from "./post";

export interface PostsResponse {
    posts: Post[];
}

export interface SinglePostResponse {
    post: Post;
}