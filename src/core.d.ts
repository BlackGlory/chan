interface ICore {
  isAdmin(password: string): boolean

  stats(): {
    memoryUsage: NodeJS.MemoryUsage
    cpuUsage: NodeJS.CpuUsage
    resourceUsage: NodeJS.ResourceUsage
  }

  Chan: {
    enqueue(id: string, payload: unknown): Promise<void>
    dequeue(id: string): Promise<unknown>
  }

  JsonSchema: {
    isEnabled(): boolean
    validate(id: string, payload: string): Promise<void>
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(
      id: string
    , schema: {
        [key: string]: import('@blackglory/types').Json
      }
    ): Promise<void>
    remove(id: string): Promise<void>
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

  TBAC: {
    isEnabled(): boolean
    checkWritePermission(id: string, token?: string): Promise<void>
    checkReadPermission(id: string, token?: string): Promise<void>

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
      }>>

      setWriteToken(id: string, token: string): Promise<void>
      unsetWriteToken(id: string, token: string): Promise<void>

      setReadToken(id: string, token: string): Promise<void>
      unsetReadToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(id: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(id: string): Promise<void>

      setReadTokenRequired(id: string, val: boolean): Promise<void>
      unsetReadTokenRequired(id: string): Promise<void>
    }
  }

  Error: {
    Forbidden: new () => Error
    Unauthorized: new () => Error
  }
}
