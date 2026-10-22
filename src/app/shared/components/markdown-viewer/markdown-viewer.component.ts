import { Component, input, effect, ElementRef, inject, signal } from '@angular/core';
import { marked } from 'marked';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  template: `
    <div class="markdown-content prose prose-invert max-w-none" [innerHTML]="renderedHtml()"></div>
  `,
  styles: [`
    :host ::ng-deep .markdown-content {
      color: #e2e8f0;
      line-height: 1.75;
      font-size: 1rem;
    }

    :host ::ng-deep .markdown-content h1 {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin-top: 2rem;
      margin-bottom: 1rem;
      letter-spacing: -0.025em;
      border-bottom: 1px solid #334155;
      padding-bottom: 0.5rem;
    }

    :host ::ng-deep .markdown-content h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
    }

    :host ::ng-deep .markdown-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #cbd5e1;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    :host ::ng-deep .markdown-content p {
      margin-bottom: 1.25rem;
      color: #cbd5e1;
    }

    :host ::ng-deep .markdown-content ul,
    :host ::ng-deep .markdown-content ol {
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
    }

    :host ::ng-deep .markdown-content li {
      margin-bottom: 0.5rem;
      color: #cbd5e1;
    }

    :host ::ng-deep .markdown-content ul {
      list-style-type: disc;
    }

    :host ::ng-deep .markdown-content ol {
      list-style-type: decimal;
    }

    :host ::ng-deep .markdown-content blockquote {
      border-left: 4px solid #6366f1;
      background: rgba(99, 102, 241, 0.08);
      padding: 0.75rem 1.25rem;
      margin: 1.5rem 0;
      border-radius: 0 0.5rem 0.5rem 0;
      color: #e0e7ff;
      font-style: italic;
    }

    :host ::ng-deep .markdown-content code:not(pre code) {
      background: #1e293b;
      color: #38bdf8;
      padding: 0.2rem 0.4rem;
      border-radius: 0.375rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875em;
      border: 1px solid #334155;
    }

    :host ::ng-deep .markdown-content pre {
      position: relative;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.25rem;
      overflow-x: auto;
      margin: 1.5rem 0;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
    }

    :host ::ng-deep .markdown-content pre code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      color: #e2e8f0;
      background: transparent;
      padding: 0;
      border: none;
    }

    :host ::ng-deep .markdown-content .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #1e293b;
      border: 1px solid #475569;
      color: #cbd5e1;
      padding: 0.25rem 0.6rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    :host ::ng-deep .markdown-content .copy-btn:hover {
      background: #334155;
      color: #ffffff;
      border-color: #6366f1;
    }
  `],
})
export class MarkdownViewerComponent {
  readonly content = input.required<string>();
  readonly renderedHtml = signal<string>('');

  private readonly el = inject(ElementRef);
  private readonly toast = inject(ToastService);

  constructor() {
    effect(() => {
      const raw = this.content() || '';
      const html = marked.parse(raw) as string;
      this.renderedHtml.set(html);

      // Add copy buttons to code blocks
      setTimeout(() => this.attachCopyButtons(), 50);
    });
  }

  private attachCopyButtons(): void {
    const preBlocks = (this.el.nativeElement as HTMLElement).querySelectorAll('pre');
    preBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.innerText = 'Copier';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          btn.innerText = 'Copié !';
          btn.style.borderColor = '#10b981';
          btn.style.color = '#34d399';
          setTimeout(() => {
            btn.innerText = 'Copier';
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }
}
