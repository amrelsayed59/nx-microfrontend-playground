import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-orders-remote',
  standalone: true,
  template: `<div #vueHost></div>`,
})
export class OrdersRemoteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vueHost', { static: true })
  private hostEl!: ElementRef<HTMLElement>;

  private unmount?: () => void;

  async ngAfterViewInit(): Promise<void> {
    const { mount } = await import('orders/Module');
    this.unmount = mount(this.hostEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.unmount?.();
  }
}
