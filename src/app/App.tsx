import "@/app/App.css";
import { ThreeCanvas } from "@/3d/canvas";
import { Outlet } from "react-router-dom";
import { LanguageToggle } from "@/app/ui/language-toggle";

function RoutedWidgets() {
  return (
    <>
      <div className="absolute w-full h-full left-0 right-0 z-10 pointer-events-none">
        <Outlet />
        <div className="absolute bottom-6 left-6">
          <LanguageToggle />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <RoutedWidgets />
      <div className="relative w-screen h-screen">
        <ThreeCanvas />
      </div>
    </>
  );
}

export default App;
