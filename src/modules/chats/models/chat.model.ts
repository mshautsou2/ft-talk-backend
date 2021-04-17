import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { ParticipantModel } from './participant.model'

@Entity()
export class ChatModel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({
        default: true,
    })
    isPrivate: boolean

    @OneToMany((type) => ParticipantModel, (participant) => participant.chat)
    participants: ParticipantModel[]

    constructor(raw: Partial<ChatModel>) {
        Object.assign(this, raw)
    }
}
