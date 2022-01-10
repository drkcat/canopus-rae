export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface SearchPayload {
  term: string;
}

export interface SearchResponse {
  term: string;
  definition: string;
  meanings: Meaning[];
  expressions: Expression[];
}

export interface Meaning {
  number: string;
  type: string;
  description: string;
}

export interface Expression {
  expression: string;
  number?: string;
  type?: string;
  description?: string;
}
