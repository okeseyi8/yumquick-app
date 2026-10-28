import { useState } from "react";
import { View } from "react-native";
import { T, styles } from "@/components/ui";
import { color } from "@/theme";

const STOPS = [1, 10, 25, 50, 100];

// Snaps to STOPS; the last stop means "$100 and up".
export function PriceSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [w, setW] = useState(0);
  const idx = Math.max(0, STOPS.indexOf(value));
  const pick = (x: number) => {
    const i = Math.round((Math.min(Math.max(x, 0), w) / w) * (STOPS.length - 1));
    if (STOPS[i] !== value) onChange(STOPS[i]);
  };
  const left = w ? (idx / (STOPS.length - 1)) * w : 0;

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Maximum price"
      accessibilityValue={{ text: idx === STOPS.length - 1 ? "Any price" : `Up to $${value}` }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => onChange(STOPS[Math.min(STOPS.length - 1, Math.max(0, idx + (e.nativeEvent.actionName === "increment" ? 1 : -1)))])}
    >
      <View
        style={{ height: 36, justifyContent: "center" }}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={(e) => pick(e.nativeEvent.locationX)}
        onResponderMove={(e) => pick(e.nativeEvent.locationX)}
      >
        <View pointerEvents="none" style={{ justifyContent: "center" }}>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: color.track }} />
          <View style={{ position: "absolute", height: 6, borderRadius: 3, backgroundColor: color.red, width: left }} />
          <View style={{ position: "absolute", left: left - 11, width: 22, height: 22, borderRadius: 11, backgroundColor: color.red, borderWidth: 3, borderColor: color.white }} />
        </View>
      </View>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        {STOPS.map((s, i) => (
          <T key={s} v="small" c={i === idx ? color.redText : color.inkSoft}>
            ${s}
            {i === STOPS.length - 1 ? "+" : ""}
          </T>
        ))}
      </View>
    </View>
  );
}
