import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useSPO2 } from "@/hooks/useHealth";

export const useSPO2DisplayData = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";
  const [period, setPeriod] = useState<"Hour" | "Day" | "Week">("Hour");
  const date = useMemo(() => new Date().toISOString(), []);

  const { data, isLoading, error } = useSPO2(elderEmail, date, period);

  const latest = data?.[0];
  const spo2 =
    latest?.currentSpo2?.spO2 != null ? `${Math.round(Number(latest.currentSpo2.spO2) * 100)}%` : "N/A";
  const minSPO2 = latest?.spo2?.minSpO2 != null ? `${Math.round(Number(latest.spo2.minSpO2) * 100)}%` : "N/A";
  const maxSPO2 = latest?.spo2?.maxSpO2 != null ? `${Math.round(Number(latest.spo2.maxSpO2) * 100)}%` : "N/A";

  return {
    period,
    setPeriod,
    isLoading,
    error,
    hasData: !!data && data.length > 0,
    spo2,
    minSPO2,
    maxSPO2,
  };
};
