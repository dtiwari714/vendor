import { NavLink } from "react-router-dom";
import { LayoutDashboard, Network, ShieldCheck, Car } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/hierarchy", label: "Vendor Hierarchy", icon: Network },
  { to: "/delegation", label: "Delegation", icon: ShieldCheck },
  { to: "/vehicles-drivers", label: "Vehicles & Drivers", icon: Car },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-navy-900 text-slate-200 flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-navy-700">
        <p className="text-white font-semibold text-lg leading-tight">Vendor Management</p>
        <p className="text-xs text-slate-400 mt-1">Cab &amp; Driver Onboarding</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-navy-700 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-navy-700">
        <p className="text-sm font-medium text-white">National Fleet Operator</p>
        <p className="text-xs text-slate-400">Super Vendor</p>
      </div>
    </aside>
  );
}
