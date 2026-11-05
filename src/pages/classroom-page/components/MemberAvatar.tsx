import { Avatar } from '@/components/Avatar';

const colors = ['green', 'purple', 'blue', 'orange'] as const;

type MemberAvatarProps = {
  id: number;
  nickname: string;
  isMe?: boolean;
};

// 같은 사람은 항상 같은 색으로 보여준다.
export function MemberAvatar({ id, nickname, isMe }: MemberAvatarProps) {
  if (isMe) return <Avatar label="나" color="purpleDeep" />;
  return <Avatar label={nickname.charAt(0)} color={colors[id % colors.length]} />;
}
