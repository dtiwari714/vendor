import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getVendors, getDelegations, saveDelegations, PERMISSION_DEFS } from "../data/mockData";

// Group permission defs by their section label for rendering.
const GROUPS = [...new Set(PERMISSION_DEFS.map((p) => p.group))];

export default function Delegation() {
  const [vendors, setVendors] = useState([]);
  const [delegations, setDelegations] = useState({});
  const [selected, setSelected] = useState("");
  const [permissions, setPermissions] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    const allVendors = getVendors().filter((v) => v.level > 0); // sub-vendors only
    const allDelegations = getDelegations();
    setVendors(allVendors);
    setDelegations(allDelegations);
    if (allVendors.length > 0) {
      setSelected(allVendors[0].name);
      setPermissions(allDelegations[allVendors[0].name] || {});
    }
  }, []);

  function handleSelectVendor(name) {
    setSelected(name);
    setPermissions(delegations[name] || {});
  }

  function togglePermission(key) {
    setPermissions({ ...permissions, [key]: !permissions[key] });
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function handleSavePermissions() {
    const updated = { ...delegations, [selected]: permissions };
    setDelegations(updated);
    saveDelegations(updated);
    showToast("Permissions updated successfully");
  }

  function handleRevokeAccess() {
    const revoked = Object.fromEntries(PERMISSION_DEFS.map((p) => [p.key, false]));
    setPermissions(revoked);
    const updated = { ...delegations, [selected]: revoked };
    setDelegations(updated);
    saveDelegations(updated);
    showToast("Access revoked successfully");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-800">Delegation</h1>
      <p className="text-sm text-slate-500 mt-1">Grant or revoke access for sub-vendors</p>

      <div className="card p-5 mt-6 max-w-xl">
        <label className="text-sm text-slate-600 block mb-1">Select Vendor</label>
        <select
          className="input-field mb-5"
          value={selected}
          onChange={(e) => handleSelectVendor(e.target.value)}
        >
          {vendors.map((v) => (
            <option key={v.id} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>

        {GROUPS.map((group) => (
          <div key={group} className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              {group}
            </p>
            <div className="space-y-2">
              {PERMISSION_DEFS.filter((p) => p.group === group).map((p) => (
                <label key={p.key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-brand-600"
                    checked={!!permissions[p.key]}
                    onChange={() => togglePermission(p.key)}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <button className="btn-primary" onClick={handleSavePermissions}>
            Save Permissions
          </button>
          <button className="btn-danger" onClick={handleRevokeAccess}>
            Revoke Access
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-3 rounded-md shadow-lg flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
