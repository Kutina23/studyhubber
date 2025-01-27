import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BookOpen, MessageSquare, FileText, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const links = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/forum", icon: MessageSquare, label: "Forum" },
    { to: "/resources", icon: FileText, label: "Resources" },
    { to: "/courses", icon: BookOpen, label: "Courses" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">EduHub</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium",
                    location.pathname === to
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          {session && (
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="inline-flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};