import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/components/icons";
import { categories, type CategoryId } from "@/data";
import { useApp } from "@/store";
import { color, font, radius } from "@/theme";

/* ---------- text ---------- */

const type = StyleSheet.create({
  display: { fontFamily: font.bold, fontSize: 34, lineHeight: 38, letterSpacing: -0.5 },
  title: { fontFamily: font.bold, fontSize: 26, lineHeight: 30, letterSpacing: -0.3 },
  h2: { fontFamily: font.semibold, fontSize: 21, lineHeight: 25 },
  h3: { fontFamily: font.semibold, fontSize: 17, lineHeight: 21 },
  body: { fontFamily: font.regular, fontSize: 15, lineHeight: 20 },
  small: { fontFamily: font.regular, fontSize: 13, lineHeight: 17 },
  label: { fontFamily: font.medium, fontSize: 15, lineHeight: 19 },
});

export function T({ v = "body", c = color.ink, style, ...rest }: TextProps & { v?: keyof typeof type; c?: string }) {
  return <Text {...rest} style={[type[v], { color: c }, style]} />;
}

/* ---------- press feedback ---------- */

export function Pressy({ style, children, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [style, rest.disabled && { opacity: 0.45 }, pressed && (reduce ? { opacity: 0.7 } : { transform: [{ scale: 0.97 }], opacity: 0.92 })]}
    >
      {children}
    </Pressable>
  );
}

/* ---------- buttons ---------- */

const buttonTone = {
  primary: { bg: color.red, fg: color.white },
  soft: { bg: color.blush, fg: color.redText },
  yellow: { bg: color.yellow, fg: color.redDeep },
  cream: { bg: color.cream, fg: color.redText },
} as const;

export function Button({
  label,
  onPress,
  tone = "primary",
  size = "md",
  icon,
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  tone?: keyof typeof buttonTone;
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const t = buttonTone[tone];
  const h = { sm: 36, md: 46, lg: 54 }[size];
  return (
    <Pressy
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      hitSlop={size === "sm" ? 6 : 0}
      style={[
        { height: h, paddingHorizontal: size === "sm" ? 16 : 32, borderRadius: radius.pill, backgroundColor: t.bg },
        styles.center,
        styles.row,
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={18} color={t.fg} /> : null}
      <Text style={{ fontFamily: font.semibold, fontSize: size === "sm" ? 14 : size === "lg" ? 20 : 18, color: t.fg, marginLeft: icon ? 8 : 0 }}>
        {label}
      </Text>
    </Pressy>
  );
}

export function IconButton({
  name,
  onPress,
  label,
  badge,
  tone = "white",
  size = 36,
  filled,
}: {
  filled?: boolean;
  name: IconName;
  onPress?: () => void;
  label: string;
  badge?: number;
  tone?: "white" | "red" | "clear";
  size?: number;
}) {
  const bg = tone === "white" ? color.surface : tone === "red" ? color.red : "transparent";
  const fg = tone === "red" ? color.white : color.red;
  return (
    <Pressy
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={Math.max(0, (44 - size) / 2)}
      style={[{ width: size, height: size, borderRadius: size * 0.33, backgroundColor: bg }, styles.center]}
    >
      <Icon name={name} size={size * 0.6} color={fg} fill={filled ? fg : undefined} />
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressy>
  );
}

/* ---------- screen shell ---------- */

export function Screen({
  title,
  subtitle,
  back = true,
  right,
  header,
  children,
  scroll = true,
  footer,
  sheetStyle,
}: {
  title?: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  header?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: color.yellow }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 44 }}>
        {header ?? (
          <View style={[styles.row, { minHeight: 44 }]}>
            <View style={{ width: 44 }}>
              {back ? <IconButton name="chevronLeft" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))} /> : null}
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <T v="title" accessibilityRole="header" numberOfLines={1} style={{ textAlign: "center" }}>
                {title}
              </T>
              {subtitle ? (
                <T v="small" c={color.redDeep} style={{ marginTop: 2 }}>
                  {subtitle}
                </T>
              ) : null}
            </View>
            <View style={{ minWidth: 44, alignItems: "flex-end" }}>{right}</View>
          </View>
        )}
      </View>
      <View style={[styles.sheet, sheetStyle]}>
        {scroll ? (
          <ScrollView contentContainerStyle={{ padding: 28, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
        {footer ? <View style={{ paddingHorizontal: 28, paddingBottom: 16, paddingTop: 8 }}>{footer}</View> : null}
      </View>
    </View>
  );
}

/* ---------- top bar (home / menu) ---------- */

export function TopBar() {
  const router = useRouter();
  const [{ cart }, dispatch] = useApp();
  const count = cart.reduce((s, l) => s + l.qty, 0);
  return (
    <View style={[styles.row, { width: "100%", gap: 8 }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Pressy
          accessibilityRole="search"
          accessibilityLabel="Search dishes"
          onPress={() => router.push("/search")}
          style={[styles.row, styles.search, { width: "100%" }]}
        >
          <T c={color.inkSoft} numberOfLines={1} style={{ flex: 1 }}>
            Search
          </T>
          <View style={[styles.center, { width: 26, height: 26, borderRadius: 13, backgroundColor: color.red }]}>
            <Icon name="sliders" size={14} color={color.white} />
          </View>
        </Pressy>
      </View>
      <View style={[styles.row, { gap: 8, flexShrink: 0 }]}>
        <IconButton name="cart" label={`Cart, ${count} items`} badge={count} onPress={() => dispatch({ type: "drawer", drawer: "cart" })} />
        <IconButton name="bell" label="Notifications" onPress={() => router.push("/settings-notifications")} />
        <IconButton name="user" label="Account" onPress={() => dispatch({ type: "drawer", drawer: "profile" })} />
      </View>
    </View>
  );
}

/* ---------- inputs ---------- */

export function Field({ label, secure, style, ...rest }: TextInputProps & { label: string; secure?: boolean }) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <T v="h3" style={{ marginBottom: 8 }}>
        {label}
      </T>
      <View style={[styles.row, styles.input, focused && { borderColor: color.red }]}>
        <TextInput
          {...rest}
          accessibilityLabel={label}
          secureTextEntry={secure && hidden}
          placeholderTextColor={color.inkSoft}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          style={[{ flex: 1, fontFamily: font.regular, fontSize: 17, color: color.ink, paddingVertical: 12 }, style]}
        />
        {secure ? (
          <IconButton tone="clear" size={32} name={hidden ? "eyeOff" : "eye"} label={hidden ? "Show password" : "Hide password"} onPress={() => setHidden(!hidden)} />
        ) : null}
      </View>
    </View>
  );
}

export function Radio({ on }: { on: boolean }) {
  return (
    <View style={[styles.center, { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: color.red }]}>
      {on ? <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: color.red }} /> : null}
    </View>
  );
}

