export interface Program {
    id: string;
    name: string;
    period: string | null;
    description: string | null;
    skus: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
