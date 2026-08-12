import { useCallback, useMemo } from "react";
import { useActiveBusiness } from "../context/ActiveBusinessContext";

// Granted member_actions columns returned per business by GET /api/businesses.
export const ACTION_COLUMNS = [
  "add_material",
  "update_material",
  "delete_material",
  "add_stocks",
  "update_stocks",
  "delete_stocks",
  "create_sales",
  "update_sales",
  "delete_sales",
  "add_expense",
  "update_expense",
  "delete_expense",
];

// Reads the active business's granted actions and exposes a `can(action)`
// checker used to gate permission-scoped UI. The Owner is not constrained by
// member_actions, so they can perform every action.
export function usePermissions() {
  const { activeBusiness } = useActiveBusiness();
  const role = String(activeBusiness?.role || "").toLowerCase();
  const isOwner = role === "owner";
  const actions = useMemo(() => activeBusiness?.actions || [], [activeBusiness?.actions]);

  const can = useCallback(
    (action) => isOwner || actions.includes(action),
    [isOwner, actions]
  );

  return { can, isOwner, actions };
}
