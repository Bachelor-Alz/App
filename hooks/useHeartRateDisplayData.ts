import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useHeartRate } from "@/hooks/useHealth";

export const useHeartRateDisplayData = () => {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const elderEmail = email || "";
  const [period, setPeriod] = useState<"Hour" | "Day" | "Week">("Hour");
  const date = useMemo(() => new Date().toISOString(), []);

  const { data, isLoading, error } = useHeartRate(elderEmail, date, period);

  const latest = data?.[0];
  const heartRate = latest?.currentHeartRate?.heartrate ?? "N/A";
  const minBPM = latest?.heartrate?.minrate ?? "N/A";
  const maxBPM = latest?.heartrate?.maxrate ?? "N/A";
  const restingHeartRate = latest?.heartrate?.avgrate ?? "N/A";

  return {
    period,
    setPeriod,
    isLoading,
    error,
    hasData: !!data && data.length > 0,
    heartRate,
    minBPM,
    maxBPM,
    restingHeartRate,
  };
};
