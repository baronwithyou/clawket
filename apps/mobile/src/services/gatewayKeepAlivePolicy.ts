import { Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import type { ConnectionState } from '../types';

export const BACKGROUND_KEEPALIVE_WINDOW_MS = 5 * 60 * 1000;

export function shouldRunGatewayKeepAlive(
  connectionState: ConnectionState,
  appState: AppStateStatus,
  platformOs: string = Platform.OS,
  lastChatRunStartAtMs?: number,
): boolean {
  if (connectionState !== 'ready') return false;
  if (appState === 'active') return true;
  if (platformOs === 'android' && appState === 'background') {
    if (!lastChatRunStartAtMs) return false;
    return Date.now() - lastChatRunStartAtMs < BACKGROUND_KEEPALIVE_WINDOW_MS;
  }
  return false;
}
