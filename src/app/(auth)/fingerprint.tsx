import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, useAnimatedStyle, useReducedMotion, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { Button, Pressy, Screen, T, styles } from "@/components/ui";
import { useApp } from "@/store";
import { color } from "@/theme";

export default function Fingerprint() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [{ user }, dispatch] = useApp();
  const [set, setSet] = useState(false);
  const finish = () => {
    if (!user) dispatch({ type: "login", email: "john@example.com" });
    router.replace("/home");
  };
  const pulse = useAnimatedStyle(() => ({
    opacity: set || reduce ? 1 : withRepeat(withSequence(withTiming(0.55, { duration: 900 }), withTiming(1, { duration: 900 })), -1),
  }));

  return (
    <Screen title="Set Your Fingerprint" scroll={false}>
      <View style={{ flex: 1, padding: 28 }}>
        <T c={color.inkSoft}>{set ? "Fingerprint saved. You can now log in with a touch." : "Touch and hold the sensor below to register your fingerprint for faster log in."}</T>
        <Pressy accessibilityRole="button" accessibilityLabel="Register fingerprint" onLongPress={() => setSet(true)} onPress={() => setSet(true)} style={[styles.center, { flex: 1 }]}>
          <Animated.View style={pulse}>
            <Icon name="fingerprint" size={200} color={set ? color.red : color.blush} />
          </Animated.View>
          {set ? (
            <Animated.View entering={FadeIn}>
              <T v="h3" c={color.redText} style={{ marginTop: 16 }}>
                All set
              </T>
            </Animated.View>
          ) : null}
        </Pressy>
        <View style={[styles.row, { gap: 12 }]}>
          <Button label="Skip" tone="soft" style={{ flex: 1 }} onPress={finish} />
          <Button label="Continue" style={{ flex: 1 }} onPress={finish} />
        </View>
      </View>
    </Screen>
  );
}
