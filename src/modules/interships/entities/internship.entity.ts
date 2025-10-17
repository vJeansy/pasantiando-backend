import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity( { name: 'intership'})
export class Intership {
    @PrimaryGeneratedColumn("uuid")
    id: string
}
