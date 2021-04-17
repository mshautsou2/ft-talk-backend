import { ChatModel } from 'src/modules/chats/models/chat.model'
import { UserModel } from 'src/modules/users/_models/user.model'

import {
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class ParticipantModel {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne((type) => ChatModel)
    @JoinColumn()
    chat: ChatModel

    @OneToOne((type) => UserModel)
    @JoinColumn()
    user: UserModel

    constructor(data: Partial<ParticipantModel>) {
        Object.assign(this, data)
    }
}
