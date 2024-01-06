/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { createInMemoryDataStorage } from '@common/infra/dataStorage/inMemoryDataStorage';
import { setTextOnlyIfChanged } from '@common/infra/dataStorage/setTextOnlyIfChanged';

describe('setTextOnlyIfChanged', () => {
  describe('getText', () => {
    it('should call DataStorage.getText with right params and return a right value', async () => {
      const key = 'key';
      const value = 'value';
      const getText = jest.fn().mockResolvedValue(value);
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({}),
        getText
      });

      const gotText = await dataStorage.getText(key);

      expect(getText).toBeCalled();
      expect(getText).toBeCalledWith(key);
      expect(gotText).toEqual(value);
    })

    it('should remember a returned text as a prev state', async () => {
      const key = 'key';
      const value = 'value';
      const setText = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        setText
      });

      await dataStorage.getText(key);
      await dataStorage.setText(key, value);

      expect(setText).not.toBeCalled();
    })
  })

  describe('setText', () => {
    it('should call DataStorage.setText, if a prev state is empty', async () => {
      const key = 'key';
      const value = 'value';
      const setText = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        setText
      });

      await dataStorage.setText(key, value);

      expect(setText).toBeCalled();
    })

    it('should remember a new text as a prev state and prevent setText calls for the same text', async () => {
      const key = 'key';
      const value = 'value';
      const setText = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        setText
      });

      await dataStorage.setText(key, value);

      expect(setText).toBeCalledTimes(1);

      await dataStorage.setText(key, value);

      expect(setText).toBeCalledTimes(1);
    })

    it('should call DataStorage.setText with right params', async () => {
      const key = 'key';
      const value = 'value';
      const setText = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        setText
      });

      await dataStorage.setText(key, value);

      expect(setText).toBeCalledWith(key, value);
    })
  })

  describe('deleteItem', () => {
    it('should call DataStorage.deleteItem with right params', async () => {
      const key = 'key';
      const value = 'value';
      const deleteItem = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        deleteItem
      });

      await dataStorage.deleteItem(key);

      expect(deleteItem).toBeCalledWith(key);
    })

    it('should reset a prev state', async () => {
      const key = 'key';
      const value = 'value';
      const setText = jest.fn();
      const dataStorage = setTextOnlyIfChanged({
        ...createInMemoryDataStorage({ [key]: value }),
        setText
      });

      await dataStorage.setText(key, value);
      await dataStorage.deleteItem(key);
      await dataStorage.setText(key, value);

      expect(setText).toBeCalledTimes(2);
    })
  })
})
