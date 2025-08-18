import * as path from 'path';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions.js";

export default (): PostgresConnectionOptions => {
    return {
        type: "postgres",
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT ?? '5432'),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
        synchronize: true,
    };
}
