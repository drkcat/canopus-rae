import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ErrorResponse, SearchResponse } from './app.interface';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class AppService {
  private readonly logger = new Logger('AppService');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private httpService: HttpService,
  ) {}

  public async search(term: string): Promise<SearchResponse | ErrorResponse> {
    const cache: ErrorResponse = await this.cacheManager.get(`search/${term}`);
    if (cache) return cache;

    try {
      const url = `https://dle.rae.es/srv/search?w=${term}`;
      const response = await lastValueFrom(this.httpService.get(url));
      const html = response.data;
      const $ = cheerio.load(html);
      const resp: SearchResponse = {
        term,
        etymology: '',
        meanings: [],
        idioms: [],
        expressions: [],
      };
      const definitions = $('#resultados article').first();
      const lines = definitions.find('p');
      if (lines.length >= 0) {
        lines.each((index) => {
          const line = lines.eq(index);
          let idiom;
          if (line.hasClass('n2')) {
            resp.etymology = line.text();
          } else if (line.hasClass('j') || line.hasClass('j2')) {
            const number = line.find('span').first().text().trim();
            const type = line.find('abbr').first().text().trim();
            const words = line.find('mark');
            let description = '';
            words.each((index) => {
              description += words.eq(index).text() + ' ';
            });
            description = description.trim();
            resp.meanings.push({ number, type, definition: description });
          } else if (line.hasClass('k5')) {
            resp.idioms.push({ expression: line.text() });
            idiom = true;
          } else if (line.hasClass('k6')) {
            resp.expressions.push({ expression: line.text() });
            idiom = false;
          } else if (line.hasClass('m')) {
            const number = line.find('span').first().text().trim();
            const type = line.find('abbr').first().text().trim();
            const words = line.find('mark');
            let description = '';
            words.each((index) => {
              description += words.eq(index).text() + ' ';
            });
            description = description.trim();
            if (idiom) {
              resp.idioms[resp.idioms.length - 1] = {
                ...resp.idioms[resp.idioms.length - 1],
                number,
                type,
                definition: description,
              };
            } else {
              resp.expressions[resp.expressions.length - 1] = {
                ...resp.expressions[resp.expressions.length - 1],
                number,
                type,
                definition: description,
              };
            }
          }
        });
      }
      await this.cacheManager.set(`search/${term}`, resp);
      return resp;
    } catch (exception) {
      throw new InternalServerErrorException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: exception.message,
        },
        exception.message,
      );
    }
  }
}
