import { Component, OnInit, Renderer2 } from '@angular/core';
import Squire from 'squire-rte';

@Component({
  selector: 'app-editor',
  // template: ` <div id="editor" contenteditable="true"></div> `,
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit {
  squire: any;
  state: any = {
    bold: false,
    italic: false,
    underline: false,
  };
  removeActions: any = {
    bold: 'removeBold',
    italic: 'removeItalic',
    underline: 'removeUnderline',
  };
  pixcel: string = '12px';
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const purifyScript = this.renderer.createElement('script');
    purifyScript.src = 'assets/purify.min.js';
    purifyScript.type = 'text/javascript';
    this.renderer.appendChild(document.body, purifyScript);

    purifyScript.onload = () => {
      this.initSquireEditor();
    };
  }

  initSquireEditor() {
    const appDiv = document.getElementById('app');
    if (appDiv) {
      this.squire = new Squire(appDiv, {
        blockTag: 'p',
        blockAttributes: { class: 'paragraph' },
        tagAttributes: {
          ul: { class: 'UL' },
          ol: { class: 'OL' },
          li: { class: 'listItem' },
          pre: {
            style:
              'border-radius:3px;border:1px solid #ccc;padding:7px 10px;background:#f6f6f6;font-family:menlo,consolas,monospace;font-size:90%;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;',
          },
        },
      });
      this.squire.setFontSize(this.pixcel);
      this.squire.addEventListener('mouseup', () => this.handleFontEvent());
      this.squire.addEventListener('touchend', this.handleFontEvent);
    } else {
      console.error('App element not found');
    }
  }

  activate(e: any, action: any): void {
    e.classList.add('active');
    this.squire[action]();
  }

  disable(e: any, action: any): void {
    e.classList.remove('active');
    this.squire[this.removeActions[action]]();
  }

  changeActive(e: any): void {
    const action = e.currentTarget.id;
    if (action in this.removeActions) {
      this.state[action] = !this.state[action];
      if (this.state[action]) {
        this.activate(e.currentTarget, action);
      } else {
        this.disable(e.currentTarget, action);
      }
    } else {
      this.squire[action]();
    }
  }

  selectPixcel(e: string): void {
    this.pixcel = e;
    this.squire.setFontSize(e);
  }

  handleFontEvent(): void {
    const getFontInfo = this.squire.getFontInfo();
    const hasBold = this.squire.hasFormat('b');
    const hasItalic = this.squire.hasFormat('i');

    const boldDiv = document.getElementById('bold');
    const italicDiv = document.getElementById('italic');
    if (hasBold) {
      this.activate(boldDiv, 'bold');
    } else {
      this.disable(boldDiv, 'bold');
    }

    if (hasItalic) {
      this.activate(italicDiv, 'italic');
    } else {
      this.disable(italicDiv, 'italic');
    }
    const sel = this.squire.getSelection();
    this.pixcel = getFontInfo.fontSize ?? '12px';
  }
}
