import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ErrorResponse } from './app.interface';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  public async search(term: string): Promise<ErrorResponse> {
    const cache: ErrorResponse = await this.cacheManager.get(`search/${term}`);
    if (cache) return cache;
    const resp: ErrorResponse = {
      message: 'TODO',
      statusCode: HttpStatus.NOT_IMPLEMENTED,
    };
    await this.cacheManager.set(`search/${term}`, resp);
    return resp;
  }
}
