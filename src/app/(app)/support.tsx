import { useState } from "react";
import { TextInput, View } from "react-native";
import * as Linking from "expo-linking";
import { useLocalSearchParams } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { Chip, Divider, Empty, Pressy, Screen, Segmented, T, styles } from "@/components/ui";
import { contacts, faqTopics, faqs } from "@/data";
import { color, font, radius } from "@/theme";

function Row({ title, icon, open, onToggle, children }: { title: string; icon?: React.ComponentProps<typeof Icon>["name"]; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <View>
      <Pressy accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={onToggle} style={[styles.row, { gap: 14, paddingVertical: 16 }]}>
        {icon ? <Icon name={icon} size={26} color={color.red} /> : null}
        <T v="h3" style={{ flex: 1 }}>
          {title}
        </T>
        <View style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
          <Icon name="chevronDown" size={16} color={color.redText} />
        </View>
      </Pressy>
      {open ? (
        <Animated.View entering={FadeIn.duration(200)} style={{ paddingBottom: 16 }}>
          {children}
        </Animated.View>
      ) : null}
      <Divider />
    </View>
  );
}

export default function Support() {
  const p = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<"faq" | "contact">(p.tab === "contact" ? "contact" : "faq");
  const [topic, setTopic] = useState<(typeof faqTopics)[number]>("General");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const list = faqs.filter((f) => (needle ? (f.q + f.a).toLowerCase().includes(needle) : f.topic === topic));

  return (
    <Screen title="Help Center" subtitle="How can we help you?" back={false}>
      <Segmented
        value={tab}
        onChange={(v) => {
          setTab(v);
          setOpen(null);
        }}
        options={[
          { value: "faq", label: "FAQ" },
          { value: "contact", label: "Contact Us" },
        ]}
      />
      {tab === "faq" ? (
        <View style={{ marginTop: 16 }}>
          <View style={[styles.row, { gap: 8 }]}>
            {faqTopics.map((t) => (
              <Chip key={t} label={t} on={!needle && t === topic} onPress={() => (setTopic(t), setQ(""))} />
            ))}
          </View>
          <View style={[styles.row, { backgroundColor: color.white, borderRadius: radius.pill, paddingLeft: 16, paddingRight: 6, marginTop: 14, borderWidth: 1, borderColor: color.line }]}>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search questions"
              placeholderTextColor={color.inkSoft}
              accessibilityLabel="Search questions"
              style={{ flex: 1, height: 42, fontFamily: font.regular, fontSize: 16, color: color.ink }}
            />
            <View style={[styles.center, { width: 30, height: 30, borderRadius: 15, backgroundColor: color.red }]}>
              <Icon name="search" size={16} color={color.white} />
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            {list.length ? (
              list.map((f) => (
                <Row key={f.q} title={f.q} open={open === f.q} onToggle={() => setOpen(open === f.q ? null : f.q)}>
                  <T c={color.inkSoft}>{f.a}</T>
                </Row>
              ))
            ) : (
              <Empty icon="message" title="No answers for that yet" body="Try the Contact Us tab and we'll help directly." />
            )}
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 8 }}>
          {contacts.map((c) => (
            <Row key={c.label} title={c.label} icon={c.icon} open={open === c.label} onToggle={() => setOpen(open === c.label ? null : c.label)}>
              <Pressy accessibilityRole="link" onPress={() => Linking.openURL(c.url)} style={[styles.row, { gap: 8, paddingLeft: 40 }]}>
                <T c={color.redText}>{c.detail}</T>
                <Icon name="arrowRight" size={14} color={color.redText} />
              </Pressy>
            </Row>
          ))}
        </View>
      )}
    </Screen>
  );
}
