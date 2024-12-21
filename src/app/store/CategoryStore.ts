import { create } from "zustand";

import {
    getAllCategories,
    createNewCategory,
    updateCategoryById,
    deleteCategoryById,
} from "@/apis/modules/category";
import { Category } from "@/app/model/Category";
import { CategoryDto } from "@/app/admin/_components/categories/CategoryForm";
import {handleApiRequest} from "@/app/util/utils";
const buildCategoryTree = (categories: any):any => {
    const categoryMap: { [key: number]: any } = {};
    const clonedCategories = categories.map((category:any) => ({
        ...category,
        children: [],
    }));

    clonedCategories.forEach((category:any) => {
        categoryMap[category.id] = category;
    });

    const tree: any[] = [];
    clonedCategories.forEach((category:any) => {
        if (category.parent === null) {
            // Root category
            tree.push(category);
        } else {
            const parent = categoryMap[category.parent.id];
            if (parent) {
                parent.children.push(category);
            }
        }
    });
    const buildSelectTree=(categories:any)=>{
        return categories.map((cat:any) => ({
            title: cat.name,
            value: cat.id,
            children:
                cat.children && cat.children.length > 0
                    ? buildSelectTree(cat.children)
                    : undefined,
        }));
    }
    return buildSelectTree(tree);


};

interface CategoryState {
    categoriesTree: any[];
    categories: Category[];
    getAllCategories: () => Promise<void>;
    createCategory: (newCategory: CategoryDto) => Promise<void>;
    updateCategory: (id: number, category: CategoryDto) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;



}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categoriesTree: [],
    categories: [],


    getAllCategories: async () => {
        const apiCall = () => getAllCategories();
        const onSuccess = (response: any) => {
            set({
                categories: response.data,
                categoriesTree: buildCategoryTree(response.data),
            });
        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    // Create category
    createCategory: async (newCategory: CategoryDto) => {
        const apiCall = () => createNewCategory(newCategory);
        const onSuccess = (response: any) => {
            const updatedCategories = [...get().categories, response.data];
            set({
                categories:updatedCategories,
                categoriesTree: buildCategoryTree(updatedCategories),
            })


        };
        return await handleApiRequest(apiCall, onSuccess);
    },

    // Update category
    updateCategory: async (id: number, category: CategoryDto) => {
        const apiCall = () => updateCategoryById(id, category);
        const onSuccess = (response: any) => {
            const updatedCategories = get().categories.map((cat) =>
                cat.id === id ? response.data : cat
            );
            set({
                categories: updatedCategories,
                categoriesTree: buildCategoryTree(updatedCategories),
            });



        };
        return await handleApiRequest(apiCall, onSuccess);
    },


    deleteCategory: async (id: number) => {
        const apiCall = () => deleteCategoryById(id);
        const onSuccess = (response: any) => {
            const updatedCategories = get().categories.filter((cat) => cat.id !== id);
            set({
                categories: updatedCategories,
                categoriesTree: buildCategoryTree(updatedCategories),
            });

        };
        return await handleApiRequest(apiCall, onSuccess);
    },
}));
