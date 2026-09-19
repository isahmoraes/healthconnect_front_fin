import { Doctor } from "./Doctor";

export interface DoctorSchedule {
  id: number;
  doctor_id: number;
  doctor?: Doctor;
  day_of_week: string;
  start_time: string;
  end_time: string;
}