import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma.module';

import { QuizzesModule } from './quizzes/quizzes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    QuizzesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
