import { Outlet } from "react-router-dom";

export function SeasonsPage() {
  console.log("Home");

  return (
    <div className="absolute left-0 right-0 w-16 h-16 bg-green-500 pointer-events-auto">
      <Outlet />
    </div>
  );
}
