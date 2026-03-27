import { localOrgData } from "../constants/mockData";

export const fetchOrgChartData = async () => {
  try {
    const appScriptUrl =
      "https://script.google.com/macros/s/AKfycbytCI-3lYd6_VED5nIyg8Ulvieb6rdvXzqFpWLcRMZE9fSzDUbThkL8GTWwJrQOZvyhlg/exec";

    const response = await fetch(appScriptUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      "Failed to fetch from AppScript, falling back to local data:",
      error,
    );
    return localOrgData;
  }
};
