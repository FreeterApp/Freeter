export enum SettingsType {
  File = 1,
  Folder = 2,
}
export const settingsTypes: SettingsType[] = [1, 2];
export const settingsTypeNames: Record<SettingsType, string> = {
  [SettingsType.File]: 'file',
  [SettingsType.Folder]: 'folder',
}
export const settingsTypeNamesCapital: Record<SettingsType, string> = {
  [SettingsType.File]: 'File',
  [SettingsType.Folder]: 'Folder',
}
export const settingsTypeActionNames: Record<SettingsType, string> = {
  [SettingsType.File]: 'Open File(s)',
  [SettingsType.Folder]: 'Open Folder(s)',
}

export function isSettingsType(val: unknown): val is SettingsType {
  if (typeof val !== 'number') {
    return false;
  }

  if (settingsTypes.indexOf(val as SettingsType) > -1) {
    return true;
  }

  return true;
}
