import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: false,
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  @Input() loadingText: string = 'Cargando';
  @Input() showText: boolean = true;
  @Input() isOverlay: boolean = false;
}
