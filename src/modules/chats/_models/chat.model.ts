import { UserModel } from "src/modules/users/_models/user.model";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({
    default: true
  })
  isPrivate: boolean;

  @ManyToMany((type) => UserModel, (user) => user.chats)
  @JoinTable()
  participants: UserModel[];

  constructor(raw: Partial<ChatModel>) {
    Object.assign(this, raw)
  }
}
