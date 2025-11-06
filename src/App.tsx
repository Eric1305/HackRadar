import "./index.css";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/ui/navbar";

export default function App() {
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
        <source src="/public/videos/HackRadarGIF.webm" type="video/webm" />
      </video>

      <Button size="lg" className="text-2xl">
        Get Started
      </Button>
    </div>
  );
}
