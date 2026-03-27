export const formatShortCurrency = (amount) => {
  if (!amount) return "$0";
  if (amount >= 1000000)
    return "$" + (amount / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (amount >= 1000)
    return "$" + (amount / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return "$" + amount;
};

export const calculateTotalRevenue = (projects) =>
  projects.reduce((total, proj) => total + (Number(proj.revenue) || 0), 0);

export const calculateTotalHeadcount = (projects) => {
  if (!projects) return 0;
  return projects.reduce((total, proj) => {
    const locSum = (proj.locations || []).reduce(
      (sum, loc) => sum + (Number(loc.headcount) || 0),
      0,
    );
    return total + locSum;
  }, 0);
};

export const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
