import { readFile, writeFile } from 'fs/promises';

async function main() {
  const file = await readFile('./src/core/clientData.json', { encoding: 'utf-8' });
  const parsed = JSON.parse(file);

  const skillDetailMap = parsed.skillDetailMap;
  const skillHrids = Object.keys(skillDetailMap);
  const skillHridTypeDef = `export type SkillHrid = ${skillHrids
    .map((hrid) => `'${hrid}'`)
    .join(' | ')}`;
  const filePath = `${process.cwd()}/src/core/SkillHrid.ts`;
  await writeFile(filePath, skillHridTypeDef);
}

main().catch((err) => {
  console.error(err);
});
