import { Sector } from "./sector";

export interface Repisa{  
    id_repisa?:number,
    codigo: string, 
    capacidad: number,
    sector: Sector
}