
import { ChatModel } from 'src/modules/chats/models/chat.model';
import Chat from 'twilio/lib/rest/Chat';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserModel {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false,
        unique: true
    })
    phoneNumber: string;

    @Column({
        nullable: false,
        unique: true
    })
    username: string;

    @Column({
        nullable: false
    })
    password: string;


    @Column({
        nullable: false
    })
    fullName: string;

    // @Column({
    //     nullable: false,
    //     default: true,
    // })
    // verified: boolean = false;

    // @Column({
    //     default: new Date(),
    // })
    // lastVerificationDate: Date;

    // @ManyToMany(type => ChatModel, chat => chat.participants)
    // chats: Chat[]
    constructor(data: Partial<UserModel>) {
        Object.assign(this, data)
    }
}