/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { AppState } from '@/base/state/app';
import { createAppManagerComponent, createAppManagerViewModelHook} from '@/ui/components/appManager';
import { createAppStateHook } from '@/ui/hooks/appState';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fixtureAppSettingsA, fixtureAppSettingsB } from '@tests/base/fixtures/app';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureAppAInColl, fixtureAppBInColl, fixtureAppCInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureModalScreens, fixtureModalScreensData } from '@tests/base/state/fixtures/modalScreens';
import { fixtureAppManager } from '@tests/base/state/fixtures/appManager';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';

async function setup(
  appState: AppState
) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);

  const addAppInAppManagerUseCase = jest.fn();
  const closeAppManagerUseCase = jest.fn();
  const saveChangesInAppManagerUseCase = jest.fn();
  const switchAppInAppManagerUseCase = jest.fn();
  const toggleDeletionInAppManagerUseCase = jest.fn();
  const updateAppSettingsInAppManagerUseCase = jest.fn();
  const updateAppsOrderInAppManagerUseCase = jest.fn();
  const duplicateAppInAppManagerUseCase = jest.fn();
  const showOpenFileDialogUseCase = jest.fn();
  const useAppManagerViewModel = createAppManagerViewModelHook({
    useAppState,
    addAppInAppManagerUseCase,
    closeAppManagerUseCase,
    saveChangesInAppManagerUseCase,
    switchAppInAppManagerUseCase,
    toggleDeletionInAppManagerUseCase,
    updateAppSettingsInAppManagerUseCase,
    updateAppsOrderInAppManagerUseCase,
    duplicateAppInAppManagerUseCase,
    showOpenFileDialogUseCase,
  })
  const AppManager = createAppManagerComponent({
    useAppManagerViewModel
  })
  const comp = render(
    <AppManager/>
  );

  return {
    comp,
    appStore,
    addAppInAppManagerUseCase,
    closeAppManagerUseCase,
    saveChangesInAppManagerUseCase,
    switchAppInAppManagerUseCase,
    toggleDeletionInAppManagerUseCase,
    updateAppSettingsInAppManagerUseCase,
    updateAppsOrderInAppManagerUseCase,
  }
}

const classIsDropArea = 'is-drop-area';

