import { Doctor } from "./Doctor";
import { Specialty } from "./Specialty";

export interface ServiceHours {
  id: number;
  doctorId: number;
  doctor?: Doctor;
  specialtyId: number;
  specialty?: Specialty;
  availabilityType: 'ATENDIMENTO' | 'AUSENCIA' | 'FERIAS' | 'VIAGEM' | 'INTERVALO' | 'ALMOCO';
  scheduleMode: 'WEEKLY' | 'SINGLE_DAY' | 'SPECIFIC';
  workingDays?: 'MONDAY_FRIDAY' | 'MONDAY_SATURDAY';
  date?: string;
  dayOfWeek: string;
  weekDay: string;
  startTime: string;
  endTime: string;
}