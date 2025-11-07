export interface Type {
    id: string; // UUID
    name: string;
    description?: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export interface CreateTypeInput {
    name: string;
    description?: string;
}

export interface UpdateTypeInput {
    name?: string;
    description?: string;
}
