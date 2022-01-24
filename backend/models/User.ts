export class User {
  private _name: string;
  private _phone: string;
  private _balance: number;
  private _token: string;

  public get name(): string {
    return this._name;
  }
  public get phone(): string {
    return this._phone;
  }
  public get balance(): number {
    return this._balance;
  }
  public get token(): string {
    return this._token;
  }

  constructor(name: string, phone: string, balance: number, token: string) {
    this._name = name;
    this._phone = phone;
    this._balance = balance;
    this._token = token;
  }
}
