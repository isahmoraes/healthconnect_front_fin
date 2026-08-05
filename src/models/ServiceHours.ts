import { Doctor } from "./Doctor";
import { Specialty } from "./Specialty";

export interface ServiceHours {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  specialtyId: string;
  specialty?: Specialty;
  dayOfWeek: number; 
  weekDay: string;
  startTime: string;
  endTime: string;
}