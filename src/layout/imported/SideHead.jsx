import { ChevronRight } from "lucide-react"

export function SideHead() {
  return (
    <button className="flex items-center justify-center w-full h-full bg-[#EBF3FF40] rounded-full py-2 gap-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 transition-all duration-300 ease-in-out">
      <img
        src="src/assets/img/img-profile.png"
        alt="profile_image"
        className="w-9 h-9 rounded-full shrink-0 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10"
      />
      <span className="w-24 truncate text-sm font-semibold text-white transition-all duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden">Mariano, L</span>
      <ChevronRight className="ml-3 group-data-[collapsible=icon]:hidden transition-all duration-300 ease-in-out opacity-100 group-data-[collapsible=icon]:opacity-0" />
    </button>
  )
}