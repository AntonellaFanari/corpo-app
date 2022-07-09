export class DomainResponse<T> {
    success: boolean;
    message: string;
    errors: string[];
    result: T
  }