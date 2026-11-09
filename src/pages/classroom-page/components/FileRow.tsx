import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { CourseFile } from '../courseTypes';
import { formatRelativeDate } from '../formatRelativeDate';

// 이름 없이 올린 자료를 목록에서 구분할 수 있게 한다.
export function getFileTitle({ title }: CourseFile) {
  return title.trim() || '제목 없는 자료';
}

function getSubtitle({ status, pages, uploadedAt }: CourseFile) {
  const date = formatRelativeDate(uploadedAt);
  if (status !== 'ready') return `${date} 업로드`;
  return pages ? `${pages}쪽 · ${date}` : date;
}

type FileRowProps = {
  file: CourseFile;
  canManage: boolean;
  onOpen: () => void;
  onEdit: () => void;
};

export function FileRow({ file, canManage, onOpen, onEdit }: FileRowProps) {
  const { status } = file;

  return (
    <ListRow
      title={getFileTitle(file)}
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
          <IconButton
            compact
            icon="more"
            accessibilityLabel="자료 이름 바꾸기 · 삭제"
            onPress={onEdit}
          />
        ) : undefined
      }
      onPress={status === 'ready' ? onOpen : undefined}
    />
  );
}
