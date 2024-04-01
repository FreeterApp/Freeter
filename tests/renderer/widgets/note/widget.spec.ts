/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { widgetComp } from '@/widgets/note/widget'
import { act, screen, waitFor } from '@testing-library/react';
import { SetupWidgetSutOptional, setupWidgetSut } from '@tests/widgets/setupSut'

jest.useFakeTimers();

function setupNoteWidgetSut(optional?: SetupWidgetSutOptional) {
  return setupWidgetSut(widgetComp, { spellCheck: false }, optional);
}

describe('Note Widget', () => {
  it('should show the loading status and hide the textbox on start', async () => {
    setupNoteWidgetSut();

    await waitFor(() => {
      expect(screen.getByText('Loading Note...')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    })
  })

  it('should hide the loading status and show the textbox after loading data', async () => {
    setupNoteWidgetSut();

    await waitFor(() => {
      expect(screen.getByText('Loading Note...')).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    })

    await waitFor(() => {
      expect(screen.queryByText('Loading Note...')).not.toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    })
  })

  it('should get the note stored in DataStorage on start', async () => {
    const testNote = 'TEST NOTE';
    const getText = jest.fn().mockResolvedValue(testNote);
    setupNoteWidgetSut({
      mockWidgetApi: {
        dataStorage: {
          getText
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    })

    expect(getText).toBeCalledWith('note');
    expect(screen.getByRole<HTMLTextAreaElement>('textbox')).toHaveValue(testNote);
  })

  it('should have an empty note when DataStorage does not have the note data', async () => {
    const getText = jest.fn().mockResolvedValue(undefined);
    setupNoteWidgetSut({
      mockWidgetApi: {
        dataStorage: {
          getText
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    })

    expect(getText).toBeCalledWith('note');
    expect(screen.getByRole<HTMLTextAreaElement>('textbox')).toHaveValue('');
  })

  it('should update the note in DataStorage on when the user edits it, after a 3 sec delay', async () => {
    const note1 = 'NOTE1';
    const note2 = 'NOTE1';
    const note3 = 'NOTE1';
    const setText = jest.fn();
    const { userEvent } = setupNoteWidgetSut({
      mockWidgetApi: {
        dataStorage: {
          setText
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    })

    const textbox = screen.getByRole('textbox');

    userEvent.type(textbox, note1);
    await waitFor(() => expect(textbox).toHaveValue(note1))

    act(() => jest.advanceTimersByTime(1000));
    expect(setText).toBeCalledTimes(0);

    userEvent.type(textbox, note2);
    await waitFor(() => expect(textbox).toHaveValue(note1 + note2))

    act(() => jest.advanceTimersByTime(2000));
    expect(setText).toBeCalledTimes(0);

    userEvent.type(textbox, note3);
    await waitFor(() => expect(textbox).toHaveValue(note1 + note2 + note3))

    act(() => jest.advanceTimersByTime(3000));
    expect(setText).toBeCalledTimes(1);
    expect(setText).toBeCalledWith('note', note1 + note2 + note3);
  })
})
