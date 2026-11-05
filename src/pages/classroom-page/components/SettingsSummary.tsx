import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';

import { CourseSettings } from '../courseTypes';
import { roleBadges } from './CourseSummary';

export function SettingsSummary({ settings }: { settings: CourseSettings }) {
  const badge = roleBadges[settings.role];

  return (
    <ListGroup>
      <ListRow title="과목 코드" value={settings.code} />
      <ListRow title="내 권한" badge={badge.label} badgeVariant={badge.variant} />
    </ListGroup>
  );
}
