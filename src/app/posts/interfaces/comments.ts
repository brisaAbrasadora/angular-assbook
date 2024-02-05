import { User } from "../../auth/interfaces/user";

export interface CommentInsert {
    text: string;
}

export interface Comment extends CommentInsert {
    id: number;
    date: string;
    post?: number;
    user: User;
}