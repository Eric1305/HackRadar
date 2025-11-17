import "@/index.css";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col relative justify-center items-center gap-7 ">
      <NavBar />
      <h1 className="gradient-text text-9xl font-bold">HackRadar</h1>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="inset-0 w-1/3 h-1/3 object-cover"
      >
        <source src="/videos/HackRadarGIF.webm" type="video/webm" />
      </video>

      <Button asChild size="lg" className="text-2xl">
        <Link to="/dashboard">Get Started</Link>
      </Button>
    </div>
  );
}
