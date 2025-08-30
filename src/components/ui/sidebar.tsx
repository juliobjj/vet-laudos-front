"use client"

import * as React from "react"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  X,
  Home,
  Users,
  PawPrint,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)

  const menuItems = [
    { icon: <Home className="h-4 w-4" />, label: "Início", href: "/" },
    { icon: <PawPrint className="h-4 w-4" />, label: "Pacientes", href: "/patients" },
    { icon: <Users className="h-4 w-4" />, label: "Usuários", href: "/users" },
  ]

  return (
    < div className="flex" >
      {/* Sidebar Mobile */}
      < Sheet open={isOpen} onOpenChange={setIsOpen} >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[100px] p-0">
          <div className="h-full bg-background flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold">Vet Laudos</h2>
                  <p className="text-xs text-muted-foreground">Sistema</p>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-6">
              {/* Menu Section */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-3">Menu</div>
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-purple-600 text-white text-xs">SH</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">shadcn</p>
                  <p className="text-xs text-muted-foreground">m@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet >

      {/* Sidebar Desktop */}
      < aside className={
        cn(
          "hidden md:flex h-screen flex-col bg-background border-r transition-all duration-300",
          collapsed ? "w-[60px]" : "w-[150px]"
        )
      } >
        {/* Header */}
        < div className="p-4 border-b" >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1">
                <h2 className="text-sm font-semibold">Vet Laudos</h2>
                <p className="text-xs text-muted-foreground">Sistema</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-6 w-6 "
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div >

        {/* Content */}
        < div className="flex-1 p-4 space-y-6" >
          {/* Menu Section */}
          <div>
            {
              !collapsed && (
                <div className="text-xs font-medium text-muted-foreground mb-3">Menu</div>
              )
            }
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent",
                    collapsed && "justify-center"
                  )}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div >
        </div >

        {/* Footer */}
        < div className="p-4 border-t" >
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-purple-600 text-white text-xs">SH</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">shadcn</p>
                <p className="text-xs text-muted-foreground">m@example.com</p>
              </div>
            )}
          </div>
        </div >
      </aside >
    </div >
  )
}