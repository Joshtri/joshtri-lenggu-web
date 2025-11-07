import { BaseEntity } from "@/interfaces/api";

export interface Comment extends BaseEntity {
    content: string;
    authorId: number | null;
    postId: number | null;
    parentId: number | null; // For nested/threaded comments
}

export interface CreateCommentInput {
    content: string;
    authorId?: number;
    postId: number;
    parentId?: number;
}

export interface UpdateCommentInput {
    content?: string;
}
