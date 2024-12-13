"use client"

import { Category } from "@prisma/client"
import CategoryListItem from "./category-list-item";

interface CategoriesListPrope{
  categories: Category[]
}

export const CategoriesList = ({categories}: CategoriesListPrope) => {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 scrollbar-none">
      {
        categories.map(catgeory=>(
          <CategoryListItem key={catgeory.id} label={catgeory.name} value={catgeory.id}/>
        ))
      }
    </div>
  )
};

