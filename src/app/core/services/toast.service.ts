import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'streak';
  message: string;
  subMessage?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { ...toast, id };

    this.toasts.update((current) => [...current, newToast]);

    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, subMessage?: string): void {
    this.show({ type: 'success', message, subMessage });
  }

  error(message: string, subMessage?: string): void {
    this.show({ type: 'error', message, subMessage, duration: 5000 });
  }

  info(message: string, subMessage?: string): void {
    this.show({ type: 'info', message, subMessage });
  }

  streak(streakCount: number, xpEarned?: number): void {
    this.show({
      type: 'streak',
      message: `🔥 Série active : ${streakCount} ${streakCount > 1 ? 'jours' : 'jour'} d'affilée !`,
      subMessage: xpEarned ? `+${xpEarned} XP remportés !` : undefined,
      duration: 5000,
    });
  }

  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }
}
