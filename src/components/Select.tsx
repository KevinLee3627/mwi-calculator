import ReactSelect, { GroupBase, Props, Theme, ThemeConfig } from 'react-select';

export const customColors: Partial<Theme['colors']> = {
  primary: 'hsl(var(--p))', //
  primary25: 'hsl(var(--nf))', // option hover
  neutral0: 'hsl(var(--b1))', // input bg
  neutral10: 'hsl(var(--p))', // multi option bg
  neutral20: 'hsl(var(--p))', // input border, divider, chevron
  neutral30: 'hsl(var(--p))', // input border hover
  neutral80: 'hsl(var(--nc))' // select text
};

export const customTheme: ThemeConfig = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    ...customColors
  }
});

export function Select<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <ReactSelect
      {...props}
      theme={customTheme}
      styles={{
        control: (base) => ({ ...base, height: '3rem', minHeight: '3rem' }),
        // Stops table header from overlapping dropdown menus
        menu: (base) => ({ ...base, zIndex: 50 })
      }}
    />
  );
}
