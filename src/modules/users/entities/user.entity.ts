import { UserType } from "src/common/user-type-.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity( { name: 'user'} )
export class Users {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column( { nullable: false, length: 50 })
    firstName: string;

    @Column( { nullable: false, length: 50 } )
    lastName: string;

    @Column( { nullable: false, unique: true, length: 254 } )
    email: string;

    @Column( { nullable: false } )
    password: string;

    @Column( { nullable: false, type: 'enum', enum: UserType } )
    userType: UserType;

    @Column( { default: true } )
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column( { nullable: true } )
    updatedBy: string;
}