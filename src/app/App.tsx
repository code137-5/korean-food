import { useState } from "react";
import "./App.css";
import { ThreeCanvas } from "../3d/canvas";
import { Outlet } from "react-router-dom";

function RoutedWidgets() {
  return (
    <>
      <div className="absolute w-full h-full left-0 right-0 z-10 pointer-events-none">
        <Outlet />
      </div>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0);

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
