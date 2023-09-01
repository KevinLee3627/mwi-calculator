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
  generateHridType('CommunityBuffType', Object.keys(data.communityBuffTypeDetailMap));
}

async function generateHridType(name: string, values: string[]): Promise<void> {
  const filePath = `${process.cwd()}/src/core/${name}.ts`;

  const skillHridTypeDef = `export type ${name} = ${values
    .map((val) => `'${val}'`)
    .join(' | ')}`;
  await writeFile(filePath, skillHridTypeDef);
}

main().catch((err) => {
  console.error(err);
});
