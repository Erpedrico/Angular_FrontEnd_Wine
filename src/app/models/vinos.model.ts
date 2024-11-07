export interface Vinos{
    _id?: string;  // Propiedad opcional _id para el ID de la experiencia
    owner: string,
    name: string,
    price: number | null,
    color: string,
    brand: string,
    grapetype: string,
    habilitado: boolean;
}