import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    
    TypeOrmModule.forRoot({
      type:'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      //Este ultimo es para los cambios en las entidades se reflejen en las tablas
      //No es comum que se use produccion
      synchronize:true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
      }),
      
    ProductsModule,
    
    CommonModule,
    
    SeedModule,
    
    FilesModule,
    
    AuthModule
  ],
})
export class AppModule {}


      //synchronize:true, es para sincronizar los cambios con la base de datos
      //no se usa en produccion