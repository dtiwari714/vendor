import { useEffect, useState } from "react";
import { Building2, Car, User, Network } from "lucide-react";
import { getVendors, getVehicles, getDrivers } from "../data/mockData";

const ACTIVITY = [
  "Chandigarh Vendor onboarded a new driver - Rohit Sharma",
  "Regional Punjab was granted Compliance Tracking access",
  "Ludhiana Vendor added vehicle PB10CD5678",
  "Surat Vendor onboarded driver Suresh Patel",
];

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="bg-brand-600/10 text-brand-600 rounded-md p-3">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ vendors: 0, vehicles: 0, drivers: 0, subVendors: 0 });

  useEffect(() => {
    const vendors = getVendors();
    const vehicles = getVehicles();
    const drivers = getDrivers();
    setStats({
      vendors: vendors.length,
      vehicles: vehicles.length,
      drivers: drivers.length,
      subVendors: vendors.filter((v) => v.level > 0).length,
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1">Overview of your vendor network</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard icon={Building2} label="Total Vendors" value={stats.vendors} />
        <StatCard icon={Car} label="Total Vehicles" value={stats.vehicles} />
        <StatCard icon={User} label="Total Drivers" value={stats.drivers} />
        <StatCard icon={Network} label="Sub Vendors" value={stats.subVendors} />
      </div>

      <div className="card p-5 mt-6">
        <h2 className="font-medium text-slate-800 mb-3">Recent Activity</h2>
        <ul className="space-y-2">
          {ACTIVITY.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
