import { User } from "../../auth/interfaces/user";

export interface PostInsert {
    title?: string;
    description?: string;
    date?: string;
    image?: string;
    place?: string;
    lat?: number;
    lng?: number;
    mood: number;
}

export interface Post extends PostInsert {
    id: number;
    date: string;
    totalLikes: number;
    creator: User;
    likes: boolean | null;
    mine: boolean;
}
