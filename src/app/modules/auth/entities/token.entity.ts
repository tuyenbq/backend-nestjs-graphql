import { IsNotEmpty, MaxLength } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('credit_admin_tokens')
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  tokenId: number;

  @IsNotEmpty({ message: 'Refresh token can not be null or empty' })
  @MaxLength(255, { message: 'The length must be less than 255 characters' })
  @Column({
    type: 'varchar',
    comment: 'The token to refresh token to access server',
    name: 'refresh_token',
  })
  refreshToken: string;

  @IsNotEmpty({ message: 'Expired at can not be null or empty' })
  @Column({
    type: 'datetime',
    comment: 'token expired time',
    name: 'expire_at',
  })
  expiredAt: Date = new Date();

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date = new Date();

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

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
