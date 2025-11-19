import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-[#62ed05] shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl gradient-text">HackRadar</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/dashboard">
          <Button className="cursor-pointer">Dashboard</Button>
        </Link>
        <Link to="/starred">
          <Button className="cursor-pointer">Starred</Button>
        </Link>

        {/* Not logged in → show Login */}
        {!user && (
          <Link to="/login">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}

        {/* Logged in → show only Logout */}
        {user && (
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
