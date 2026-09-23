import { Building2, MapPin, Car, User } from "lucide-react";

// Renders one vendor node plus its children, recursively. Vehicle/driver
// counts are computed by the parent (Hierarchy.jsx) and passed in via
// `counts` keyed by vendor name, so this component stays purely visual.
function VendorNode({ vendor, vendors, counts, depth }) {
  const children = vendors.filter((v) => v.parentId === vendor.id);
  const count = counts[vendor.name] || { vehicles: 0, drivers: 0 };

  return (
    <div className={depth > 0 ? "ml-8 mt-3 border-l border-slate-200 pl-6" : "mt-3"}>
      <div className="card p-4 max-w-md">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-brand-600" />
              <span className="font-medium text-slate-800">{vendor.name}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{vendor.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={13} /> {vendor.location}
          </span>
          <span className="flex items-center gap-1">
            <Car size={13} /> {count.vehicles} vehicles
          </span>
          <span className="flex items-center gap-1">
            <User size={13} /> {count.drivers} drivers
          </span>
        </div>
      </div>

      {children.map((child) => (
        <VendorNode
          key={child.id}
          vendor={child}
          vendors={vendors}
          counts={counts}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function VendorTree({ vendors, counts }) {
  const roots = vendors.filter((v) => v.parentId === null);
  return (
    <div>
      {roots.map((root) => (
        <VendorNode key={root.id} vendor={root} vendors={vendors} counts={counts} depth={0} />
      ))}
    </div>
  );
}
