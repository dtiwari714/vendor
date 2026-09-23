import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Hierarchy from "./pages/Hierarchy";
import Delegation from "./pages/Delegation";
import VehiclesDrivers from "./pages/VehiclesDrivers";
import { seedIfEmpty } from "./data/mockData";

export default function App() {
  // Seed localStorage with mock data once, on first app load.
  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hierarchy" element={<Hierarchy />} />
          <Route path="/delegation" element={<Delegation />} />
          <Route path="/vehicles-drivers" element={<VehiclesDrivers />} />
        </Routes>
      </main>
    </div>
  );
}
