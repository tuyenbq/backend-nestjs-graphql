import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('credit_admin_system_users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Exclude()
  @IsNotEmpty({ message: 'Password can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
    transformer: {
      to() {
        return new Date();
      },
      from(value) {
        return value;
      },
    },
  })
  updatedAt: Date = new Date();

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
