import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';

import { formatRelativeDate } from '../formatRelativeDate';
import { JoinRequest } from '../courseTypes';
import { MemberAvatar } from './MemberAvatar';

const formatRequestedAt = (value: string) => {
  const date = new Date(value);
  const time = [date.getHours(), date.getMinutes()]
    .map((number) => String(number).padStart(2, '0'))
    .join(':');
  return `${formatRelativeDate(value)} ${time} 요청`;
};

type JoinRequestRowProps = {
  request: JoinRequest;
  disabled?: boolean;
  onReject: () => void;
  onApprove: () => void;
};

export function JoinRequestRow({ request, disabled, onReject, onApprove }: JoinRequestRowProps) {
  return (
    <ListRow
      title={request.nickname}
      subtitle={formatRequestedAt(request.requestedAt)}
      leading={<MemberAvatar id={request.requestId} nickname={request.nickname} />}
      trailingAction
      trailing={
        <View style={styles.actions}>
          <Button
            label="거절"
            variant="dangerOutline"
            size="small"
            disabled={disabled}
            onPress={onReject}
          />
          <Button label="승인" size="small" disabled={disabled} onPress={onApprove} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
