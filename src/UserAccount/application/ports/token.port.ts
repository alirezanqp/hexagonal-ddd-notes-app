export interface Token {
  create: (payload: string, expiresIn?: string) => Promise<string>;
  verify: <T extends object = any>(token: string) => Promise<T>;
}

export const Token = Symbol('Token');