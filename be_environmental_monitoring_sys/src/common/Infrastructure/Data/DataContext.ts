import { DataSource, Repository } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export class DataContext {
  private static instances: { [key: string]: DataSource } = {};
  private static entities: { [key: string]: any[] } = {};
  private constructor() {}
  public static async getInstance(
    DATABASE_URL: string,
    Entities: any,
  ): Promise<DataSource> {
    if (!this.entities[DATABASE_URL]) {
      this.entities[DATABASE_URL] = [];
    }
    if (Array.isArray(Entities)) {
      this.entities[DATABASE_URL] = [
        ...this.entities[DATABASE_URL],
        ...Entities,
      ];
    } else {
      this.entities[DATABASE_URL].push(Entities);
    }
    if (!this.instances[DATABASE_URL]) {
      this.instances[DATABASE_URL] = new DataSource({
        type: 'mysql',
        url: DATABASE_URL,
        logging: false,
        entities: this.entities[DATABASE_URL],
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        driver: require('mysql2'),
        extra:{
          connectionLimit:10,
          waitForConnections: true,
          queueLimit: 100
        }
      });

      try {
        await this.instances[DATABASE_URL].initialize();
        console.log(`Connect ${DATABASE_URL} Database success!`);
      } catch (err) {
        console.error(
          `Error during ${DATABASE_URL} DataSource initialization`,
          err,
        );
      }
    }
    return this.instances[DATABASE_URL];
  }
}
