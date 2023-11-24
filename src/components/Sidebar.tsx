import { GameIcon } from 'src/components/GameIcon';
import { ItemIcon } from 'src/components/ItemIcon';
import { clientData } from 'src/core/clientData';
import { NonCombatSkillHrid } from 'src/core/skills/NonCombatSkillHrid';
import { setActivePage } from 'src/features/activePageSlice';
import { useAppDispatch } from 'src/hooks/useAppDispatch';
import { useStats } from 'src/hooks/useStats';
import { openModal } from 'src/util/openModal';

export function Sidebar() {
  const dispatch = useAppDispatch();

  return (
    <div className="drawer-side z-50">
      <label htmlFor="drawer-sidebar" className="drawer-overlay"></label>
      <aside className=" bg-base-100 ">
        <div className="hidden pl-6 pt-4 font-extrabold lg:block">
          <GameIcon svgSetName="chat_icons" iconName="book" />
          cowculator
        </div>
        <ul className="menu sticky text-base-content">
          <li>
            <h2 className="menu-title">Player Info</h2>
            <ul>
              <li>
                <span onClick={() => openModal('characterEquipmentModal')}>
                  Equipment
                </span>
              </li>
              <li>
                <span onClick={() => openModal('characterLevelModal')}>Levels</span>
              </li>
              <li>
                <span onClick={() => openModal('communityBuffsModal')}>
                  Community Buffs
                </span>
              </li>
              <li>
                <span onClick={() => openModal('houseModal')}>House</span>
              </li>
              <li>
                <span onClick={() => openModal('actionQueueModal')}>Queue</span>
              </li>
            </ul>
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
              <li onClick={() => dispatch(setActivePage({ pageId: '/page/houses' }))}>
                <span>
                  <ItemIcon itemHrid="/items/lumber" />
                  Houses
                </span>
              </li>
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
  const {
    activePage: { activePage }
  } = useStats();
  const dispatch = useAppDispatch();

  const skillHridStripped = skillHrid.split('/').at(-1);
  return (
    <li onClick={() => dispatch(setActivePage({ pageId: skillHrid }))}>
      <span className={skillHrid === activePage ? 'active' : ''}>
        <GameIcon svgSetName="skills" iconName={skillHridStripped ?? ''} />
        {clientData.skillDetailMap[skillHrid].name}
      </span>
    </li>
  );
}
