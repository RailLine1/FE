import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { CourseFile } from '../courseTypes';

function formatDate(uploadedAt: string) {
  const date = new Date(uploadedAt);
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / (24 * 60 * 60 * 1000));

  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function getSubtitle({ status, pages, uploadedAt }: CourseFile) {
  const date = formatDate(uploadedAt);
  if (status !== 'ready') return `${date} 업로드`;
  return pages ? `${pages}쪽 · ${date}` : date;
}

type FileRowProps = {
  file: CourseFile;
  canManage: boolean;
  onOpen: () => void;
  onDelete: () => void;
};

export function FileRow({ file, canManage, onOpen, onDelete }: FileRowProps) {
  const { status, title } = file;

  return (
    <ListRow
      title={title}
      subtitle={getSubtitle(file)}
      leading={
        <IconBox tone="soft">
          <Icon name="document-20" color={Palette.purpleStrong} />
        </IconBox>
      }
      badge={status === 'processing' ? '처리 중' : status === 'failed' ? '처리 실패' : undefined}
      badgeVariant={status === 'failed' ? 'danger' : 'pending'}
      trailing={
        canManage && status !== 'processing' ? (
          <IconButton compact icon="trash" accessibilityLabel="자료 삭제" onPress={onDelete} />
        ) : undefined
      }
      onPress={status === 'ready' ? onOpen : undefined}
    />
  );
}
