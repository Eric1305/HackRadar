import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-[#62ed05] shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl gradient-text">HackRadar</h1>
      </Link>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button className="cursor-pointer">Dashboard</Button>
        </Link>
        <Link to="/login">
          <Button className="cursor-pointer">Login</Button>
        </Link>
      </div>
    </nav>
  );
}
