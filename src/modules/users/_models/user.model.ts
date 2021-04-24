import { ChatModel } from 'src/modules/chats/models/chat.model'
import { ParticipantModel } from 'src/modules/chats/models/participant.model'
import Chat from 'twilio/lib/rest/Chat'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserModel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        nullable: false,
        unique: true,
    })
    phoneNumber: string

    @Column({
        nullable: false,
        unique: true,
    })
    username: string

    @Column({
        nullable: false,
    })
    password: string

    @Column({
        nullable: false,
    })
    fullName: string

    @Column({
        nullable: false,
    })
    photoResourceId: string


    @ManyToMany((type) => ParticipantModel, (participant) => participant.user)
    pariticipants: Chat[]

    constructor(data: Partial<UserModel>) {
        Object.assign(this, data)
    }
}
