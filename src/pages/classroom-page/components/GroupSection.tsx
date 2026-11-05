import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ListGroup } from '@/components/ListGroup';
import { SectionLabel } from '@/components/SectionLabel';

type GroupSectionProps = {
  title: string;
  children: ReactNode;
};

export function GroupSection({ title, children }: GroupSectionProps) {
  return (
    <View style={styles.section}>
      <SectionLabel>{title}</SectionLabel>
      <ListGroup>{children}</ListGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    marginTop: 4,
  },
});
