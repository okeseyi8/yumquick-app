import { View } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button, T } from "@/components/ui";
import { color } from "@/theme";

export default function Welcome() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: color.red, alignItems: "center", justifyContent: "center", padding: 32 }}>
      <StatusBar style="light" />
      <Image source={require("@/assets/images/logoII.svg")} style={{ width: 200, height: 250 }} contentFit="contain" accessibilityLabel="YumQuick" />
      <Animated.View entering={FadeInDown.duration(500).delay(150)} style={{ alignItems: "center", width: "100%", maxWidth: 320 }}>
        <T c={color.white} style={{ textAlign: "center", marginTop: 20, marginBottom: 40, fontSize: 16, lineHeight: 22 }}>
          Good food from the kitchens you love, at your door while it is still hot.
        </T>
        <Button label="Log In" tone="yellow" size="lg" style={{ alignSelf: "stretch" }} onPress={() => router.push("/login")} />
        <Button label="Sign Up" tone="cream" size="lg" style={{ alignSelf: "stretch", marginTop: 10 }} onPress={() => router.push("/signup")} />
      </Animated.View>
    </View>
  );
}
