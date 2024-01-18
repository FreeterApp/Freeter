module.exports = {
  appId: 'io.freeter.app',
  productName: 'Freeter',
  artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
  files: [{
    from: './build',
    to: './'
  }, {
    from: './',
    to: './',
    filter: ['package.json']
  }],
  mac: {
    category: 'public.app-category.productivity',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'resources/darwin/freeter.icns',
    publish: ['github'],
  },
  dmg: {
    background: 'resources/darwin/dmgBg.png',
    icon: 'resources/darwin/freeter.icns',
    iconSize: 128,
    contents: [
      { x: 114, y: 150, type: 'file' },
      { x: 386, y: 150, type: 'link', path: '/Applications' },
    ]
  },
  win: {
    target: [
      {
        target: 'msi',
        arch: ['x64']
      },
      {
        target: 'zip',
        arch: ['x64']
      }
    ],
    icon: 'resources/win32/freeter.ico',
    publish: ['github'],
  },
  linux: {
    target: [
      {
        target: 'tar.xz',
        arch: ['x64']
      }
    ],
    icon: 'resources/linux/freeter-icons',
    publish: ['github'],
  }
}
