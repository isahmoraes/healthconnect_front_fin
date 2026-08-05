import { Person } from "./Person";

export interface Patient extends Person {
    cpf: string;
    observations?: string;
    birthDate: string;
}