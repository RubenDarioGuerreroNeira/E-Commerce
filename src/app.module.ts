/* eslint-disable prettier/prettier */
import { Module, MiddlewareConsumer, NestModule, } from '@nestjs/common';
import { AuthModule } from './Auth/auth.module';
import { ProductsModule } from './Products/products.module';
import { UsersModule } from "./Users/users.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './Config/TypeOrm';
import { CategoriesModule } from './categories/categories.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './Orders/orders.module';
import { FileUploadModule } from './file_upload/file_upload.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtExceptionFilter } from './jwt-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import jwt from './jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],

    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm')
    }),
    CategoriesModule, AuthModule, ProductsModule, UsersModule, OrdersModule, FileUploadModule,
    JwtModule.register({
      global: true,
      secret: jwt.secret,
      signOptions: { expiresIn: jwt.expiresIn }
    })
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: JwtExceptionFilter,
    },
  ],

})
export class AppModule {

}
