import type { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeInDown, ZoomIn } from "react-native-reanimated";
import { Icon, type IconName } from "@/components/icons";
import { T } from "@/components/ui";
import { color } from "@/theme";

export function StatusScreen({ icon, title, body, children, note }: { icon: IconName; title: string; body: string; children?: ReactNode; note: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: color.yellow, paddingTop: insets.top + 40, paddingHorizontal: 32, paddingBottom: 24, alignItems: "center" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animated.View entering={ZoomIn.duration(520).easing(Easing.bezier(0.22, 1, 0.36, 1))}>
          <Icon name={icon} size={132} color={color.red} />
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(420).delay(180)} style={{ alignItems: "center" }}>
          <T v="display" accessibilityRole="header" style={{ marginTop: 28, textAlign: "center" }}>
            {title}
          </T>
          <T style={{ marginTop: 10, textAlign: "center", maxWidth: 280 }}>{body}</T>
          {children}
        </Animated.View>
      </View>
      <T v="small" c={color.inkSoft} style={{ textAlign: "center", maxWidth: 300 }}>
        {note}
      </T>
    </View>
  );
}
