const {BrowserWindow, Menu, app, shell, dialog} = require('electron')
const settings = require('electron-settings')

let advNav = settings.get('browserSetting.app.navAdvancedState') || 'normal'
let btmAmountUnit = settings.get('browserSetting.core.btmAmountUnit') || 'BTM'
let menu = null
const i18n = global.i18n

let menuTempl = function () {
  const menu = []

  // APP
  const fileMenu = []
  const name = app.getName()

  if (process.platform === 'darwin') {
    fileMenu.push(
      {
        label: i18n.t('desktop.applicationMenu.app.about', { name }),
        role: 'about'
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t('desktop.applicationMenu.app.services', { name }),
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        label: i18n.t('desktop.applicationMenu.app.hide', { name }),
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: i18n.t('desktop.applicationMenu.app.hideOthers', { name }),
        accelerator: 'Command+Alt+H',
        role: 'hideothers',
      },
      {
        label: i18n.t('desktop.applicationMenu.app.showAll', { name }),
        role: 'unhide',
      },
      {
        type: 'separator',
      }
    )
  }

  fileMenu.push({
    label: i18n.t('desktop.applicationMenu.app.quit', { name }),
    accelerator: 'CommandOrControl+Q',
    click() {
      app.quit()
    },
  })

  menu.push({
    label: i18n.t('desktop.applicationMenu.app.label', { name }),
    submenu: fileMenu,
  })


  // View Account
  menu.push({
    label: 'Account',
    submenu: [{
      label: 'new Account',
      accelerator: 'CommandOrControl+N',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.webContents.send('redirect', '/accounts/create')
        }
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F'
        } else {
          return 'F11'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    }]
  })


  // LANGUAGE (VIEW)
  const LanguageMenu = [{
    label: 'Default',
    type: 'checkbox',
    // checked: btmAmountUnit === 'BTM',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
      }
    }
  },{
    type: 'separator'
  },{
    label: '中文',
    type: 'checkbox',
    // checked: btmAmountUnit === 'mBTM',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        i18n.changeLanguage('zh', (err, t) => {
          if (err) return console.log('something went wrong loading', err)
          createMenu()
        })

      }
    }
  },{
    label: 'English',
    type: 'checkbox',
    // checked: btmAmountUnit === 'NEU',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        // debugger
        i18n.changeLanguage('en', (err, t) => {
          if (err) return console.log('something went wrong loading', err)
          createMenu()
        })
      }
    }
  }]



  menu.push({
    label: 'View',
    submenu: [{
      label: 'BTM Amount Unit',
      submenu:[{
        label: 'BTM',
        type: 'checkbox',
        checked: btmAmountUnit === 'BTM',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('btmAmountUnitState', 'BTM')
          }
        }
      },{
        label: 'mBTM',
        type: 'checkbox',
        checked: btmAmountUnit === 'mBTM',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('btmAmountUnitState', 'mBTM')
          }
        }
      },{
        label: 'NEU',
        type: 'checkbox',
        checked: btmAmountUnit === 'NEU',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.send('btmAmountUnitState', 'NEU')
          }
        }
      }]
    }, {
      label: 'Advanced Navigation',
      type: 'checkbox',
      checked: advNav === 'advance',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          if(advNav === 'advance'){
            focusedWindow.webContents.send('toggleNavState', 'normal')
          }else{
            focusedWindow.webContents.send('toggleNavState', 'advance')
          }
        }
      }
    },{
      type: 'separator'
    },{
      label: 'Lanugage',
      submenu: LanguageMenu
    }]
  })

  // HELP
  const helpMenu = []
  helpMenu.push({
    label: i18n.t('desktop.applicationMenu.help.desktopWiki'),
    click() {
      shell.openExternal('https://github.com/bytom/bytom/wiki')
    },
  }, {
    label: i18n.t('desktop.applicationMenu.help.reportBug'),
    click() {
      shell.openExternal('https://github.com/bytom/bytom/issues')
    },
  })

  menu.push({
    label: i18n.t('desktop.applicationMenu.help.label'),
    role: 'help',
    submenu: helpMenu,
  })

  return menu
}

function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(item => {
    if (item.submenu) {
      item.submenu.items.forEach(item => {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}


const createMenu = function () {
  menu = Menu.buildFromTemplate(menuTempl())
  Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
  createMenu()

  settings.watch('browserSetting.app.navAdvancedState', newValue => {
    advNav = newValue
    menu.items[2].submenu.items[1].checked = ( advNav === 'advance' )
  })

  settings.watch('browserSetting.core.btmAmountUnit', newValue => {
    btmAmountUnit = newValue
    menu.items[2].submenu.items[0].submenu.items[0].checked = ( btmAmountUnit === 'BTM' )
    menu.items[2].submenu.items[0].submenu.items[1].checked = ( btmAmountUnit === 'mBTM' )
    menu.items[2].submenu.items[0].submenu.items[2].checked = ( btmAmountUnit === 'NEU' )
  })

})

app.on('browser-window-created', () => {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', () => {
  let reopenMenuItem = findReopenMenuItem()
  if (reopenMenuItem) reopenMenuItem.enabled = true
})
