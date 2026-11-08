import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { User } from '../../interfaces/user';
import { initials } from '../../utils/pastel';

@Component({
  imports: [DatePipe],
  selector: 'app-user-list',
  styleUrl: './user-list.css',
  templateUrl: './user-list.html',
})
export class UserList {
  readonly users = input<User[]>([]);
  protected readonly initials = initials;
}
