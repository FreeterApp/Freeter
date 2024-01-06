/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { ProcessProvider } from '@/application/interfaces/processProvider';
import { createGetProcessInfoUseCase } from '@/application/useCases/process/getProcessInfo';
import { ProcessInfo } from '@common/base/process';

const providerRetVal = 'provider return value';
function setup() {
  const processProviderMock: ProcessProvider = {
    getProcessInfo: jest.fn(() => providerRetVal as unknown as ProcessInfo)
  }
  const useCase = createGetProcessInfoUseCase({
    processProvider: processProviderMock
  });
  return {
    processProviderMock,
    useCase
  }
}

describe('getProcessInfoUseCase()', () => {
  it('should call getProcessInfo() of processProvider and return a right val', async () => {
    const { useCase, processProviderMock } = setup()

    const res = await useCase();

    expect(processProviderMock.getProcessInfo).toBeCalledTimes(1);
    expect(res).toBe(providerRetVal);
  });
})
