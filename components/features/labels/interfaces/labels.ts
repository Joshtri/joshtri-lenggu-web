import { BaseEntity } from "@/interfaces/api";

export interface Label extends BaseEntity {
    name: string;
    color: string; // Hex color code, e.g. "#FF5733"
    description?: string | null;
}

export interface CreateLabelInput {
    name: string;
    color: string; // Hex color code, e.g. "#FF5733"
    description?: string;
}

export interface UpdateLabelInput {
    name?: string;
    color?: string; // Hex color code, e.g. "#FF5733"
    description?: string;
}