import { User } from "./user.model";

export interface Experiencia {
  _id?: string;  // Propiedad opcional _id para el ID de la experiencia
  owner: User; // ID del propietario (usuario)
  participants: User[]; // Array de IDs de participantes
  description: string; // Descripción de la experiencia
  habilitado: boolean;
}

  