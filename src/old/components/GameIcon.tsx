import { SvgSetName } from 'src/old/core/icons/SvgSetName';
import { svgHrefs } from 'src/old/util/svgHrefs';

interface GameIconProps {
  svgSetName: SvgSetName;
  iconName: string;
}
export function GameIcon({ svgSetName, iconName }: GameIconProps) {
  return (
    <svg className="inline h-4 w-4">
      <use href={`${svgHrefs[svgSetName]}#${iconName}`}></use>
    </svg>
  );
}
