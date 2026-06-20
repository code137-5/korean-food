import { Outlet } from "react-router-dom";

export function SeasonsPage() {
  return (
    <div className="absolute left-0 right-0 ">
      <div className="relative w-16 h-16 flex flex-col p-2 bg-green-500 pointer-events-auto">
        <Outlet />
      </div>
    </div>
  );
}
