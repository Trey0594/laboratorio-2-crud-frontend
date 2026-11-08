import { Component, input, output } from '@angular/core';
import { Meta } from '../../interfaces/api-response';

@Component({
  selector: 'app-pagination',
  styleUrl: './pagination.css',
  templateUrl: './pagination.html',
})
export class Pagination {
  readonly meta = input<Meta | undefined>();
  readonly pageChange = output<number>();

  goTo(page: number): void {
    this.pageChange.emit(page);
  }
}
