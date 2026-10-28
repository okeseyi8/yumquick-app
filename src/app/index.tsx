import { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { color } from "@/theme";

export default function Launch() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/onboarding"), 1400);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: color.yellow, alignItems: "center", justifyContent: "center" }}>
      <Animated.View entering={ZoomIn.duration(600).withInitialValues({ transform: [{ scale: 0.9 }] })}>
        <Animated.View entering={FadeIn.duration(500)}>
          <Image source={require("@/assets/images/logo.svg")} style={{ width: 200, height: 250 }} contentFit="contain" accessibilityLabel="YumQuick" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
