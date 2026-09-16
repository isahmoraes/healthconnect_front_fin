import { Doctor } from "./Doctor";
import { Patient } from "./Patient";
import { Specialty } from "./Specialty";

export interface Appointment {    
  id: number;
  patient_id: number;
  patient?: Patient;
  doctor_id: number;
  doctor?: Doctor;
  specialty_id: number;
  specialty?: Specialty;
  appointment_date: string;
  time: string;
  status: string;
  is_recurrence: boolean;
  obs?: string;
}