import { ChatModel } from 'src/modules/chats/models/chat.model'
import { UserModel } from 'src/modules/users/_models/user.model'

import {
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ParticipantModel {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne((type) => ChatModel)
    @JoinColumn()
    chat: ChatModel

    @ManyToOne((type) => UserModel)
    @JoinColumn()
    user: UserModel

    constructor(data: Partial<ParticipantModel>) {
        Object.assign(this, data)
    }
}
