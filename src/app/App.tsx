import "@/app/App.css";
import { ThreeCanvas } from "@/3d/canvas";
import { Outlet } from "react-router-dom";
import { LanguageToggle } from "@/app/ui/language-toggle";
import { LoopingBgm } from "@/app/audio/looping-bgm";
import { RouteTransitionProvider } from "@/app/routes/route-transition";
import { useCallback, useState } from "react";

function RoutedWidgets() {
  return (
    <>
      <div className="absolute overflow-hidden w-full h-full left-0 right-0 z-10 pointer-events-none">
        <Outlet />
        <div className="absolute bottom-6 left-6">
          <LanguageToggle />
        </div>
      </div>
    </>
  );
}

function App() {
  const [isBgmEnabled, setIsBgmEnabled] = useState(false);
  const handleInitialRevealComplete = useCallback(() => {
    setIsBgmEnabled(true);
  }, []);

  return (
    <RouteTransitionProvider
      onInitialRevealComplete={handleInitialRevealComplete}
    >
      <LoopingBgm isEnabled={isBgmEnabled} />
      <RoutedWidgets />
      <div className="relative w-screen h-screen">
        <ThreeCanvas />
      </div>
    </RouteTransitionProvider>
  );
}

export default App;
