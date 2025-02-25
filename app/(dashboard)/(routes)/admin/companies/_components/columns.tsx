"use client";
import { ColumnDef } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowUpDown, MoreHorizontal, Pencil, Trash} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";




export type CompanyColumns = {
  id:string;
  name:string;
  // logo: string;
  createdAt: string;
};

export const columns: ColumnDef<CompanyColumns>[] = [
  // {
  //   accessorKey: "logo",
  //   header:"Logo",
      //  cell:({row})=>{
      //   const {logo}= row.original
      //   return (
      //     <div className="w-20 h-20 flex items-center justify-center relative rounded-md overflow-hidden"></div>
      //   )
      //  }
  // },
  {
    accessorKey: "name",
    header: ({column})=>{
      return (
        <Button
          variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted()==="asc")}>
            Name
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({column})=>{
      return (
        <Button
          variant="ghost"
          onClick={()=> column.toggleSorting(column.getIsSorted()==="asc")}>
            Date
          <ArrowUpDown className="ml-2 h-4 w-4"/>
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/admin/companies/${id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
        
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

  

  
    
    

  
  