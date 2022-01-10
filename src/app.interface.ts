export interface ErrorResponse {
  statusCode: number;
  message: string;
}

export interface SearchPayload {
  term: string;
}

export interface SearchResponse {
  term: string;
  definitions: Definition[];
}

export interface Definition {
  number?: string;
  type?: string;
  description: string;
}
