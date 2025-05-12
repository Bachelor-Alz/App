import { Fragment } from "react";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import { Rect, SkFont, Text as SKText } from "@shopify/react-native-skia";
import { MD3Theme } from "react-native-paper";

export type DataPoint = {
  value: SharedValue<number>;
  position: SharedValue<number>;
};

export type TooltipEntry = {
  label: string;
  value: SharedValue<number>;
  position: SharedValue<number>;
  color?: string;
};

export type ToolTipProps = {
  x: DataPoint;
  entries: TooltipEntry[];
  labels?: { x?: string };
  theme: MD3Theme;
  font: SkFont | null;
};

export function ToolTip({ x, entries, labels, theme, font: boldFont }: ToolTipProps) {
  const yTexts = entries.map((entry) =>
    useDerivedValue(() => `${entry.label}: ${Math.round(entry.value.value)}`, [entry])
  );

  const maxLength = Math.max(
    ...yTexts.map((text) => text.value.length),
    (labels?.x ? `${labels.x} ${x.value.value}` : `${x.value.value}`).length
  );

  const textPadding = 10;
  const boxWidth = maxLength * 9 + textPadding * 2;
  const boxHeight = 30 + entries.length * 20;
  const circleRadius = 5;
  const margin = 20;

  const tooltipY = useDerivedValue(() => {
    const safeY = Math.max(...entries.map((e) => e.position.value));
    return safeY < boxHeight + margin ? safeY + circleRadius * 25 + margin : safeY - boxHeight - margin;
  }, [entries]);

  const tooltipX = useDerivedValue(() => {
    const safeX = x.position.value;
    const screenWidth = 360;
    if (safeX - boxWidth / 2 < margin * 2) return margin * 2;
    if (safeX + boxWidth / 2 > screenWidth - margin) return screenWidth - boxWidth - margin;
    return safeX - boxWidth / 2;
  }, [x]);

  const xLabel = useDerivedValue(
    () =>
      labels?.x
        ? `${labels.x} ${new Date(x.value.value).toLocaleTimeString(undefined, {
            month: "2-digit",
            day: "2-digit",
          })}`
        : `${new Date(x.value.value).toLocaleTimeString(undefined, {
            month: "2-digit",
            day: "2-digit",
          })}`,
    [x, labels]
  );

  return (
    <Fragment>
      <Rect
        x={useDerivedValue(() => tooltipX.value - 2, [tooltipX])}
        y={useDerivedValue(() => tooltipY.value - 2, [tooltipY])}
        width={boxWidth + 4}
        height={boxHeight + 4}
        color={theme.colors.onSurface}
        strokeWidth={1}
        strokeCap="round"
        strokeJoin="round"
        style="stroke"
      />
      <Rect
        x={tooltipX}
        y={tooltipY}
        width={boxWidth}
        height={boxHeight}
        color={theme.colors.surface}
        opacity={0.9}
      />

      <SKText
        text={xLabel}
        x={useDerivedValue(() => tooltipX.value + textPadding, [tooltipX])}
        y={useDerivedValue(() => tooltipY.value + 20, [tooltipY])}
        color={theme.colors.onSurface}
        font={boldFont}
      />

      {yTexts.map((text, index) => (
        <SKText
          key={index}
          text={text}
          x={useDerivedValue(() => tooltipX.value + textPadding, [tooltipX])}
          y={useDerivedValue(() => tooltipY.value + 40 + index * 20, [tooltipY])}
          color={entries[index].color ?? theme.colors.primary}
          font={boldFont}
        />
      ))}
    </Fragment>
  );
}
