import { View } from "react-native";
import { Icon } from "@/components/icons";
import { styles } from "@/components/ui";
import { color, radius } from "@/theme";

// ponytail: static street grid, swap for expo-maps when real courier GPS exists.
const ROADS_H = [18, 46, 74];
const ROADS_V = [14, 38, 62, 86];
const PARKS = [
  { left: "40%", top: "22%", width: "20%", height: "22%" },
  { left: "64%", top: "50%", width: "20%", height: "22%" },
  { left: "16%", top: "50%", width: "20%", height: "22%" },
] as const;

export function RouteMap({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <View accessibilityLabel="Map of the delivery route" style={{ aspectRatio: 1.6, borderRadius: radius.lg, overflow: "hidden", backgroundColor: "#E4E1DC" }}>
      {PARKS.map((s, i) => (
        <View key={i} style={{ position: "absolute", ...s, backgroundColor: "#B9D98F", borderRadius: 4 }} />
      ))}
      {ROADS_H.map((t) => (
        <View key={`h${t}`} style={{ position: "absolute", left: 0, right: 0, top: `${t}%`, height: 8, backgroundColor: color.white }} />
      ))}
      {ROADS_V.map((l) => (
        <View key={`v${l}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${l}%`, width: 8, backgroundColor: color.white }} />
      ))}
      {/* route: restaurant (38%,18%) → down to 74% → right to 86% */}
      <View style={{ position: "absolute", left: "38%", top: "18%", width: 4, height: "56%", marginLeft: 2, backgroundColor: color.red }} />
      <View style={{ position: "absolute", left: "38%", top: "74%", width: "48%", height: 4, marginTop: 2, backgroundColor: color.red }} />
      <Pin left="38%" top="18%" icon="meal" />
      <Pin left="86%" top="74%" icon="home" />
      <View
        style={[
          styles.center,
          {
            position: "absolute",
            left: p < 0.55 ? "38%" : `${38 + ((p - 0.55) / 0.45) * 48}%`,
            top: p < 0.55 ? `${18 + (p / 0.55) * 56}%` : "74%",
            width: 30,
            height: 30,
            marginLeft: -11,
            marginTop: -11,
            borderRadius: 15,
            backgroundColor: color.red,
            borderWidth: 2,
            borderColor: color.white,
          },
        ]}
      >
        <Icon name="delivery" size={18} color={color.white} />
      </View>
    </View>
  );
}

function Pin({ left, top, icon }: { left: `${number}%`; top: `${number}%`; icon: "meal" | "home" }) {
  return (
    <View style={[styles.center, { position: "absolute", left, top, width: 26, height: 26, marginLeft: -9, marginTop: -9, borderRadius: 13, backgroundColor: color.white, borderWidth: 2, borderColor: color.red }]}>
      <Icon name={icon} size={14} color={color.red} />
    </View>
  );
}
