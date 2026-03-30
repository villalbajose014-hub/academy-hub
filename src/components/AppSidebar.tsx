import {
  BarChart3, Users, Trophy, Target, Link2, DollarSign, TrendingUp, Award, ArrowLeftRight, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth-context";
import logoShort from "@/assets/logo-short.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mentorLinks = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Alumnos", url: "/students", icon: Users },
  { title: "Desafíos", url: "/challenges", icon: Target },
  { title: "Recursos", url: "/resources", icon: Link2 },
];

const studentLinks = [
  { title: "Mi Progreso", url: "/", icon: TrendingUp },
  { title: "Registrar Ingreso", url: "/income", icon: DollarSign },
  { title: "Logros", url: "/achievements", icon: Award },
  { title: "Conversor", url: "/converter", icon: ArrowLeftRight },
];

export function AppSidebar() {
  const { role, userName, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const links = role === "mentor" ? mentorLinks : studentLinks;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-3">
          <img src={logoShort} alt="VMT" className="h-8 w-8 object-contain flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-bold text-primary truncate">VMT Academy</span>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{role === "mentor" ? "Mentor" : "Alumno"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-xs text-muted-foreground mb-2 truncate">{userName}</p>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Salir</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
