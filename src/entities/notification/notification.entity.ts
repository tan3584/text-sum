import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { NotificationInstance } from '../notification-instance/notification-instance.entity';
import { SOURCE } from './enums/source.enum';

@Entity()
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ nullable: true })
  titleEN: string;

  @Column({ nullable: true })
  bodyEN: string;

  @Column({
    default: SOURCE.SYSTEM,
    enum: SOURCE,
  })
  source: SOURCE;

  @OneToMany(
    () => NotificationInstance,
    instance => instance.notification,
  )
  instances: NotificationInstance[];
}
