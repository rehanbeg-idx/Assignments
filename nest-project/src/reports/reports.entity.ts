import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Users } from 'src/users/users.entity';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @ManyToOne(() => Users, (user) => user.reports)
  user: Users;
}
