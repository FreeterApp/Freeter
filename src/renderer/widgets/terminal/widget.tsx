/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import '@xterm/xterm/css/xterm.css';
import { ReactComponent, WidgetReactComponentProps } from '@/widgets/appModules';
import { useEffect, useMemo, useRef } from 'react';
import { useXTerm } from 'react-xtermjs';
import { FitAddon } from '@xterm/addon-fit';
import { Settings } from './settings';
import * as styles from './widget.module.scss';
import { closeTerminalPty, createTerminalPtySession, onTerminalPtyData, resizeTerminalPty, writeTerminalPty } from '@/infra/terminalPty/terminalPtyClient';

function WidgetComp({ widgetApi, settings }: WidgetReactComponentProps<Settings>) {
  const xtermTheme = useMemo(() => {
    const isDark = settings.theme === 'dark';
    return {
      background: isDark ? '#1e1e1e' : '#f8f8f8',
      foreground: isDark ? '#f8f8f8' : '#000000',
      cursor: isDark ? '#f8f8f8' : '#000000',
      selectionBackground: isDark ? '#f8f8f8' : '#000000',
      selectionForeground: isDark ? '#000000' : '#ffffff'
    };
  }, [settings.theme]);
  const fitAddon = useMemo(() => new FitAddon(), []);
  const { instance, ref } = useXTerm();
  const sessionIdRef = useRef<string | null>(null);
  const disposeDataRef = useRef<(() => void) | null>(null);
  const disposeInputRef = useRef<{ dispose: () => void } | null>(null);
  const initialCommandRef = useRef(settings.initialCommand);

  useEffect(() => {
    initialCommandRef.current = settings.initialCommand;
  }, [settings.initialCommand]);

  useEffect(() => {
    if (!instance) {
      return () => undefined;
    }
    instance.options.fontFamily = settings.fontFamily;
    instance.options.fontSize = settings.fontSize;
    instance.options.cursorStyle = settings.cursorStyle;
    instance.options.theme = xtermTheme;
    return () => undefined;
  }, [instance, settings.cursorStyle, settings.fontFamily, settings.fontSize, xtermTheme]);

  useEffect(() => {
    if (!instance) {
      return () => undefined;
    }

    instance.attachCustomKeyEventHandler((event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
        const selection = instance.getSelection();
        if (selection) {
          void widgetApi.clipboard.writeText(selection);
          return false;
        }
      }
      return true;
    });

    instance.loadAddon(fitAddon);
    const container = ref.current;
    if (container) {
      requestAnimationFrame(() => {
        fitAddon.fit();
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
      if (sessionIdRef.current) {
        void resizeTerminalPty(sessionIdRef.current, instance.cols, instance.rows);
      }
    });
    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [fitAddon, instance, ref, widgetApi.clipboard]);

  useEffect(() => {
    if (!instance) {
      return () => undefined;
    }

    let disposed = false;
    void (async () => {
      fitAddon.fit();
      const sessionId = await createTerminalPtySession(instance.cols, instance.rows);
      if (disposed) {
        await closeTerminalPty(sessionId);
        return;
      }
      sessionIdRef.current = sessionId;
      const initialCommand = initialCommandRef.current.trim();
      if (initialCommand !== '') {
        void writeTerminalPty(sessionId, `${initialCommand}\n`);
      }
      disposeDataRef.current = onTerminalPtyData(sessionId, (data) => {
        instance.write(data);
      });
      disposeInputRef.current = instance.onData((data) => {
        if (sessionIdRef.current) {
          void writeTerminalPty(sessionIdRef.current, data);
        }
      });
    })();

    return () => {
      disposed = true;
      disposeDataRef.current?.();
      disposeDataRef.current = null;
      disposeInputRef.current?.dispose();
      disposeInputRef.current = null;
      if (sessionIdRef.current) {
        void closeTerminalPty(sessionIdRef.current);
        sessionIdRef.current = null;
      }
    };
  }, [fitAddon, instance]);

  return (
    <div className={styles['terminal-root']}>
      <div ref={ref} className={styles['terminal-container']} />
    </div>
  );
}

export const widgetComp: ReactComponent<WidgetReactComponentProps<Settings>> = {
  type: 'react',
  Comp: WidgetComp
};
