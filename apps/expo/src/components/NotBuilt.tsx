import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, space } from '../theme/tokens';
import { Button, Squiggle, Txt } from './primitives';

/**
 * Placeholder for a screen that is specified but not yet implemented.
 *
 * This scaffold was handed off mid-build (see diaries/2026-07-13-expo-scaffold.md).
 * Everything a screen needs — real catalog data, the design system, the cart store —
 * is already wired; these routes exist so the app boots and navigates cleanly rather
 * than crashing on a missing file. Each one names its spec.
 */
export function NotBuilt({
  title,
  spec,
  notes,
}: {
  title: string;
  spec: string;
  notes: string[];
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: color.surface }}
      contentContainerStyle={[
        styles.root,
        { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + 110 },
      ]}
    >
      <Txt variant="eyebrow" c={color.inkMuted}>
        Not built yet
      </Txt>
      <Squiggle />
      <Txt variant="h1">{title}</Txt>
      <Txt variant="body" c={color.inkMuted} style={{ marginTop: space.md }}>
        Specified in {spec}. The data layer, design tokens, and cart store this screen
        needs are already in place.
      </Txt>

      <View style={styles.list}>
        {notes.map((n) => (
          <View key={n} style={styles.item}>
            <View style={styles.bullet} />
            <Txt variant="bodySmall" style={{ flex: 1 }}>
              {n}
            </Txt>
          </View>
        ))}
      </View>

      <Button title="Back" variant="secondary" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: space.gutter },
  list: { marginVertical: space.xl, gap: space.md },
  item: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  bullet: { width: 6, height: 6, backgroundColor: color.lime, marginTop: 7 },
});