/* ---------- small pieces ---------- */

export function Stepper({ qty, onChange, min = 1 }: { qty: number; onChange: (d: number) => void; min?: number }) {
  return (
    <View style={[styles.row, { gap: 10 }]}>
      <Pressy
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        hitSlop={10}
        disabled={qty <= min}
        onPress={() => onChange(-1)}
        style={[styles.step, { backgroundColor: color.blush }]}
      >
        <Icon name="minus" size={14} color={color.redText} />
      </Pressy>
      <T v="h3" style={{ minWidth: 18, textAlign: "center" }} accessibilityLiveRegion="polite">
        {qty}
      </T>
      <Pressy accessibilityRole="button" accessibilityLabel="Increase quantity" hitSlop={10} onPress={() => onChange(1)} style={[styles.step, { backgroundColor: color.red }]}>
        <Icon name="plus" size={14} color={color.white} />
      </Pressy>
    </View>
  );
}

export function Rating({ value }: { value: number }) {
  return (
    <View style={[styles.row, styles.rating]} accessibilityLabel={`Rated ${value.toFixed(1)}`}>
      <Text style={{ fontFamily: font.medium, fontSize: 12, color: color.white }}>{value.toFixed(1)}</Text>
      <Icon name="star" size={11} color={color.yellow} fill={color.yellow} />
    </View>
  );
}

export function PriceTag({ value }: { value: string }) {
  return (
    <View style={styles.priceTag}>
      <Text style={{ fontFamily: font.medium, fontSize: 13, color: color.white }}>{value}</Text>
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 1, backgroundColor: color.line }, style]} />;
}

export function Segmented<V extends string>({ options, value, onChange }: { options: { value: V; label: string }[]; value: V; onChange: (v: V) => void }) {
  return (
    <View style={[styles.row, { gap: 8 }]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressy
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.value)}
            style={[styles.center, { flex: 1, height: 36, borderRadius: radius.pill, backgroundColor: on ? color.red : color.blush }]}
          >
            <Text style={{ fontFamily: font.medium, fontSize: 15, color: on ? color.white : color.redText }}>{o.label}</Text>
          </Pressy>
        );
      })}
    </View>
  );
}

export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressy
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      onPress={onPress}
      style={{ paddingHorizontal: 16, height: 32, justifyContent: "center", borderRadius: radius.pill, backgroundColor: on ? color.red : color.blush }}
    >
      <Text style={{ fontFamily: font.regular, fontSize: 14, color: on ? color.white : color.redText }}>{label}</Text>
    </Pressy>
  );
}

export function CategoryRow({ active, onSelect }: { active?: CategoryId; onSelect: (id: CategoryId) => void }) {
  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      {categories.map((c) => {
        const on = c.id === active;
        return (
          <Pressy key={c.id} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={c.label} onPress={() => onSelect(c.id)} style={{ alignItems: "center", gap: 6 }}>
            <View style={[styles.center, styles.catBubble, on && { backgroundColor: color.yellow }]}>
              <Icon name={c.icon} size={36} color={color.red} />
            </View>
            <T v="small" c={color.ink}>
              {c.label}
            </T>
          </Pressy>
        );
      })}
    </View>
  );
}

export function Empty({ icon, title, body, action }: { icon: IconName; title: string; body?: string; action?: ReactNode }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 56, paddingHorizontal: 12, gap: 12 }}>
      <Icon name={icon} size={88} color={color.line} />
      <T v="h2" c={color.redText} style={{ textAlign: "center" }}>
        {title}
      </T>
      {body ? (
        <T c={color.inkSoft} style={{ textAlign: "center", maxWidth: 280 }}>
          {body}
        </T>
      ) : null}
      {action}
    </View>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  center: { alignItems: "center", justifyContent: "center" },
  sheet: { flex: 1, backgroundColor: color.surface, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, marginTop: -24, overflow: "hidden" },
  search: { height: 36, borderRadius: radius.pill, backgroundColor: color.white, paddingLeft: 16, paddingRight: 5 },
  input: { backgroundColor: color.cream, borderRadius: radius.md, paddingHorizontal: 16, borderWidth: 1.5, borderColor: "transparent" },
  step: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rating: { gap: 3, backgroundColor: color.red, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  priceTag: { position: "absolute", right: 0, bottom: 12, backgroundColor: color.red, paddingHorizontal: 8, paddingVertical: 3, borderTopLeftRadius: radius.sm, borderBottomLeftRadius: radius.sm },
  catBubble: { width: 58, height: 70, borderRadius: 29, backgroundColor: color.cream },
  badge: { position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: color.red, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeText: { fontFamily: font.bold, fontSize: 10, color: color.white },
});
