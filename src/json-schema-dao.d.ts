interface IJsonSchemaDAO {
  getAllNamespacesWithJsonSchema(): Promise<string[]>
  getJsonSchema(namespace: string): Promise<string | null>
  setJsonSchema(params: { namespace: string; schema: string }): Promise<void>
  removeJsonSchema(namespace: string): Promise<void>
}
