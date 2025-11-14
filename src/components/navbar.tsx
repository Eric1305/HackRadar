import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-[#62ed05] shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl gradient-text">HackRadar</h1>
      </Link>
      <Button>Sign Up</Button>
    </nav>
  );
}
