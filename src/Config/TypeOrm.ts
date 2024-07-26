/* eslint-disable prettier/prettier */
import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: 'env.development' });
const config = {
    
  ssl: {
    rejectUnauthorized: false, // Esto es importante para conexiones SSL que no requieran verificación estricta del certificado
  },
    
    type: 'postgres',
    // database: 'proyecto_5qko',
    database: 'railway',
    // port: 5432,
    port: 55355,
    // username: 'root',
    username: 'postgres',
    // password: 'GzInv8S6vPS4VhSAwBIyBmzstt72oVWV',
    password: 'HsUrbNnLAuFQscLHXvRbAmljNJjFMfVa',
    // host: `dpg-cpm8pmaj1k6c73a491d0-a.oregon-postgres.render.com`,
    host: `roundhouse.proxy.rlwy.net`,
    
    Cloud_Name: 'ddsxa70kt',
    Cloud_Api_Key: 441433898633635,
    Cloud_Api_Secret: 'kBhhfb2EXrPPs56kkzS64J4fCfg',

    JWT_SECRET: 'esta es mi clave',
    
    
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    migrations: ['dist/migrations/*{.ts,.js}'],
    syncrhonize: true,
    logging: true,
    dropSchema: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);
