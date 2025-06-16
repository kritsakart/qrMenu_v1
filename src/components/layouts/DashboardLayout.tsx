
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const superAdminNavItems = [
    { href: "/super-admin", label: "Dashboard" },
    { href: "/super-admin/cafe-owners", label: "Café Owners" },
  ];

  const cafeAdminNavItems = [
    { href: "/cafe-admin", label: "Dashboard" },
    { href: "/cafe-admin/locations", label: "Locations" },
    { href: "/cafe-admin/menu", label: "Menu" },
    { href: "/cafe-admin/orders", label: "Orders" },
  ];

  const navItems = isSuperAdmin ? superAdminNavItems : cafeAdminNavItems;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navigation bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Digital Menu Builder</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback>{user?.username ? getInitials(user.username) : "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {isSuperAdmin ? "Super Admin" : "Café Owner"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Sidebar navigation */}
        <aside className="w-64 bg-gray-50 border-r border-gray-200">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                      location.pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
