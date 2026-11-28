import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  MonitorPlay,
  Trash2,
  X,
} from 'lucide-react';
import { GRANTH_CATALOG } from '../data/gurbaniCorpus';
import type { QueueItem } from '../types/pothi';

interface QueueDrawerProps {
  open: boolean;
  onClose: () => void;
  queue: QueueItem[];
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onClear: () => void;
  onOpenInReader: (item: QueueItem) => void;
  onLaunchPresenter: (startIndex?: number) => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  open,
  onClose,
  queue,
  onRemove,
  onMove,
  onClear,
  onOpenInReader,
  onLaunchPresenter,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Multi-View Shabad Queue"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l pothi-divider bg-[var(--surface-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b pothi-divider px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--ink-primary)]">
              Multi-View Queue
            </h2>
            <p className="text-xs text-[var(--ink-muted)]">
              {queue.length} {queue.length === 1 ? 'Shabad' : 'Shabads'} staged for Reader or Presenter Mode
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close queue panel"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] hover:text-[var(--ink-primary)] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {queue.length === 0 ? (
            <div className="rounded-xl border pothi-divider bg-[var(--surface-subtle)] p-6 text-center">
              <p className="text-sm font-medium text-[var(--ink-primary)]">
                Your Multi-View Queue is empty
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--ink-muted)]">
                Add Shabads from the Gurbani Searcher, Sundar Gutka, or Scripture Reader to switch effortlessly between multiple Shabads or project them in Presenter Mode.
              </p>
            </div>
          ) : (
            <ul className="divide-y pothi-divider">
              {queue.map((item, idx) => (
                <li key={item.id} className="py-3.5 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-[var(--ink-muted)]">
                        <span className="font-mono-nums">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>{' '}
                        {GRANTH_CATALOG[item.granth].shortName}
                        {item.ang ? ` · Ang ${item.ang}` : ''}
                      </p>
                      <p
                        lang="pa"
                        className="mt-1 font-gurmukhi-noto text-base font-medium text-[var(--ink-primary)] truncate"
                      >
                        {item.titleGurmukhi}
                      </p>
                      <p className="text-xs text-[var(--ink-secondary)] truncate">
                        {item.titleEnglish}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onMove(item.id, 'up')}
                        disabled={idx === 0}
                        aria-label={`Move ${item.titleEnglish} up`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(item.id, 'down')}
                        disabled={idx === queue.length - 1}
                        aria-label={`Move ${item.titleEnglish} down`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.titleEnglish} from queue`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--surface-subtle)] hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenInReader(item);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-gold)] hover:underline cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      Open in Reader
                    </button>
                    <span className="text-[var(--ink-muted)]" aria-hidden="true">
                      ·
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onLaunchPresenter(idx);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ink-secondary)] hover:text-[var(--ink-primary)] cursor-pointer"
                    >
                      <MonitorPlay className="h-3.5 w-3.5" aria-hidden="true" />
                      Present from here
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t pothi-divider px-5 py-4 space-y-2.5">
          <button
            type="button"
            disabled={queue.length === 0}
            onClick={() => {
              onLaunchPresenter(0);
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-navy)] px-4 py-2.5 text-sm font-medium text-white dark:text-[#0c1220] hover:bg-[var(--accent-navy-hover)] disabled:opacity-40 cursor-pointer min-h-[44px]"
          >
            <MonitorPlay className="h-4 w-4" aria-hidden="true" />
            Launch Presenter Mode
          </button>
          {queue.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-lg border pothi-divider px-4 py-2 text-xs font-medium text-[var(--ink-secondary)] hover:bg-[var(--surface-subtle)] cursor-pointer min-h-[40px]"
            >
              Clear Queue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
