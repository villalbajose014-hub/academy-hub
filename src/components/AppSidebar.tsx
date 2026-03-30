import {
  BarChart3, Users, Target, Link2, DollarSign, TrendingUp, Award, ArrowLeftRight, LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/lib/auth-context";
import logoFull from "@/assets/logo-full.png";
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
        <div className="p-4 flex items-center gap-3 border-b border-border/50 mb-2">
          <img src={logoFull} alt="VMT" className={`object-contain flex-shrink-0 transition-all ${collapsed ? "h-6 w-6" : "h-10"}`} />
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/60">
            {role === "mentor" ? "Mentor" : "Alumno"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50 transition-all"
                      activeClassName="bg-primary/10 text-primary font-semibold border-l-2 border-primary"
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

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
            {userName?.slice(0, 2).toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName || "Usuario"}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
