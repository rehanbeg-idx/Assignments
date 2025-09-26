import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';
import { Reports } from 'src/reports/reports.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Reports, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log(`User with id ${this.id} created`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User with id ${this.id} updated`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User with id ${this.id} deleted`);
  }
}
