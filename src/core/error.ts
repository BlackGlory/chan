export class Forbidden extends Error {
  name = this.constructor.name
  message = 'Forbidden'
}

export class Unauthorized extends Error {
  name = this.constructor.name
  message = 'Unauthorized'
}
