import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card-data.component.html',
  styleUrls: ['./stat-card-data.component.css']
})
export class StatCardDataComponent {

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  value!: string | number;

  @Input()
  description?: string;

  @Input()
  iconClass = 'lucide-calendar';

}