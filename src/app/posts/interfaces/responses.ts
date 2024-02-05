import { Comment } from "./comments";
import { Post } from "./post";

export interface PostsResponse {
    posts: Post[];
}

export interface SinglePostResponse {
    post: Post;
}

export interface TotalLikesResponse {
    totalLikes: number;
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface CommentResponse {
    comment: Comment;
}