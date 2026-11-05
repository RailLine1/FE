import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { CourseFolder } from '../courseTypes';
import { GroupSection } from './GroupSection';

function FolderRow({ folder, canManage }: { folder: CourseFolder; canManage: boolean }) {
  const custom = folder.kind === 'custom';

  return (
    <ListRow
      title={folder.name}
      subtitle={`자료 ${folder.fileCount}개`}
      leading={
        <IconBox tone={custom ? 'outline' : 'soft'}>
          <Icon name="folder-20" color={custom ? Palette.textSub : Palette.purpleStrong} />
        </IconBox>
      }
      trailing={
        custom && canManage ? (
          <IconButton compact icon="more" accessibilityLabel="폴더 관리" />
        ) : undefined
      }
      chevron={!(custom && canManage)}
    />
  );
}

type MaterialSectionProps = {
  folders: CourseFolder[];
  canManage: boolean;
};

export function MaterialSection({ folders, canManage }: MaterialSectionProps) {
  return (
    <GroupSection title="학습자료">
      {folders.map((folder) => (
        <FolderRow key={folder.folderId} folder={folder} canManage={canManage} />
      ))}
      {canManage && <ListRow title="＋ 새 폴더" titleTone="accent" />}
    </GroupSection>
  );
}
