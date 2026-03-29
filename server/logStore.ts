// server/logStore.ts

export const logStore: Record<
  string,
  { logs: string[]; status: string }
> = {};