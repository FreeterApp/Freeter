/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import os from 'node:os';
import { IpcMainEvent } from '@/controllers/interfaces/ipcMain';
import { WebContents } from '@/application/interfaces/webContents';
import { ipcTerminalPtyDataChannel } from '@common/ipc/channels';
import type { IPty } from 'node-pty';
import { spawn } from 'node-pty';

type PtySession = {
  pty: IPty;
  sender: WebContents;
};

function getDefaultShell(): string {
  if (process.platform === 'win32') {
    return process.env.ComSpec || 'cmd.exe';
  }
  return process.env.SHELL || '/bin/bash';
}

let nextSessionId = 1;

export class TerminalPtyManager {
  private readonly sessions = new Map<string, PtySession>();

  createSession(event: IpcMainEvent, cols: number, rows: number, cwd?: string): string {
    const sessionId = `pty-${nextSessionId++}`;
    const pty = spawn(getDefaultShell(), [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: cwd || os.homedir(),
      env: process.env as Record<string, string>,
    });

    const sender = event.sender;
    pty.onData((data) => {
      sender.send(ipcTerminalPtyDataChannel, sessionId, data);
    });
    pty.onExit(() => {
      this.sessions.delete(sessionId);
    });

    this.sessions.set(sessionId, { pty, sender });
    return sessionId;
  }

  write(sessionId: string, data: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    session.pty.write(data);
  }

  resize(sessionId: string, cols: number, rows: number): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    session.pty.resize(cols, rows);
  }

  close(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    session.pty.kill();
    this.sessions.delete(sessionId);
  }
}
