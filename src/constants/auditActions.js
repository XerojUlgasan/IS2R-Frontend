// Audit log action types (must match the values the backend stores).
export const AUDIT_ACTION_OPTIONS = [
  { value: "ADD_MATERIAL", label: "Add material" },
  { value: "EDIT_MATERIAL", label: "Edit material" },
  { value: "DELETE_MATERIAL", label: "Delete material" },
  { value: "ADD_STOCKS", label: "Add stocks" },
  { value: "EDIT_STOCK", label: "Edit stock" },
  { value: "DELETE_STOCKS", label: "Delete stocks" },
  { value: "INVITE_MEMBER", label: "Invite member" },
  { value: "CONFIGURE_MEMBER", label: "Configure member" },
  { value: "REMOVE_MEMBER", label: "Remove member" },
];

const LABELS = AUDIT_ACTION_OPTIONS.reduce((acc, o) => {
  acc[o.value] = o.label;
  return acc;
}, {});

// Human label for an action; falls back to the raw value.
export function actionLabel(action) {
  return LABELS[action] || action || "—";
}

// Badge styling by intent: add/invite = solid, edit/configure = outline,
// delete/remove = error.
export function actionBadgeClass(action) {
  const a = String(action || "").toUpperCase();
  if (a.startsWith("DELETE") || a.startsWith("REMOVE")) {
    return "bg-error text-on-error";
  }
  if (a.startsWith("EDIT") || a.startsWith("CONFIGURE")) {
    return "border-2 border-primary bg-surface text-primary";
  }
  return "bg-primary text-on-primary";
}
