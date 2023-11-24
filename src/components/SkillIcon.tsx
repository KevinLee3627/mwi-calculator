import { GameIcon } from 'src/components/GameIcon';
import { SkillHrid } from 'src/core/hrid/SkillHrid';

interface SkillIconProps {
  skillHrid: SkillHrid;
}
export function SkillIcon({ skillHrid }: SkillIconProps) {
  const iconName = skillHrid.split('/').at(-1) as SkillHrid;
  return <GameIcon svgSetName="skills" iconName={iconName} />;
}
