import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';
import { AdminReport } from '../../core/models/report.model';
import { Category } from '../../core/models/category.model';
import {
  LucideShield,
  LucideLayers,
  LucideAlertTriangle,
  LucideCoffee,
  LucideCheck,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    LucideShield,
    LucideLayers,
    LucideAlertTriangle,
    LucideCoffee,
    LucideCheck,
    LucideX,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Admin Header -->
      <div class="flex items-center justify-between pb-6 border-b border-slate-800">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
            <svg lucideShield class="w-3.5 h-3.5"></svg>
            <span>Console d'Administration LevelUpCode</span>
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Gestion du Contenu & Signalements
          </h1>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          (click)="activeTab.set('reports')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-indigo-600]="activeTab() === 'reports'"
          [class.text-white]="activeTab() === 'reports'"
          [class.text-slate-400]="activeTab() !== 'reports'"
          [class.hover:bg-slate-800]="activeTab() !== 'reports'"
        >
          <svg lucideAlertTriangle class="w-4 h-4"></svg>
          <span>Signalements</span>
          @if (pendingReportsCount() > 0) {
            <span class="px-2 py-0.5 rounded-full text-xs bg-rose-500 text-white font-bold">
              {{ pendingReportsCount() }}
            </span>
          }
        </button>

        <button
          type="button"
          (click)="activeTab.set('categories')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-indigo-600]="activeTab() === 'categories'"
          [class.text-white]="activeTab() === 'categories'"
          [class.text-slate-400]="activeTab() !== 'categories'"
          [class.hover:bg-slate-800]="activeTab() !== 'categories'"
        >
          <svg lucideLayers class="w-4 h-4"></svg>
          <span>Catégories</span>
        </button>

        <button
          type="button"
          (click)="activeTab.set('donations')"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
          [class.bg-indigo-600]="activeTab() === 'donations'"
          [class.text-white]="activeTab() === 'donations'"
          [class.text-slate-400]="activeTab() !== 'donations'"
          [class.hover:bg-slate-800]="activeTab() !== 'donations'"
        >
          <svg lucideCoffee class="w-4 h-4"></svg>
          <span>Dons Buy Me a Coffee</span>
        </button>
      </div>

      <!-- Tab Content: Reports -->
      @if (activeTab() === 'reports') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Anomalies et coquilles signalées</h2>
            <button
              type="button"
              (click)="loadReports()"
              class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Rafraîchir
            </button>
          </div>

          @if (reportsError()) {
            <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center gap-2.5">
              <svg lucideAlertTriangle class="w-5 h-5 shrink-0"></svg>
              <span>{{ reportsError() }}</span>
            </div>
          }

          @if (isLoadingReports()) {
            <div class="space-y-3">
              @for (i of [1, 2, 3]; track i) {
                <div class="h-20 bg-slate-800/40 rounded-xl animate-pulse"></div>
              }
            </div>
          } @else if (reports().length === 0 && !reportsError()) {
            <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm">
              🎉 Aucun signalement en attente. Tout le contenu pédagogique est opérationnel !
            </div>
          } @else {
            <div class="space-y-3">
              @for (report of reports(); track report.id) {
                <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="space-y-1.5 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-indigo-300 border border-slate-700">
                        {{ report.type }}
                      </span>
                      <span class="text-xs text-slate-400 font-mono">ID: {{ report.targetId }}</span>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-semibold"
                        [class.bg-amber-500\/10]="report.status === 'PENDING'"
                        [class.text-amber-400]="report.status === 'PENDING'"
                        [class.bg-emerald-500\/10]="report.status === 'RESOLVED'"
                        [class.text-emerald-400]="report.status === 'RESOLVED'"
                      >
                        {{ report.status }}
                      </span>
                    </div>

                    <p class="text-sm text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800 font-mono">
                      "{{ report.comment }}"
                    </p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      (click)="updateReportStatus(report.id, 'RESOLVED')"
                      class="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Marquer comme résolu"
                    >
                      <svg lucideCheck class="w-3.5 h-3.5"></svg>
                      <span>Résolu</span>
                    </button>

                    <button
                      type="button"
                      (click)="updateReportStatus(report.id, 'DISMISSED')"
                      class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Rejeter"
                    >
                      <svg lucideX class="w-3.5 h-3.5"></svg>
                      <span>Rejeter</span>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Tab Content: Categories -->
      @if (activeTab() === 'categories') {
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Catégories officielles ({{ adminCategories().length }})</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (cat of adminCategories(); track cat.id) {
              <div class="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
                    <img [src]="'/icons/' + cat.slug + '.svg'" [alt]="cat.name" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-base">{{ cat.name }}</h4>
                    <span class="text-xs font-mono text-slate-400">/catalog/{{ cat.slug }}</span>
                  </div>
                </div>
                <p class="text-xs text-slate-400 line-clamp-2">{{ cat.description }}</p>
                <div class="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                  <span>Ordre #{{ cat.orderIndex }}</span>
                  <span>{{ cat.tags?.length || 0 }} tags</span>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Tab Content: Donations -->
      @if (activeTab() === 'donations') {
        <div class="p-12 text-center rounded-2xl bg-slate-800/20 border border-slate-800 text-slate-400 text-sm space-y-3">
          <svg lucideCoffee class="w-8 h-8 text-amber-400 mx-auto"></svg>
          <p>Journal d'audit des dons Buy Me a Coffee configuré avec succès.</p>
        </div>
      }

    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  readonly activeTab = signal<'reports' | 'categories' | 'donations'>('reports');
  readonly reports = signal<AdminReport[]>([]);
  readonly adminCategories = signal<Category[]>([]);
  readonly isLoadingReports = signal<boolean>(false);
  readonly reportsError = signal<string | null>(null);

  pendingReportsCount(): number {
    const list = this.reports();
    return Array.isArray(list) ? list.filter((r) => r.status === 'PENDING').length : 0;
  }

  ngOnInit(): void {
    this.loadReports();
    this.loadCategories();
  }

  loadReports(): void {
    this.isLoadingReports.set(true);
    this.reportsError.set(null);
    this.http.get<any>(`${environment.apiUrl}/admin/reports`).subscribe({
      next: (res) => {
        const items: AdminReport[] = Array.isArray(res) ? res : res?.data || [];
        this.reports.set(items);
        this.isLoadingReports.set(false);
      },
      error: (err) => {
        this.isLoadingReports.set(false);
        this.reports.set([]);
        if (err.status === 403) {
          this.reportsError.set('Accès restreint : votre compte n’a pas le rôle ADMIN.');
        } else {
          this.reportsError.set(err.error?.message || 'Erreur lors du chargement des signalements.');
        }
      },
    });
  }

  loadCategories(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/categories`).subscribe({
      next: (res) => {
        const items: Category[] = Array.isArray(res) ? res : res?.data || [];
        this.adminCategories.set(items);
      },
      error: () => {
        this.adminCategories.set([]);
      },
    });
  }

  updateReportStatus(reportId: string, status: 'RESOLVED' | 'DISMISSED'): void {
    this.http
      .patch(`${environment.apiUrl}/admin/reports/${reportId}`, { status })
      .subscribe({
        next: () => {
          this.toast.success(`Signalement mis à jour (${status}).`);
          this.reports.update((list) =>
            list.map((r) => (r.id === reportId ? { ...r, status } : r))
          );
        },
        error: () => {
          this.toast.error('Erreur lors de la mise à jour du signalement.');
        },
      });
  }
}
