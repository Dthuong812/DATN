import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
class RedisClient {
    private redisClient: Redis;

    constructor(private configService: ConfigService) {
        const redisHost = this.configService.get<string>('REDIS_HOST');
        const redisPort = this.configService.get<number>('REDIS_PORT');

        const config = {
            socket: {
                host: redisHost, 
                port: redisPort,        
                reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
            },
        };
        this.redisClient=new Redis({
            host:redisHost,
            port:redisPort
        });
    }
    public async getListRange(key: string, start: number, stop: number): Promise<string[]> {
        try {
            const result = await this.redisClient.lrange(key, start, stop);
            return result;
        } catch (err) {
            console.error('Error getting list range:', err);
            return [];
        }
    }
    public async remove(key: string): Promise<boolean> {
        try {
            const result = await this.redisClient.del(key);
            return result > 0;
        } catch (err) {
            console.error('Error removing key:', err);
            return false;
        }
    }

    public async removeMultiple(keys: string[]): Promise<void> {
        try {
            await this.redisClient.del(...keys);
        } catch (err) {
            console.error('Error removing multiple keys:', err);
        }
    }
    public async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redisClient.exists(key);
            return result > 0;
        } catch (err) {
            console.error('Error checking key existence:', err);
            return false;
        }
    }
    public async stop(): Promise<void> {
        await this.redisClient.quit();
    }
    public async add<T>(key: string, value: T, expiresAt: number): Promise<boolean> {
        try {
            const stringContent = JSON.stringify(value);
            await this.redisClient.setex(key, expiresAt, stringContent);
            return true;
        } catch (err) {
            console.error('Error adding value:', err);
            return false;
        }
    }
    public async update<T>(key: string, value: T): Promise<boolean> {
        try {
            const stringContent = JSON.stringify(value);
            await this.redisClient.set(key, stringContent);
            return true;
        } catch (err) {
            console.error('Error updating value:', err);
            return false;
        }
    }
    public async get<T>(key: string): Promise<T | null> {
        try {
            const result = await this.redisClient.get(key);
            if (result) {
                return JSON.parse(result) as T;
            }
            return null;
        } catch (err) {
            console.error('Error getting value:', err);
            return null;
        }
    }
    public async getList<T>(pattern: string): Promise<T[]> {
        try {
            const keys = await this.redisClient.keys(pattern);
            const values: T[] = [];
            for (const key of keys) {
                const value = await this.redisClient.get(key);
                if (value) {
                    values.push(JSON.parse(value) as T);
                }
            }
            return values;
        } catch (err) {
            console.error('Error getting list of values:', err);
            return [];
        }
    }
    public async getKeysStartingWith<T>(prefix: string): Promise<T[]> {
        try {
            const keys = await this.redisClient.keys(`${prefix}*`);
            const values: T[] = [];
            for (const key of keys) {
                const value = await this.redisClient.get(key);
                if (value) {
                    values.push(JSON.parse(value) as T);
                }
            }
            return values;
        } catch (err) {
            console.error('Error getting keys starting with prefix:', err);
            return [];
        }
    }
    public async getTtl(key: string): Promise<number> {
        try {
            const ttl = await this.redisClient.ttl(key); 
            return ttl;
        } catch (err) {
            console.error('Error getting TTL:', err);
            return -1; 
        }
    }
public async handleLoginAttempts(attemptsKey: string, now: number): Promise<void> {
    try {
        const multi = this.redisClient.multi();  
        multi.lpush(attemptsKey, now.toString());
        multi.ltrim(attemptsKey, 0, 4);
        multi.expire(attemptsKey, 5 * 60); 
        await multi.exec();  

    } catch (err) {
        console.error('Error handling login attempts:', err);
    }
}

}

export default RedisClient;
