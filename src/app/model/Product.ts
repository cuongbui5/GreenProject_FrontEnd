import {Category} from "@/app/model/Category";

export interface Product {
    id: number;
    name: string;
    description: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
}

