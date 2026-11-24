export type ProjectionPalette = 'obsidian' | 'navy' | 'parchment';

export interface PresenterSyncPayload {
  senderId: string;
  itemIndex: number;
  tukIndex: number;
  palette: ProjectionPalette;
  blackout: boolean;
  fontScale: number;
  larivaar: boolean;
  showTransliteration: boolean;
  updatedAt: number;
}

const CHANNEL_NAME = 'tatkhalsa-pothi-presenter-sync-v1';
const STORAGE_KEY = 'tatkhalsa.pothi.presenterSyncState';

export function createPresenterSyncClient(
  onReceive: (payload: PresenterSyncPayload) => void,
): {
  senderId: string;
  publish: (state: Omit<PresenterSyncPayload, 'senderId' | 'updatedAt'>) => void;
  dispose: () => void;
} {
  const senderId = `tab-${Math.random().toString(36).slice(2, 10)}`;
  let channel: BroadcastChannel | null = null;

  if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event: MessageEvent<PresenterSyncPayload>) => {
        const data = event.data;
        if (data && data.senderId !== senderId) {
          onReceive(data);
        }
      };
    } catch {
      channel = null;
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const parsed = JSON.parse(event.newValue) as PresenterSyncPayload;
      if (parsed && parsed.senderId !== senderId) {
        onReceive(parsed);
      }
    } catch {
      // ignore malformed sync payload
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return {
    senderId,
    publish(state) {
      const payload: PresenterSyncPayload = {
        ...state,
        senderId,
        updatedAt: Date.now(),
      };
      try {
        channel?.postMessage(payload);
      } catch {
        // ignore channel closed errors
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // ignore storage quota errors
      }
    },
    dispose() {
      try {
        channel?.close();
      } catch {
        // ignore
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    },
  };
}
