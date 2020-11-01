type Json =
| string
| number
| boolean
| null
| { [property: string]: Json }
| Json[]

interface ICore {
  isAdmin(password: string): boolean

  stats(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  MPMC: {
    enqueue(id: string, payload: unknown): Promise<void>
    dequeue(id: string): Promise<unknown>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    check(id: string): Promise<void>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>
  }

  JsonSchema: {
    isEnabled(): boolean
    validate(id: string, payload: string): Promise<void>
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: string): Promise<void>
    remove(id: string): Promise<void>
  }

  TBAC: {
    isEnabled(): boolean

    getAllIds(): Promise<string[]>
    getTokens(id: string): Promise<Array<{
      token: string
      write: boolean
      read: boolean
    }>>

    checkWritePermission(id: string, token?: string): Promise<void>
    setWriteToken(id: string, token: string): Promise<void>
    unsetWriteToken(id: string, token: string): Promise<void>

    checkReadPermission(id: string, token?: string): Promise<void>
    setReadToken(id: string, token: string): Promise<void>
    unsetReadToken(id: string, token: string): Promise<void>
  }

  Error: {
    Forbidden: new () => Error
    Unauthorized: new () => Error
  }
}
