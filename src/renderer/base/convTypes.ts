/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

const addUndForValToStr = <T>(fnConv: (val: T) => string) => (val: T | undefined) => val === undefined ? '' : fnConv(val);
const addUndForStrToVal = <T>(fnConv: (val: string) => T) => (val: string) => val === '' ? undefined : fnConv(val);

export const convertBoolToStr = (val: boolean) => val ? '1' : '0';
export const convertStrToBool = (val: string) => val === '0' ? false : true;
export const convertUndBoolToStr = addUndForValToStr(convertBoolToStr);
export const convertStrToUndBool = addUndForStrToVal(convertStrToBool);

export const convertNumToStr = (val: number) => val.toString();
export const convertStrToNum = (val: string) => Number.parseInt(val);
export const convertUndNumToStr = addUndForValToStr(convertNumToStr);
export const convertStrToUndNum = addUndForStrToVal(convertStrToNum);
