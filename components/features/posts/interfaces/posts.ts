import { BaseEntity } from "@/interfaces/api";

export interface Label {
    id: string;
    name: string;
    color: string;
    description?: string | null;
}

export interface Post  extends BaseEntity{
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    viewsCount: number;
    status: 'draft' | 'published' | 'archived';
    authorId: string | null;
    labelId: string | null;
    typeId: string | null;
    label?: Label | null;
}

export interface CreatePostInput extends Pick<BaseEntity, "id"> {
    slug: string;
    title: string;
    coverImage: string;
    content: string;
    excerpt: string;
    status?: 'draft' | 'published' | 'archived';
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
    status?: 'draft' | 'published' | 'archived';
    authorId?: number;
    labelId?: number;
    typeId?: number;
}