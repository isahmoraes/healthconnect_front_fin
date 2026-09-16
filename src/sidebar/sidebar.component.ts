import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  navigationItems: NavigationItem[] = [
    {
      label: 'Painel Principal',
      icon: 'lucide-layout-dashboard',
      route: '/'
    },
    {
      label: 'Agendamentos',
      icon: 'lucide-calendar',
      route: '/appointments'
    },
    {
      label: 'Médicos',
      icon: 'lucide-user-check',
      route: '/doctors'
    },
    {
      label: 'Pacientes',
      icon: 'lucide-users',
      route: '/patients'
    },
    {
      label: 'Especialidades',
      icon: 'lucide-stethoscope',
      route: '/specialties'
    },
    {
      label: 'Horários',
      icon: 'lucide-clock',
      route: '/schedules'
    },
    {
      label: 'Agenda ',
      icon: 'lucide-calendar-days',
      route: '/agenda'
    }
  ];

}