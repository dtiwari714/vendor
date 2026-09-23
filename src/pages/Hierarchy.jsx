import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import VendorTree from "../components/VendorTree";
import { getVendors, saveVendors, getVehicles, getDrivers } from "../data/mockData";

const EMPTY_FORM = { name: "", type: "City Vendor", location: "", parentId: "" };

export default function Hierarchy() {
  const [vendors, setVendors] = useState([]);
  const [counts, setCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setVendors(getVendors());
    computeCounts();
  }, []);

  // Vehicle/driver counts per vendor name, used by the tree cards.
  function computeCounts() {
    const vehicles = getVehicles();
    const drivers = getDrivers();
    const next = {};
    vehicles.forEach((v) => {
      next[v.vendor] = next[v.vendor] || { vehicles: 0, drivers: 0 };
      next[v.vendor].vehicles += 1;
    });
    drivers.forEach((d) => {
      next[d.vendor] = next[d.vendor] || { vehicles: 0, drivers: 0 };
      next[d.vendor].drivers += 1;
    });
    setCounts(next);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.parentId) return;

    const parent = vendors.find((v) => v.id === Number(form.parentId));
    const newVendor = {
      id: Date.now(),
      name: form.name.trim(),
      type: form.type,
      location: form.location.trim(),
      parentId: Number(form.parentId),
      level: parent ? parent.level + 1 : 1,
    };

    const updated = [...vendors, newVendor];
    setVendors(updated);
    saveVendors(updated);
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Vendor Hierarchy</h1>
          <p className="text-sm text-slate-500 mt-1">Multi-level vendor structure and reach</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Sub Vendor
        </button>
      </div>

      <div className="mt-6">
        <VendorTree vendors={vendors} counts={counts} />
      </div>

      {showModal && (
        <Modal title="Add Sub Vendor" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-sm text-slate-600 block mb-1">Vendor Name</label>
              <input
                className="input-field"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Jalandhar Vendor"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Vendor Type</label>
              <select className="input-field" name="type" value={form.type} onChange={handleChange}>
                <option>Regional Vendor</option>
                <option>City Vendor</option>
                <option>Local Vendor</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Location</label>
              <input
                className="input-field"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Jalandhar"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Parent Vendor</label>
              <select
                className="input-field"
                name="parentId"
                value={form.parentId}
                onChange={handleChange}
                required
              >
                <option value="">Select parent vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
