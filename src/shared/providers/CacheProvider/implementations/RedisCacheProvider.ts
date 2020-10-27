import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@shared/providers/CacheProvider/CacheProviderConfig';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    // armazenar a informação dentro do cache(Key, Value)...convertendo para json
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    // Pegar a informação(Key)
    const data = await this.client.get(key);

    // Se não encontrar nada nulo
    if (!data) {
      return null;
    }

    // converter de json para o tipo que informamos no <>
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    // Invalidar é apagar
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // achar todas as key com esse prefixo
    const keys = await this.client.keys(`${prefix}:*`);
    // executar múltiplas operações ao mesmo tempo + performance
    const pipeline = this.client.pipeline();
    // apagar a chave
    keys.forEach(key => {
      pipeline.del(key);
    });
    // Todos os deletes ao mesmo tempo com o pipeline
    await pipeline.exec();
  }
}
