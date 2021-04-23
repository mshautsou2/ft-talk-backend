import { ChatModel } from 'src/modules/chats/models/chat.model'
import { UserModel } from 'src/modules/users/_models/user.model'
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class MessageModel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne((type) => UserModel)
    @JoinColumn()
    author: UserModel

    @ManyToOne((type) => ChatModel)
    @JoinColumn()
    chat: ChatModel

    @Column({ nullable: true })
    content: string

    @Column({
        default: new Date(),
    })
    timestamp: Date

    @Column()
    resourceId: string

    // @Column({
    //     nullable: false,
    //     default: false,
    // })
    // read: boolean

    constructor(data: Partial<MessageModel>) {
        Object.assign(this, data)
    }
}
