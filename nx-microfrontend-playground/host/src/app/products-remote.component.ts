import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-products-remote',
  standalone: true,
  template: `<div #reactHost></div>`,
})
export class ProductsRemoteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reactHost', { static: true })
  private hostEl!: ElementRef<HTMLElement>;

  private unmount?: () => void;

  async ngAfterViewInit(): Promise<void> {
    const { mount } = await import('products/Module');
    this.unmount = mount(this.hostEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.unmount?.();
  }
}
