export interface Publisher {
  publish: (eventName: string, event: unknown) => Promise<void>;
}

export const Publisher = Symbol('Publisher');
