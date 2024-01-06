/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

export interface VersionedObject<T extends object> {
  ver: number;
  obj: T;
}

export type MigrateVersionedObject<TFrom extends object, TTo extends object> = (object: TFrom, version: number) => TTo;

export function createVersionedObject<T extends object>(object: T, version: number): VersionedObject<T> {
  return { obj: object, ver: version };
}

export function unwrapVersionedObject<T extends object, TRes extends object>(
  versionedObject: VersionedObject<T>,
  version: number,
  migrate: MigrateVersionedObject<T, TRes>
): TRes {
  if (version === versionedObject.ver) {
    return versionedObject.obj as unknown as TRes;
  }
  return migrate(versionedObject.obj, versionedObject.ver);
}

export function isVersionedObject(object: object): object is VersionedObject<object> {
  const { ver, obj } = object as VersionedObject<object>;
  return (typeof ver === 'number')
    && (typeof obj === 'object' && obj !== null && !Array.isArray(obj));
}
