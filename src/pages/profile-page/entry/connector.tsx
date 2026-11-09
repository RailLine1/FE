import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGet2 } from '@/api/10-커넥터/10-커넥터';
import { AppBar } from '@/components/AppBar';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CONNECTOR_CLIENT_KEYS, CONNECTOR_CLIENTS, lastUsedText } from '../connectorClients';
import { CONNECTOR_LOGOS } from '../connectorLogos';

// P-AI-01, P-AI-04
export default function ConnectorPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGet2();

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  return (
    <Screen>
      <AppBar
        title="커넥터 등록"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          평소 쓰는 AI에 Daybit를 한 번 등록하면, 구독한 과목 자료를 필요한 페이지만 찾아 읽어요.
        </Text>
        <QueryStatus isLoading={isLoading} isError={isError} />

        {CONNECTOR_CLIENT_KEYS.map((client) => {
          const { name, description } = CONNECTOR_CLIENTS[client];
          const lastCalledAt = data?.clients?.find((item) => item.client === client)?.lastCalledAt;
          return (
            <Pressable
              key={client}
              accessibilityRole="button"
              onPress={() =>
                router.push({ pathname: '/profile/connector/[client]', params: { client } })
              }
              style={styles.row}>
              <View style={styles.mark}>
                <Image source={CONNECTOR_LOGOS[client]} style={styles.logo} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.status}>
                  {lastCalledAt ? lastUsedText(lastCalledAt) : description}
                </Text>
              </View>
              {lastCalledAt ? (
                <View>
                  <Badge label="등록됨" variant="success" />
                </View>
              ) : (
                <Icon name="chevron-right-20" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  description: {
    ...Fonts.regular,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 21.7,
    color: Palette.textSub,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 76,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    boxShadow: `0 3px 0 ${Palette.line}`,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    boxShadow: `0 3px 0 ${Palette.line}`,
  },
  logo: {
    width: 24,
    height: 24,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: Palette.text,
  },
  status: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
});
