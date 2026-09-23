import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/Modal";
import {
  getVendors,
  getVehicles,
  saveVehicles,
  getDrivers,
  saveDrivers,
} from "../data/mockData";

const EMPTY_VEHICLE = { regNo: "", model: "", seats: "4", fuel: "CNG", vendor: "", driver: "" };
const EMPTY_DRIVER = { name: "", phone: "", license: "", vendor: "", vehicle: "" };

export default function VehiclesDrivers() {
  const [tab, setTab] = useState("vehicles");
  const [vendors, setVendors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [vehicleForm, setVehicleForm] = useState(EMPTY_VEHICLE);
  const [driverForm, setDriverForm] = useState(EMPTY_DRIVER);
  const [error, setError] = useState("");

  useEffect(() => {
    setVendors(getVendors());
    setVehicles(getVehicles());
    setDrivers(getDrivers());
  }, []);

  // ---------- Vehicle form ----------
  function handleVehicleChange(e) {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  }

  function handleSaveVehicle(e) {
    e.preventDefault();
    setError("");

    // Registration number must be unique (basic business rule).
    const duplicate = vehicles.some(
      (v) => v.regNo.toLowerCase() === vehicleForm.regNo.trim().toLowerCase()
    );
    if (duplicate) {
      setError("A vehicle with this registration number already exists.");
      return;
    }
    if (!vehicleForm.regNo.trim() || !vehicleForm.model.trim() || !vehicleForm.vendor) {
      setError("Please fill in all required fields.");
      return;
    }

    const newVehicle = {
      id: Date.now(),
      regNo: vehicleForm.regNo.trim().toUpperCase(),
      model: vehicleForm.model.trim(),
      seats: Number(vehicleForm.seats),
      fuel: vehicleForm.fuel,
      vendor: vehicleForm.vendor,
      driver: vehicleForm.driver || "Unassigned",
      status: "Active",
    };

    const updated = [...vehicles, newVehicle];
    setVehicles(updated);
    saveVehicles(updated);
    setVehicleForm(EMPTY_VEHICLE);
    setShowVehicleModal(false);
  }

  // ---------- Driver form ----------
  function handleDriverChange(e) {
    setDriverForm({ ...driverForm, [e.target.name]: e.target.value });
  }

  function handleSaveDriver(e) {
    e.preventDefault();
    setError("");

    // License number must be unique (basic business rule).
    const duplicate = drivers.some(
      (d) => d.license.toLowerCase() === driverForm.license.trim().toLowerCase()
    );
    if (duplicate) {
      setError("A driver with this license number already exists.");
      return;
    }
    if (!driverForm.name.trim() || !driverForm.phone.trim() || !driverForm.license.trim() || !driverForm.vendor) {
      setError("Please fill in all required fields.");
      return;
    }

    const newDriver = {
      id: Date.now(),
      name: driverForm.name.trim(),
      phone: driverForm.phone.trim(),
      license: driverForm.license.trim().toUpperCase(),
      vehicle: driverForm.vehicle || "Unassigned",
      vendor: driverForm.vendor,
      status: "Active",
    };

    const updated = [...drivers, newDriver];
    setDrivers(updated);
    saveDrivers(updated);

    // If a vehicle was assigned, reflect the driver's name on that vehicle too.
    if (driverForm.vehicle) {
      const updatedVehicles = vehicles.map((v) =>
        v.regNo === driverForm.vehicle ? { ...v, driver: newDriver.name } : v
      );
      setVehicles(updatedVehicles);
      saveVehicles(updatedVehicles);
    }

    setDriverForm(EMPTY_DRIVER);
    setShowDriverModal(false);
  }

  function openVehicleModal() {
    setError("");
    setVehicleForm(EMPTY_VEHICLE);
    setShowVehicleModal(true);
  }

  function openDriverModal() {
    setError("");
    setDriverForm(EMPTY_DRIVER);
    setShowDriverModal(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Vehicles &amp; Drivers</h1>
          <p className="text-sm text-slate-500 mt-1">Onboard and manage fleet &amp; drivers</p>
        </div>
        {tab === "vehicles" ? (
          <button className="btn-primary flex items-center gap-2" onClick={openVehicleModal}>
            <Plus size={16} /> Add Vehicle
          </button>
        ) : (
          <button className="btn-primary flex items-center gap-2" onClick={openDriverModal}>
            <Plus size={16} /> Add Driver
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-6 border-b border-slate-200">
        {["vehicles", "drivers"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "vehicles" ? "Vehicles" : "Drivers"}
          </button>
        ))}
      </div>

      {/* Vehicles table */}
      {tab === "vehicles" && (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Registration No</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Seats</th>
                <th className="px-4 py-3 font-medium">Fuel</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Driver</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{v.regNo}</td>
                  <td className="px-4 py-3">{v.model}</td>
                  <td className="px-4 py-3">{v.seats}</td>
                  <td className="px-4 py-3">{v.fuel}</td>
                  <td className="px-4 py-3">{v.vendor}</td>
                  <td className="px-4 py-3">{v.driver}</td>
                  <td className="px-4 py-3">
                    <span className="badge-active">{v.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drivers table */}
      {tab === "drivers" && (
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Driver Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">License No</th>
                <th className="px-4 py-3 font-medium">Assigned Vehicle</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-700">{d.name}</td>
                  <td className="px-4 py-3">{d.phone}</td>
                  <td className="px-4 py-3">{d.license}</td>
                  <td className="px-4 py-3">{d.vehicle}</td>
                  <td className="px-4 py-3">{d.vendor}</td>
                  <td className="px-4 py-3">
                    <span className="badge-active">{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle modal */}
      {showVehicleModal && (
        <Modal title="Add Vehicle" onClose={() => setShowVehicleModal(false)}>
          <form onSubmit={handleSaveVehicle} className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label className="text-sm text-slate-600 block mb-1">Registration Number</label>
              <input
                className="input-field"
                name="regNo"
                value={vehicleForm.regNo}
                onChange={handleVehicleChange}
                placeholder="e.g. PB10XY9999"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Model</label>
              <input
                className="input-field"
                name="model"
                value={vehicleForm.model}
                onChange={handleVehicleChange}
                placeholder="e.g. Swift Dzire"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600 block mb-1">Seating Capacity</label>
                <input
                  className="input-field"
                  name="seats"
                  type="number"
                  min="2"
                  max="20"
                  value={vehicleForm.seats}
                  onChange={handleVehicleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-600 block mb-1">Fuel Type</label>
                <select className="input-field" name="fuel" value={vehicleForm.fuel} onChange={handleVehicleChange}>
                  <option>CNG</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Vendor</label>
              <select
                className="input-field"
                name="vendor"
                value={vehicleForm.vendor}
                onChange={handleVehicleChange}
                required
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Driver (optional)</label>
              <select className="input-field" name="driver" value={vehicleForm.driver} onChange={handleVehicleChange}>
                <option value="">Unassigned</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowVehicleModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Vehicle
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Driver modal */}
      {showDriverModal && (
        <Modal title="Add Driver" onClose={() => setShowDriverModal(false)}>
          <form onSubmit={handleSaveDriver} className="space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <label className="text-sm text-slate-600 block mb-1">Driver Name</label>
              <input
                className="input-field"
                name="name"
                value={driverForm.name}
                onChange={handleDriverChange}
                placeholder="e.g. Manpreet Singh"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Phone</label>
              <input
                className="input-field"
                name="phone"
                value={driverForm.phone}
                onChange={handleDriverChange}
                placeholder="e.g. 9876500000"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Driving License Number</label>
              <input
                className="input-field"
                name="license"
                value={driverForm.license}
                onChange={handleDriverChange}
                placeholder="e.g. DL-PB-99999"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Vendor</label>
              <select
                className="input-field"
                name="vendor"
                value={driverForm.vendor}
                onChange={handleDriverChange}
                required
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Assign Vehicle (optional)</label>
              <select className="input-field" name="vehicle" value={driverForm.vehicle} onChange={handleDriverChange}>
                <option value="">Unassigned</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.regNo}>
                    {v.regNo} - {v.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-secondary" onClick={() => setShowDriverModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Save Driver
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
