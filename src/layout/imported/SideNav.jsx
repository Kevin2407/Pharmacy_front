import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Icons from "@/lib/icons"

export function SideNav({ items }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {Object.entries(items).map(([key, item]) => (
          item.items ? (
            <SidebarMenuItem key={key}>
              <HoverCard openDelay={0} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <div>
                    <Collapsible className="group">
                      <CollapsibleTrigger className="w-full" asChild>
                        <SidebarMenuButton>
                          {item.icon && (
                            <Icons 
                              name={item.icon} 
                              className="!w-8 !h-8 shrink-0" 
                              viewBox="0 0 37 20" 
                            />
                          )}
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.label}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.path}>
                                  <span>{subItem.label}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent 
                  side="right" 
                  align="start"
                  className="w-64 p-0 hidden group-data-[collapsible=icon]:block pointer-events-auto"
                  sideOffset={12}
                >
                  <div className="p-2">
                    <h4 className="mb-2 px-2 text-sm font-semibold">{item.label}</h4>
                    {item.items?.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.path}
                        className="block rounded-md px-2 py-1 text-sm hover:bg-accent"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <a href={item.path}>
                  {item.icon && (
                    <Icons 
                      name={item.icon} 
                        className="!w-8 !h-8 shrink-0 " 
                        viewBox="0 0 37 20" 

                    />
                  )}
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}







