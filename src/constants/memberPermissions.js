// Allowed-action groups for a member, sectioned by domain. Each `key` is the
// permission flag the backend would store/return per member.
export const PERMISSION_GROUPS = [
  {
    label: "Materials",
    permissions: [
      { key: "material.create", label: "Add materials" },
      { key: "material.update", label: "Update materials" },
      { key: "material.delete", label: "Delete materials" },
    ],
  },
  {
    label: "Stocks",
    permissions: [
      { key: "stock.create", label: "Add stocks" },
      { key: "stock.update", label: "Update stocks" },
      { key: "stock.delete", label: "Delete stocks" },
    ],
  },
  {
    label: "Sales",
    permissions: [
      { key: "sale.create", label: "Create sales" },
      { key: "sale.update", label: "Update sales" },
      { key: "sale.delete", label: "Delete sales" },
    ],
  },
  {
    label: "Expenses",
    permissions: [
      { key: "expense.create", label: "Add expenses" },
      { key: "expense.update", label: "Update expenses" },
      { key: "expense.delete", label: "Delete expenses" },
    ],
  },
];

// Flat list of every permission key (handy for defaults / validation).
export const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));
