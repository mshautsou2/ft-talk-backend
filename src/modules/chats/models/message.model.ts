import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @OneToOne((type) => UserModel)
  // @JoinColumn()
  // author: UserModel;

  @Column()
  fileLink: string;

  @Column({
    nullable: false,
    default: false
  })
  read: boolean;
}
