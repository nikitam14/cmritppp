import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu} from "lucide-react"
import {Sidebar} from "./sidebar"


export const MobileSideBar=()=>{
    return <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition ">
        <Menu/>
        </SheetTrigger>

        <SheetContent className="bg-white" side="left">
            <Sidebar/>
        </SheetContent>
</Sheet>

}