describe('<AppManager />', () => {
  it('should not display the app manager, if the deleteAppIds is null', async () => {
    await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: null,
              apps: {},
              appIds: []
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Apps')).not.toBeInTheDocument();
  })

  it('should not display the app manager, if the apps is null', async () => {
    await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: null,
              appIds: []
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Apps')).not.toBeInTheDocument();
  })

  it('should not display the app manager, if the appIds is null', async () => {
    await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {},
              appIds: null
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Apps')).not.toBeInTheDocument();
  })

  it('should display the app manager, if all the required params are not null', async () => {
    await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {},
              appIds: [],
            })
          })
        })
      }
    }));

    expect(screen.queryByText('Apps')).toBeInTheDocument();
  })

  it('should call a right usecase when clicking the cancel button', async () => {
    const {closeAppManagerUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {},
              appIds: []
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /cancel/i
    });

    expect(closeAppManagerUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(closeAppManagerUseCase).toBeCalledTimes(1);
  })

  it('should call a right usecase with right params when clicking the ok button', async () => {
    const {saveChangesInAppManagerUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {},
              appIds: []
            })
          })
        })
      }
    }));

    const elButton = screen.getByRole('button', {
      name: /ok/i
    });

    expect(saveChangesInAppManagerUseCase).toBeCalledTimes(0);

    fireEvent.click(elButton);

    expect(saveChangesInAppManagerUseCase).toBeCalledTimes(1);
  })

  describe('App List', () => {
    it('should display a tablist', async () => {
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {},
                appIds: []
              })
            })
          })
        }
      }));
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should display 0 tabs, when there are 0 apps', async () => {
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {},
                appIds: []
              })
            })
          })
        }
      }));
      expect(screen.queryAllByRole('tab').length).toBe(0);
    });

    it('should display 2 tabs, when there are 2 apps', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));
      expect(screen.getAllByRole('tab').length).toBe(2);
    });

    it('should display app names', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB})}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));
      expect(screen.getByText(nameA)).toBeInTheDocument();
      expect(screen.getByText(nameB)).toBeInTheDocument();
    });

    it('should display an action bar for each app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));

      expect(screen.queryAllByRole('toolbar').length).toBe(2);
    })

    it('should display the delete app action for each app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));

      expect(screen.queryAllByRole('button', {name: /delete app/i}).length).toBe(2);
    })

    it('should make the delete app action pressed for each app marked for deletion', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {[idA]: true, [idC]: true},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                  ...fixtureAppCInColl({id: idC}),
                },
                appIds: [idA, idB, idC]
              })
            })
          })
        }
      }));

      const delButtons = screen.queryAllByRole('button', {name: /delete app/i});
      expect(delButtons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(delButtons[1]).not.toHaveAttribute('aria-pressed');
      expect(delButtons[2]).toHaveAttribute('aria-pressed', 'true');
    })

    it('should call the toggle deletion usecase with right params, when clicking the Delete App button', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const {toggleDeletionInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));

      const elButton = screen.queryAllByRole('button', {name: /delete app/i})[1];
      fireEvent.click(elButton);

      expect(toggleDeletionInAppManagerUseCase).toBeCalledTimes(1);
      expect(toggleDeletionInAppManagerUseCase).toBeCalledWith(idB);
    })

    it('should display apps on the list in the right order', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB})}),
                },
                appIds: [idA, idB]
              })
            })
          })
        }
      }));

      const items = screen.getAllByRole('tab');
      expect(items[0]).toHaveTextContent(nameA);
      expect(items[1]).toHaveTextContent(nameB);
    });

    it('should mark the current app on the list', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB],
                currentAppId: idB
              })
            })
          })
        }
      }));
      const items = screen.getAllByRole('tab');

      expect(items[0]).toHaveAttribute('aria-selected', 'false');
      expect(items[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('should call a right usecase with right params, when clicking an app item', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const {switchAppInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      }))

      fireEvent.click(screen.getAllByRole('tab')[1]);

      expect(switchAppInAppManagerUseCase).toBeCalledTimes(1);
      expect(switchAppInAppManagerUseCase).toBeCalledWith(idB);
    })

    it('should display Add App button', async () => {
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {},
                appIds: []
              })
            })
          })
        }
      }));

      expect(screen.getByRole('button', {
        name: /Add App/i
      })).toBeInTheDocument();
    });

    it('should call a right usecase with right params, when clicking Add App button', async () => {
      const {addAppInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {},
                appIds: []
              })
            })
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add App/i
      }));

      expect(addAppInAppManagerUseCase).toBeCalledTimes(1);
      expect(addAppInAppManagerUseCase).toBeCalledWith();
    })

    it('should correctly set the is-drop-rea class and call the update apps order usecase when draging & dropping an item', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      const {updateAppsOrderInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                  ...fixtureAppCInColl({id: idC})
                },
                appIds: [idA, idB, idC],
                currentAppId: idA
              })
            })
          })
        }
      }))

      const tabEls = screen.getAllByRole('tab');

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);

      fireEvent.dragStart(tabEls[0]);

      fireEvent.dragEnter(tabEls[0]);
      fireEvent.dragOver(tabEls[0], {dataTransfer: {}});
      expect(tabEls[0]).toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[0]);

      fireEvent.dragEnter(tabEls[1]);
      fireEvent.dragOver(tabEls[1], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[1]);

      fireEvent.dragEnter(tabEls[2]);
      fireEvent.dragOver(tabEls[2], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).toHaveClass(classIsDropArea);
      expect(updateAppsOrderInAppManagerUseCase).toBeCalledTimes(0);
      fireEvent.drop(tabEls[2]);
      expect(updateAppsOrderInAppManagerUseCase).toBeCalledTimes(1);
      expect(updateAppsOrderInAppManagerUseCase).toBeCalledWith([idB, idC, idA]);
      fireEvent.dragEnd(tabEls[0]);

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
    });

    it('should do nothing when dragging something from outside', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const idC = 'P-C';
      const {updateAppsOrderInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                  ...fixtureAppCInColl({id: idC})
                },
                appIds: [idA, idB, idC],
                currentAppId: idA
              })
            })
          })
        }
      }))

      const tabEls = screen.getAllByRole('tab');

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);

      fireEvent.dragEnter(tabEls[0]);
      fireEvent.dragOver(tabEls[0], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[0]);

      fireEvent.dragEnter(tabEls[1]);
      fireEvent.dragOver(tabEls[1], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      fireEvent.dragLeave(tabEls[1]);

      fireEvent.dragEnter(tabEls[2]);
      fireEvent.dragOver(tabEls[2], {dataTransfer: {}});
      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
      expect(updateAppsOrderInAppManagerUseCase).toBeCalledTimes(0);
      fireEvent.drop(tabEls[2]);
      expect(updateAppsOrderInAppManagerUseCase).toBeCalledTimes(0);

      expect(tabEls[0]).not.toHaveClass(classIsDropArea);
      expect(tabEls[1]).not.toHaveClass(classIsDropArea);
      expect(tabEls[2]).not.toHaveClass(classIsDropArea);
    });

  })

  describe('App Settings', () => {
    it('should not display a tabpanel, when there is not a selected app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB],
                currentAppId: ''
              })
            })
          })
        }
      }));

      expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    });

    it('should display a tabpanel, when there is a selected app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      }));

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('should fill inputs with values of a first app, when it is selected', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      const execPathA = 'exec path a';
      const execPathB = 'exec path b';
      const cmdArgsA = 'cmd a';
      const cmdArgsB = 'cmd b';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA, execPath: execPathA, cmdArgs: cmdArgsA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB, execPath: execPathB, cmdArgs: cmdArgsB})}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(nameA);
      expect(screen.getByRole('textbox', { name: /^executable file$/i })).toHaveValue(execPathA);
      expect(screen.getByRole('textbox', { name: /^command line arguments$/i })).toHaveValue(cmdArgsA);
    })

    it('should fill inputs with values of a second app, when it is selected', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      const execPathA = 'exec path a';
      const execPathB = 'exec path b';
      const cmdArgsA = 'cmd a';
      const cmdArgsB = 'cmd b';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA, execPath: execPathA, cmdArgs: cmdArgsA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB, execPath: execPathB, cmdArgs: cmdArgsB})}),
                },
                appIds: [idA, idB],
                currentAppId: idB
              })
            })
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).toHaveValue(nameB);
      expect(screen.getByRole('textbox', { name: /^executable file$/i })).toHaveValue(execPathB);
      expect(screen.getByRole('textbox', { name: /^command line arguments$/i })).toHaveValue(cmdArgsB);
    })

    it('should not focus the Name input field on init', async () => {
      const idA = 'P-A';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                },
                appIds: [idA],
                currentAppId: idA
              })
            })
          })
        }
      }));

      expect(screen.getByRole('textbox', { name: /^name$/i })).not.toHaveFocus();
    })

    it('should not focus the Name input field on app switch', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const initState = fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                  ...fixtureAppBInColl({id: idB}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      })
      const {appStore} = await setup(initState);

      act(()=>{
        appStore.set({
          ...initState,
          ui: {
            ...initState.ui,
            modalScreens: {
              ...initState.ui.modalScreens,
              data: {
                ...initState.ui.modalScreens.data,
                appManager: {
                  ...initState.ui.modalScreens.data.appManager,
                  currentAppId: idB
                }
              }
            }
          }
        })
      })

      expect(screen.getByRole('textbox', { name: /^name$/i })).not.toHaveFocus();
    })

    it('should focus the Name input field, when adding a new app', async () => {
      const idA = 'P-A';
      await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA}),
                },
                appIds: [idA],
                currentAppId: idA
              })
            })
          })
        }
      }));

      fireEvent.click(screen.getByRole('button', {
        name: /Add App/i
      }));

      const nameInput: HTMLInputElement = screen.getByRole('textbox', { name: /^name$/i });
      expect(nameInput).toHaveFocus();
    })

    it('should call updateAppSettingsInAppManagerUseCase with right args when editing the name of a first app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      const addToName = '!';
      const settings = fixtureAppSettingsA({ name: nameA });
      const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB})}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
      expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idA, {
        ...settings,
        name: nameA+addToName
      })
    })

    it('should call updateAppSettingsInAppManagerUseCase with right args when editing the name of a second app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const nameA = 'APP NAME A';
      const nameB = 'APP NAME B';
      const addToName = '!';
      const settings = fixtureAppSettingsB({ name: nameB });
      const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({name: nameA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({name: nameB})}),
                },
                appIds: [idA, idB],
                currentAppId: idB
              })
            })
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^name$/i })

      await userEvent.type(input, addToName);

      expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
      expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idB, {
        ...settings,
        name: nameB+addToName
      })
    })

    it('should call updateAppSettingsInAppManagerUseCase with right args when editing the execPath of a first app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const execPathA = 'Exec Path A';
      const execPathB = 'Exec Path B';
      const addToPath = '!';
      const settings = fixtureAppSettingsA({ execPath: execPathA });
      const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({execPath: execPathA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({execPath: execPathB})}),
                },
                appIds: [idA, idB],
                currentAppId: idA
              })
            })
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^executable file$/i })

      await userEvent.type(input, addToPath);

      expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
      expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idA, {
        ...settings,
        execPath: execPathA+addToPath
      })
    })

    it('should call updateAppSettingsInAppManagerUseCase with right args when editing the execPath of a second app', async () => {
      const idA = 'P-A';
      const idB = 'P-B';
      const execPathA = 'Exec Path A';
      const execPathB = 'Exec Path B';
      const addToPath = '!';
      const settings = fixtureAppSettingsB({ execPath: execPathB });
      const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
        ui: {
          modalScreens: fixtureModalScreens({
            data: fixtureModalScreensData({
              appManager: fixtureAppManager({
                deleteAppIds: {},
                apps: {
                  ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({execPath: execPathA})}),
                  ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({execPath: execPathB})}),
                },
                appIds: [idA, idB],
                currentAppId: idB
              })
            })
          })
        }
      }));
      const input = screen.getByRole('textbox', { name: /^executable file$/i })

      await userEvent.type(input, addToPath);

      expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
      expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idB, {
        ...settings,
        execPath: execPathB+addToPath
      })
    })
  })

  it('should call updateAppSettingsInAppManagerUseCase with right args when editing the cmdArgs of a first app', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    const cmdArgsA = 'Cmd Args A';
    const cmdArgsB = 'Cmd Args B';
    const addToPath = '!';
    const settings = fixtureAppSettingsA({ cmdArgs: cmdArgsA });
    const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {
                ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({cmdArgs: cmdArgsA})}),
                ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({cmdArgs: cmdArgsB})}),
              },
              appIds: [idA, idB],
              currentAppId: idA
            })
          })
        })
      }
    }));
    const input = screen.getByRole('textbox', { name: /^Command Line Arguments$/i })

    await userEvent.type(input, addToPath);

    expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
    expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idA, {
      ...settings,
      cmdArgs: cmdArgsA+addToPath
    })
  })

  it('should call updateAppSettingsInAppManagerUseCase with right args when editing the cmdArgs of a second app', async () => {
    const idA = 'P-A';
    const idB = 'P-B';
    const cmdArgsA = 'Cmd Args A';
    const cmdArgsB = 'Cmd Args B';
    const addToPath = '!';
    const settings = fixtureAppSettingsB({ cmdArgs: cmdArgsB });
    const {updateAppSettingsInAppManagerUseCase} = await setup(fixtureAppState({
      ui: {
        modalScreens: fixtureModalScreens({
          data: fixtureModalScreensData({
            appManager: fixtureAppManager({
              deleteAppIds: {},
              apps: {
                ...fixtureAppAInColl({id: idA, settings: fixtureAppSettingsA({cmdArgs: cmdArgsA})}),
                ...fixtureAppBInColl({id: idB, settings: fixtureAppSettingsB({cmdArgs: cmdArgsB})}),
              },
              appIds: [idA, idB],
              currentAppId: idB
            })
          })
        })
      }
    }));
    const input = screen.getByRole('textbox', { name: /^Command Line Arguments$/i })

    await userEvent.type(input, addToPath);

    expect(updateAppSettingsInAppManagerUseCase).toBeCalledTimes(1);
    expect(updateAppSettingsInAppManagerUseCase).toBeCalledWith(idB, {
      ...settings,
      cmdArgs: cmdArgsB+addToPath
    })
  })
})
