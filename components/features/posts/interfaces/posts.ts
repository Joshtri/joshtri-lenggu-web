import { BaseEntity } from "@/interfaces/api";

export interface Post  extends BaseEntity{
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    viewsCount: number;
    authorId: string | null;
    labelId: string | null;
    typeId: string | null;
}

export interface CreatePostInput extends Pick<BaseEntity, "id"> {
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    authorId?: string;
    labelId?: string;
    typeId?: string;
}

export interface UpdatePostInput {
    slug?: string;
    title?: string;
    coverImage?: string;
    content?: string;
    excerpt?: string;
    authorId?: number;
    labelId?: number;
    typeId?: number;
}