import { ProcessInfo, ProcessInfoOsName } from '@common/base/process';
import { createUserAgent } from '@common/base/userAgent';
import { fixtureProcessInfoLinux, fixtureProcessInfoMac, fixtureProcessInfoWin } from '@testscommon/base/fixtures/process';

describe('UserAgent', () => {
  describe('createUserAgent', () => {
    it.each<[string, ProcessInfo, boolean]>([
      ['Mozilla/5.0 (Macintosh) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1.2.3 Safari/537.36', fixtureProcessInfoMac({ browser: { name: 'Chrome', ver: '1.2.3' }, os: { name: 'darwin', ver: '5.6.7' } }), false],
      ['Mozilla/5.0 (Linux) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/2.3.4 Safari/537.36', fixtureProcessInfoLinux({ browser: { name: 'Chrome', ver: '2.3.4' }, os: { name: 'linux', ver: '6.7.8' } }), false],
      ['Mozilla/5.0 (Windows) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/3.4.5 Safari/537.36', fixtureProcessInfoWin({ browser: { name: 'Chrome', ver: '3.4.5' }, os: { name: 'win32', ver: '7.8.9' } }), false],
      ['Mozilla/5.0 (-) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/3.4.5 Safari/537.36', fixtureProcessInfoMac({ browser: { name: 'Chrome', ver: '3.4.5' }, os: { name: 'another-os' as ProcessInfoOsName, ver: '7.8.9' }, isMac: false }), false],

      ['Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/1.2.3 Mobile Safari/537.36', fixtureProcessInfoMac({ browser: { name: 'Chrome', ver: '1.2.3' }, os: { name: 'darwin', ver: '5.6.7' } }), true],
      ['Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/2.3.4 Mobile Safari/537.36', fixtureProcessInfoLinux({ browser: { name: 'Chrome', ver: '2.3.4' }, os: { name: 'linux', ver: '6.7.8' } }), true],
      ['Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/3.4.5 Mobile Safari/537.36', fixtureProcessInfoWin({ browser: { name: 'Chrome', ver: '3.4.5' }, os: { name: 'win32', ver: '7.8.9' } }), true],
      ['Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/3.4.5 Mobile Safari/537.36', fixtureProcessInfoMac({ browser: { name: 'Chrome', ver: '3.4.5' }, os: { name: 'another-os' as ProcessInfoOsName, ver: '7.8.9' }, isMac: false }), true],
    ])(
      'should be "%s" when processInfo is "%o" and asMobile is "%j"',
      (expectedUserAgent, processInfo, asMobile) => {
        const res = createUserAgent(processInfo, asMobile);
        expect(res).toBe(expectedUserAgent);
      }
    )
  })
})
