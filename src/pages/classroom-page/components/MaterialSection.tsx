import { useRouter } from 'expo-router';

import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { CourseFolder } from '../courseTypes';
import { GroupSection } from './GroupSection';

type FolderRowProps = {
  folder: CourseFolder;
  canManage: boolean;
  onPress: () => void;
};

function FolderRow({ folder, canManage, onPress }: FolderRowProps) {
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
      onPress={onPress}
    />
  );
}

type MaterialSectionProps = {
  courseId: number;
  folders: CourseFolder[];
  canManage: boolean;
};

export function MaterialSection({ courseId, folders, canManage }: MaterialSectionProps) {
  const router = useRouter();

  return (
    <GroupSection title="학습자료">
      {folders.map((folder) => (
        <FolderRow
          key={folder.folderId}
          folder={folder}
          canManage={canManage}
          onPress={() =>
            router.push({
              pathname: '/classroom/[courseId]/folder/[folderId]',
              params: { courseId: String(courseId), folderId: String(folder.folderId) },
            })
          }
        />
      ))}
      {canManage && <ListRow title="＋ 새 폴더" titleTone="accent" />}
    </GroupSection>
  );
}
