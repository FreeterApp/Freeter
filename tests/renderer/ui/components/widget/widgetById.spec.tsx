/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { render, screen } from '@testing-library/react';
import { EntityId } from '@/base/entity';
import { WidgetComponent } from '@/ui/components/widget';
import { createWidgetByIdViewModelHook } from '@/ui/components/widget/widgetByIdViewModel';
import { createWidgetByIdComponent } from '@/ui/components/widget/widgetById';
import { createAppStateHook } from '@/ui/hooks/appState';
import { fixtureAppState } from '@tests/base/state/fixtures/appState';
import { fixtureWidgetAInColl } from '@tests/base/state/fixtures/entitiesState';
import { fixtureAppStore } from '@tests/data/fixtures/appStore';
import { AppState } from '@/base/state/app';
import { fixtureWidgetEnvAreaShelf } from '@tests/base/fixtures/widget';

const mockWidget: WidgetComponent = (props) => <div>{props.widget.type}</div>;
const widgetId = 'WIDGET-ID';
const widgetType = 'WIDGET-TYPE';

type SetupProps = {
  widgetId: EntityId;
  appState: AppState;
}
async function setup({
  widgetId,
  appState,
}: SetupProps) {
  const [appStore, appStoreForUi] = await fixtureAppStore(appState);
  const useAppState = createAppStateHook(appStoreForUi);
  const useWidgetByIdViewModel = createWidgetByIdViewModelHook({
    useAppState,
  })
  const WidgetById = createWidgetByIdComponent({
    Widget: mockWidget,
    useWidgetByIdViewModel
  })
  const comp = render(
    <WidgetById id={ widgetId } env={fixtureWidgetEnvAreaShelf()}/>
  );

  return {
    comp,
    appStore,
  }
}

describe('<WidgetById />', () => {
  it('should display a widget component using a widget state object from the Widgets store, if it has an item with the specified id', async () => {
    await setup({
      widgetId,
      appState: fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({
              id: widgetId,
              type: widgetType
            }),
          }
        }
      }),
    });
    expect(screen.getByText(widgetType)).toBeInTheDocument();
  })

  it('should display a warning, if Widgets store does not have an item with the specified id', async () => {
    await setup({
      widgetId: 'NO-SUCH-WIDGET',
      appState: fixtureAppState({
        entities: {
          widgets: {
            ...fixtureWidgetAInColl({
              id: widgetId
            }),
          }
        }
      }),
    });
    expect(screen.getByText('Widget instance does not exist')).toBeInTheDocument()
  })

});
