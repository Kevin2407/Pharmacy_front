import { Menu } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SideNav } from "./SideNav"
import customs from "../../config/customs"
import { SideHead } from "./SideHead"
import { Button } from "@/components/ui/button"
import Icon from "../../lib/Icons"
import Logo from "../../assets/img/logo_white.png"
import { useNavigate } from "react-router-dom"

export function AppSidebar() {
  const navigate = useNavigate()
  return (
    <div className="relative h-screen">
      <Sidebar className="border-r w-64 shrink-0" collapsible="icon">
        <SidebarHeader className="p-4 group-data-[collapsible=icon]:px-1">
          <SideHead />
        </SidebarHeader>
        
        <SidebarContent>
          <SideNav items={customs.SECTIONS} />
        </SidebarContent>

        <SidebarFooter className="flex-row items-center justify-between p-4 group-data-[collapsible=icon]:px-2 transition-all duration-300 ease-in-out">
          <Button
            className="w-6 h-6 bg-[#FFFFFF] hover:bg-[#ffffffa1] shrink-0 rounded-full flex items-center justify-center group-data-[collapsible=icon]:hidden"
            variant="ghost"
            size="icon"
            onClick={() => {navigate(-1)}}
          >
            <Icon name="IconArrowLeft" size={10} />
          </Button>
          <img src={Logo} alt="logo" className="w-[131px] h-[36px] group-data-[collapsible=icon]:hidden transition-all duration-300 ease-in-out" />
          <SidebarTrigger/>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </div>
  )
}
