import { useEffect, useState } from "react";
import { fetchOrgChartData } from "../utils/dataFetching";
import { localOrgData } from "../constants/mockData";

export const useOrgChartData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchOrgChartData();
        setData(fetchedData);
      } catch (error) {
        console.error("Error loading org chart data:", error);
        setData(localOrgData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
