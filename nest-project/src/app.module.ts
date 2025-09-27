import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import cookieSession from 'cookie-session';
import * as path from 'path';

// Resolve absolute path to root ormconfig.js
const {dbConfig} = require(path.resolve(__dirname, '..', '..', 'ormconfig.js'));

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [process.env.COOKIE_KEY || 'default_key'],
        }),
      )
      .forRoutes('*');
  }
}
