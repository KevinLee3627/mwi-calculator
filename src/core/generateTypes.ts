import { readFile, writeFile } from 'fs/promises';

async function main() {
  const file = await readFile('./src/core/clientData.json', { encoding: 'utf-8' });
  const data = JSON.parse(file);

  generateHridType('SkillHrid', Object.keys(data.skillDetailMap));
  generateHridType('AbilityHrid', Object.keys(data.abilityDetailMap));
  generateHridType('ItemHrid', Object.keys(data.itemDetailMap));
  generateHridType('ItemCategoryHrid', Object.keys(data.itemCategoryDetailMap));
  generateHridType('ItemLocationHrid', Object.keys(data.itemLocationDetailMap));
  generateHridType('EquipmentTypeHrid', Object.keys(data.equipmentTypeDetailMap));
  generateHridType('ActionHrid', Object.keys(data.actionDetailMap));
  generateHridType('ActionTypeHrid', Object.keys(data.actionTypeDetailMap));
  generateHridType('ActionCategoryHrid', Object.keys(data.actionCategoryDetailMap));
  generateHridType('BuffTypeHrid', Object.keys(data.buffTypeDetailMap));
  generateHridType('CommunityBuffTypeHrid', Object.keys(data.communityBuffTypeDetailMap));
  generateHridType('DamageTypeHrid', Object.keys(data.damageTypeDetailMap));
  generateHridType('CombatStyleHrid', Object.keys(data.combatStyleDetailMap));
  const actionFunctionHrids = Object.values<Record<string, unknown>>(
    data.actionDetailMap
  ).map((value) => value.function);
  const uniqueActionFunctions = Array.from(new Set(actionFunctionHrids)) as string[];
  generateHridType('ActionFunctionHrid', uniqueActionFunctions);
  const itemLocationTypeHrids = Object.values<Record<string, unknown>>(
    data.itemLocationDetailMap
  ).map((value) => value.type);
  const uniqueItemLocationTypes = Array.from(new Set(itemLocationTypeHrids)) as string[];
  generateHridType('ItemLocationTypeHrid', uniqueItemLocationTypes);
}

async function generateHridType(name: string, values: string[]): Promise<void> {
  const filePath = `${process.cwd()}/src/core/hrid/${name}.ts`;

  const skillHridTypeDef = `export type ${name} = ${values
    .map((val) => `'${val}'`)
    .join(' | ')}`;
  await writeFile(filePath, skillHridTypeDef);
}

main().catch((err) => {
  console.error(err);
});
