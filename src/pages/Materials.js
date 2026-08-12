import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useActiveBusiness } from "../context/ActiveBusinessContext";
import { useMaterials } from "../hooks/useMaterials";
import { usePermissions } from "../hooks/usePermissions";
import { clearMaterialSearchCache } from "../hooks/useMaterialSearch";
import MaterialFormModal from "../components/materials/MaterialFormModal";
import AddStockModal from "../components/materials/AddStockModal";
import DeleteMaterialDialog from "../components/materials/DeleteMaterialDialog";

// Backend sends status as "AVAILABLE" | "CONSUMED"; derive as a fallback.
function resolveStatus(material) {
  if (material.status) return String(material.status).toUpperCase();
  const qty = Number(material.quantity) || 0;
  return qty > 0 ? "AVAILABLE" : "CONSUMED";
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function StatusBadge({ status, unstocked }) {
  if (status === "AVAILABLE") {
    return (
      <span className="inline-flex items-center px-sm py-xs bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest">
        Available
      </span>
    );
  }
  // A CONSUMED material that has never been stocked is really just "new".
  if (unstocked) {
    return (
      <span className="inline-flex items-center px-sm py-xs border border-outline text-on-surface font-label-md text-label-md uppercase tracking-widest">
        Unstocked
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-sm py-xs border border-outline-variant bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase tracking-widest">
      Consumed
    </span>
  );
}

function Materials() {
  const navigate = useNavigate();
  const { activeBusiness } = useActiveBusiness();
  const businessId = activeBusiness?.id;
  const { materials, loading, error, refetch } = useMaterials(businessId);
  const { can } = usePermissions();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("ALL"); // ALL | AVAILABLE | CONSUMED
  const [modal, setModal] = useState(null); // { type, material }

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  useEffect(() => {
    if (error && error.status === 401) goToLogin();
  }, [error, goToLogin]);

  // Attach a resolved status to each material once.
  const withStatus = useMemo(
    () => materials.map((m) => ({ ...m, _status: resolveStatus(m) })),
    [materials]
  );

  const counts = useMemo(
    () => ({
      all: withStatus.length,
      available: withStatus.filter((m) => m._status === "AVAILABLE").length,
      consumed: withStatus.filter((m) => m._status === "CONSUMED").length,
    }),
    [withStatus]
  );

  const filtered = useMemo(() => {
    return withStatus.filter((m) => {
      const matchesTab = tab === "ALL" || m._status === tab;
      const matchesQuery = !query.trim() || (m.name || "").toLowerCase().includes(query.trim().toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [withStatus, tab, query]);

  // Any successful mutation refreshes the list and closes the modal. It also
  // clears the material-search cache so renamed/deleted materials never linger
  // in the Sales search typeahead.
  const handleMutated = () => {
    clearMaterialSearchCache();
    setModal(null);
    refetch();
  };

  const tabClass = (active) =>
    active
      ? "px-md py-sm border-b-2 border-primary font-label-md text-label-md text-primary uppercase tracking-widest whitespace-nowrap"
      : "px-md py-sm border-b-2 border-transparent hover:border-outline text-on-surface-variant font-label-md text-label-md uppercase tracking-widest whitespace-nowrap transition-colors";

  // No workspace chosen yet.
  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[60vh] px-4 text-center">
        <span className="material-symbols-outlined text-[32px] text-primary">inventory_2</span>
        <h2 className="font-headline-md text-headline-md text-primary">No workspace selected</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Choose a business to view and manage its materials.
        </p>
        <Link
          to="/my-businesses"
          className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors"
        >
          Select Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-lg">
      {/* Header */}
      <div className="mb-md flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col">
          <h2 className="font-headline-lg text-headline-lg text-primary tracking-tighter">Materials Inventory</h2>
          <p className="mt-xs max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Manage raw printing materials, monitor stock levels, and track manufacturing costs across your active catalog.
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-md sm:flex-row sm:items-center md:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              className="w-full h-10 pl-xl pr-sm bg-surface border border-outline font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-none placeholder:text-on-surface-variant"
              placeholder="Search materials..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-sm shrink-0">
            <button
              onClick={() => setModal({ type: "create" })}
              disabled={!can("add_material")}
              title={can("add_material") ? "Add Material" : "You don't have permission to add materials"}
              className="h-10 px-md flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-md text-label-md uppercase tracking-widest whitespace-nowrap border-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Material
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-lg flex gap-sm overflow-x-auto border-b border-outline pb-px">
        <button className={tabClass(tab === "ALL")} onClick={() => setTab("ALL")}>
          All Materials ({counts.all})
        </button>
        <button className={tabClass(tab === "AVAILABLE")} onClick={() => setTab("AVAILABLE")}>
          Available ({counts.available})
        </button>
        <button className={tabClass(tab === "CONSUMED")} onClick={() => setTab("CONSUMED")}>
          Consumed ({counts.consumed})
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center gap-sm py-xl border border-outline bg-surface-container-lowest text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">refresh</span>
          <span className="font-body-md">Loading materials...</span>
        </div>
      )}

      {!loading && error && error.status !== 401 && (
        <div className="flex flex-col items-center justify-center gap-md py-xl border border-outline bg-surface-container-lowest text-center">
          <span className="material-symbols-outlined text-[32px] text-error">error</span>
          <p className="font-body-md text-body-md text-on-surface">{error.message || "Something went wrong, try again."}</p>
          <button
            onClick={refetch}
            className="px-lg py-md bg-primary text-on-primary font-label-md text-label-md uppercase tracking-widest border border-primary hover:bg-surface hover:text-primary transition-colors flex items-center gap-sm"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-xl px-lg border border-outline bg-surface-container-lowest text-center">
          <div className="w-16 h-16 bg-surface-container rounded-none flex items-center justify-center border border-outline mb-md">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant">inventory_2</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-primary mb-sm">
            {withStatus.length === 0 ? "No Materials Yet" : "No matching materials"}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-md">
            {withStatus.length === 0
              ? "Your inventory is currently empty. Add your first material to start tracking stock levels and manufacturing costs."
              : "Try adjusting your search or filter."}
          </p>
          {withStatus.length === 0 && (
            <button
              onClick={() => setModal({ type: "create" })}
              disabled={!can("add_material")}
              title={can("add_material") ? "Add Material" : "You don't have permission to add materials"}
              className="h-12 px-lg flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-primary/90 transition-colors font-label-md text-label-md uppercase tracking-widest border-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Your First Material
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="w-full overflow-x-auto border border-outline bg-surface-container-lowest">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline">
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest w-1/4">Name</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Type</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Unit</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Quantity</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Mfg Price (₱)</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Last Stocked</th>
                <th className="py-md px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {filtered.map((m) => {
                const consumed = m._status === "CONSUMED";
                const unstocked = !m.last_stocked_at;
                return (
                  <tr key={m.id} className="hover:bg-surface-container transition-colors group border-b border-outline">
                    <td className="py-md px-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 bg-surface-container flex items-center justify-center border border-outline shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">inventory_2</span>
                        </div>
                        <span className={`font-body-md text-body-md text-on-surface font-bold ${consumed ? "opacity-50" : ""}`}>
                          {m.name || "Untitled material"}
                        </span>
                      </div>
                    </td>
                    <td className={`py-md px-md font-body-sm text-body-sm text-on-surface ${consumed ? "opacity-50" : ""}`}>{m.type || "—"}</td>
                    <td className={`py-md px-md font-body-sm text-body-sm text-on-surface ${consumed ? "opacity-50" : ""}`}>{m.unit || "—"}</td>
                    <td className={`py-md px-md font-body-md text-body-md font-bold text-right text-on-surface ${consumed ? "opacity-50" : ""}`}>
                      {m.quantity ?? 0}
                    </td>
                    <td className={`py-md px-md font-body-md text-body-md text-on-surface font-mono text-right ${consumed ? "opacity-50" : ""}`}>
                      {formatPrice(m.mfg_price)}
                    </td>
                    <td className="py-md px-md">
                      <StatusBadge status={m._status} unstocked={unstocked} />
                    </td>
                    <td className={`py-md px-md font-body-sm text-body-sm text-on-surface-variant ${consumed ? "opacity-50" : ""}`}>
                      {formatDate(m.last_stocked_at)}
                    </td>
                    <td className="py-md px-md text-right">
                      <div className="flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal({ type: "stock", material: m })}
                          disabled={!can("add_stocks")}
                          className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title={can("add_stocks") ? "Add Stock" : "You don't have permission to add stock"}
                        >
                          <span className="material-symbols-outlined text-[18px]">add_box</span>
                        </button>
                        <button
                          onClick={() => setModal({ type: "edit", material: m })}
                          disabled={!can("update_material")}
                          className="p-xs hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          title={can("update_material") ? "Edit" : "You don't have permission to edit materials"}
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => setModal({ type: "delete", material: m })}
                          disabled={!can("delete_material")}
                          className="p-xs hover:bg-error-container hover:text-error transition-colors text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-on-surface-variant"
                          title={can("delete_material") ? "Delete" : "You don't have permission to delete materials"}
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex items-center justify-between py-md border-t border-outline">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {filtered.length} of {withStatus.length} materials
          </p>
        </div>
      )}

      {/* Modals */}
      {modal?.type === "create" && (
        <MaterialFormModal
          mode="create"
          businessId={businessId}
          onClose={() => setModal(null)}
          onSaved={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {modal?.type === "edit" && (
        <MaterialFormModal
          mode="edit"
          material={modal.material}
          onClose={() => setModal(null)}
          onSaved={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {modal?.type === "stock" && (
        <AddStockModal
          material={modal.material}
          onClose={() => setModal(null)}
          onSaved={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteMaterialDialog
          material={modal.material}
          onClose={() => setModal(null)}
          onDeleted={handleMutated}
          onUnauthorized={goToLogin}
        />
      )}
    </div>
  );
}

export default Materials;
