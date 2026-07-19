import "@/app/App.css";
import { ThreeCanvas } from "@/3d/canvas";
import { Outlet } from "react-router-dom";
import { BgmToggleButton } from "@/app/ui/bgm-toggle-button";
import { LanguageToggle } from "@/app/ui/language-toggle";
import { LoopingBgm } from "@/app/audio/looping-bgm";
import { RouteTransitionProvider } from "@/app/routes/route-transition";
import { useCallback, useState } from "react";
import { useIngredientsQuery } from "@/entities/ingredient";

type RoutedWidgetsProps = {
  isBgmEnabled: boolean;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
};

function RoutedWidgets({
  isBgmEnabled,
  isBgmPlaying,
  onToggleBgm,
}: RoutedWidgetsProps) {
  return (
    <>
      <div className="absolute overflow-hidden w-full h-full left-0 right-0 z-10 pointer-events-none">
        <Outlet />
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <LanguageToggle />
          <BgmToggleButton
            isDisabled={!isBgmEnabled}
            isPlaying={isBgmPlaying}
            onToggle={onToggleBgm}
          />
        </div>
      </div>
    </>
  );
}

function App() {
  const ingredientsQuery = useIngredientsQuery();
  const [isBgmEnabled, setIsBgmEnabled] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(true);
  const [areInitialThreeAssetsReady, setAreInitialThreeAssetsReady] =
    useState(false);
  const isInitialRevealReady =
    ingredientsQuery.isSuccess && areInitialThreeAssetsReady;
  const handleInitialRevealComplete = useCallback(() => {
    setIsBgmEnabled(true);
  }, []);
  const handleToggleBgm = useCallback(() => {
    setIsBgmPlaying((currentValue) => !currentValue);
  }, []);

  return (
    <RouteTransitionProvider
      isInitialRevealReady={isInitialRevealReady}
      onInitialRevealComplete={handleInitialRevealComplete}
    >
      <LoopingBgm isEnabled={isBgmEnabled} isPlaying={isBgmPlaying} />
      <RoutedWidgets
        isBgmEnabled={isBgmEnabled}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
      />
      <div className="relative w-screen h-screen">
        <ThreeCanvas onInitialSceneAssetsReady={setAreInitialThreeAssetsReady} />
      </div>
    </RouteTransitionProvider>
  );
}

export default App;
