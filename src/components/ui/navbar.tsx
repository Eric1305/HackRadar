import React from "react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b-2 border-[#62ed05] shadow-md px-6 py-4 flex items-center justify-between">
      <Button>Sign Up</Button>
    </nav>
  );
}
