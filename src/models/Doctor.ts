import { Person } from "./Person";
import { Specialty } from "./Specialty";

export interface Doctor extends Person {

  crm: string;
  specialtyId: number;
  specialty?: Specialty;
 
}