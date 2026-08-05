import { Doctor } from "./Doctor";
import { Patient } from "./Patient";
import { Specialty } from "./Specialty";

export interface Appointment {    
id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  doctor?: Doctor;
  specialtyId: string;
  specialty?: Specialty;
  dateTime: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observations?: string;
}