export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface SearchPayload {
  term: string;
}

export interface SearchResponse {
  term: string;
  etymology: string;
  meanings: Meaning[];
  idioms: Idiom[];
  expressions: Idiom[];
}

export interface Meaning {
  number: string;
  type: string;
  definition: string;
}

export interface Idiom {
  expression: string;
  number?: string;
  type?: string;
  definition?: string;
}
