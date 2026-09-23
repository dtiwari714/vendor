// ---------------------------------------------------------------------------
// Mock data + localStorage persistence.
// On first load we seed localStorage with the data below. After that, every
// read/write goes through localStorage so added vendors/vehicles/drivers and
// updated permissions survive a page refresh.
// ---------------------------------------------------------------------------

const STORAGE_KEYS = {
  vendors: "vms_vendors",
  vehicles: "vms_vehicles",
  drivers: "vms_drivers",
  delegations: "vms_delegations",
};

const initialVendors = [
  { id: 1, name: "National Fleet Operator", type: "Super Vendor", level: 0, parentId: null, location: "Pan India" },
  { id: 2, name: "Regional Punjab", type: "Regional Vendor", level: 1, parentId: 1, location: "Punjab" },
  { id: 3, name: "Regional Gujarat", type: "Regional Vendor", level: 1, parentId: 1, location: "Gujarat" },
  { id: 4, name: "Ludhiana Vendor", type: "City Vendor", level: 2, parentId: 2, location: "Ludhiana" },
  { id: 5, name: "Chandigarh Vendor", type: "City Vendor", level: 2, parentId: 2, location: "Chandigarh" },
  { id: 6, name: "Surat Vendor", type: "City Vendor", level: 2, parentId: 3, location: "Surat" },
];

const initialVehicles = [
  { id: 1, regNo: "PB10AB1234", model: "Swift Dzire", seats: 4, fuel: "CNG", vendor: "Ludhiana Vendor", driver: "Rahul Kumar", status: "Active" },
  { id: 2, regNo: "PB10CD5678", model: "WagonR", seats: 4, fuel: "CNG", vendor: "Ludhiana Vendor", driver: "Amit Singh", status: "Active" },
  { id: 3, regNo: "CH01EF1234", model: "Ertiga", seats: 6, fuel: "Petrol", vendor: "Chandigarh Vendor", driver: "Rohit Sharma", status: "Active" },
  { id: 4, regNo: "GJ01GH5678", model: "Swift Dzire", seats: 4, fuel: "CNG", vendor: "Surat Vendor", driver: "Suresh Patel", status: "Active" },
];

const initialDrivers = [
  { id: 1, name: "Rahul Kumar", phone: "9876543210", license: "DL-PB-12345", vehicle: "PB10AB1234", vendor: "Ludhiana Vendor", status: "Active" },
  { id: 2, name: "Amit Singh", phone: "9876543211", license: "DL-PB-12346", vehicle: "PB10CD5678", vendor: "Ludhiana Vendor", status: "Active" },
  { id: 3, name: "Rohit Sharma", phone: "9876543212", license: "DL-CH-12347", vehicle: "CH01EF1234", vendor: "Chandigarh Vendor", status: "Active" },
  { id: 4, name: "Suresh Patel", phone: "9876543213", license: "DL-GJ-12348", vehicle: "GJ01GH5678", vendor: "Surat Vendor", status: "Active" },
];

// Permission keys used across the Delegation page.
export const PERMISSION_DEFS = [
  { key: "fleetOnboarding", label: "Fleet onboarding & assignments", group: "Fleet Management" },
  { key: "driverOnboarding", label: "Driver onboarding & verification", group: "Driver Management" },
  { key: "bookingManagement", label: "Booking Management", group: "Operational Tasks" },
  { key: "payments", label: "Payments", group: "Operational Tasks" },
  { key: "complianceTracking", label: "Compliance Tracking", group: "Operational Tasks" },
];

const initialDelegations = {
  "Regional Punjab": { fleetOnboarding: true, driverOnboarding: true, bookingManagement: false, payments: false, complianceTracking: true },
  "Regional Gujarat": { fleetOnboarding: true, driverOnboarding: true, bookingManagement: false, payments: false, complianceTracking: false },
  "Ludhiana Vendor": { fleetOnboarding: true, driverOnboarding: true, bookingManagement: false, payments: false, complianceTracking: false },
  "Chandigarh Vendor": { fleetOnboarding: true, driverOnboarding: false, bookingManagement: false, payments: false, complianceTracking: false },
  "Surat Vendor": { fleetOnboarding: true, driverOnboarding: true, bookingManagement: false, payments: false, complianceTracking: true },
};

// Generic read helper: returns parsed JSON from localStorage, or null.
function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can fail (private mode, quota) - fail silently for this demo.
  }
}

// Seeds localStorage on first run only; leaves existing data untouched
// on subsequent loads so user-added records persist.
export function seedIfEmpty() {
  if (readStorage(STORAGE_KEYS.vendors) === null) writeStorage(STORAGE_KEYS.vendors, initialVendors);
  if (readStorage(STORAGE_KEYS.vehicles) === null) writeStorage(STORAGE_KEYS.vehicles, initialVehicles);
  if (readStorage(STORAGE_KEYS.drivers) === null) writeStorage(STORAGE_KEYS.drivers, initialDrivers);
  if (readStorage(STORAGE_KEYS.delegations) === null) writeStorage(STORAGE_KEYS.delegations, initialDelegations);
}

export function getVendors() {
  return readStorage(STORAGE_KEYS.vendors) || initialVendors;
}
export function saveVendors(vendors) {
  writeStorage(STORAGE_KEYS.vendors, vendors);
}

export function getVehicles() {
  return readStorage(STORAGE_KEYS.vehicles) || initialVehicles;
}
export function saveVehicles(vehicles) {
  writeStorage(STORAGE_KEYS.vehicles, vehicles);
}

export function getDrivers() {
  return readStorage(STORAGE_KEYS.drivers) || initialDrivers;
}
export function saveDrivers(drivers) {
  writeStorage(STORAGE_KEYS.drivers, drivers);
}

export function getDelegations() {
  return readStorage(STORAGE_KEYS.delegations) || initialDelegations;
}
export function saveDelegations(delegations) {
  writeStorage(STORAGE_KEYS.delegations, delegations);
}

export const STORAGE_KEY_NAMES = STORAGE_KEYS;
