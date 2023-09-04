import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { setActiveSkill } from 'src/features/navigation/activeSkillSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { svgHrefs } from 'src/util/svgHrefs';

export function Sidebar() {
  return (
    <div className="drawer-side z-50">
      <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
      <aside className=" bg-base-100 ">
        <div className="hidden pl-6 pt-4 font-extrabold lg:block">
          <svg className="mr-1 inline h-4 w-4">
            <use href={`${svgHrefs.chat_icons}#book`}></use>
          </svg>
          mwi-calculator
        </div>
        <ul className="menu sticky text-base-content">
          <li>
            <span
              onClick={() => {
                const modal = document.getElementById(
                  'characterEquipmentModal'
                ) as HTMLDialogElement;
                modal.showModal();
              }}
            >
              Equipment
            </span>
          </li>
          <li>
            <span
              onClick={() => {
                const modal = document.getElementById(
                  'characterLevelModal'
                ) as HTMLDialogElement;
                modal.showModal();
              }}
            >
              Levels
            </span>
          </li>
          <li>
            <h2 className="menu-title">Gathering</h2>
            <ul>
              <SidebarSkillTab skillHrid="/skills/milking" />
              <SidebarSkillTab skillHrid="/skills/foraging" />
              <SidebarSkillTab skillHrid="/skills/woodcutting" />
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Production</h2>
            <ul>
              <SidebarSkillTab skillHrid="/skills/cheesesmithing" />
              <SidebarSkillTab skillHrid="/skills/crafting" />
              <SidebarSkillTab skillHrid="/skills/tailoring" />
              <SidebarSkillTab skillHrid="/skills/cooking" />
              <SidebarSkillTab skillHrid="/skills/brewing" />
            </ul>
          </li>
          <li>
            <h2 className="menu-title">Miscellanous</h2>
            <ul>
              <SidebarSkillTab skillHrid="/skills/enhancing" />
            </ul>
          </li>
        </ul>
      </aside>
    </div>
  );
}

interface SidebarSkillTabProps {
  skillHrid: NonCombatSkillHrid;
}
function SidebarSkillTab({ skillHrid }: SidebarSkillTabProps) {
  const dispatch = useAppDispatch();

  const skillHridStripped = skillHrid.split('/').at(-1);
  return (
    <li
      onClick={() => {
        dispatch(setActiveSkill({ skillHrid }));
      }}
    >
      <span>
        <svg className="h-4 w-4">
          <use href={`${svgHrefs.skills}#${skillHridStripped}`}></use>
        </svg>
        {clientData.skillDetailMap[skillHrid].name}
      </span>
    </li>
  );
}
