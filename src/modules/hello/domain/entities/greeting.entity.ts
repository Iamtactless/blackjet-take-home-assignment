export class Greeting {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly createdAt: Date,
  ) {}

  get isValid(): boolean {
    return this.message.length > 0;
  }
}
