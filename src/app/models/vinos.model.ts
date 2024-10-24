import { User } from "./user.model";

export interface Vinos{
    _id?: string;  // Propiedad opcional _id para el ID de la experiencia
    owner: User,
    name: string,
    price: number,
    color: string,
    brand: string,
    grapetype: string,
    habilitado: boolean;
}