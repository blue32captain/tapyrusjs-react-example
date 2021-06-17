import * as SQLite from 'expo-sqlite';

export default class Token {
  colorId: string;
  tokenType: number;
  name: string;
  ticker: string;

  constructor({ colorId, tokenType, name, ticker }) {
    this.colorId = colorId;
    this.tokenType = tokenType;
    this.name = name;
    this.ticker = ticker;
  }
}

export class TokenStore {
  database: SQLite.WebSQLDatabase;
  
  constructor() {
    this.database = SQLite.openDatabase('wallet');
    this.database.transaction((db: any) => {
      db.executeSql(
        'CREATE TABLE IF NOT EXISTS tokens(colorId TEXT NOT NULL, tokenType INTEGER NOT NULL, name TEXT NOT NULL, ticker TEXT NOT NULL)',
      );
      db.executeSql(
        'CREATE UNIQUE INDEX IF NOT EXISTS idxColorId ON utxos(colorId)',
      );
      db.executeSql(
        'CREATE UNIQUE INDEX IF NOT EXISTS idxName ON utxos(name)',
      );
      db.executeSql(
        'CREATE UNIQUE INDEX IF NOT EXISTS idxTicker ON utxos(ticker)',
      );
    });
  }

  async add({ colorId, tokenType, name, ticker }): Promise<void> {
    this.database.transaction((db: any) => {
      db.executeSql(
        'INSERT INTO tokens(colorId, tokenType, name, ticker) values (?, ?, ?, ?)',
        [
          colorId,
          tokenType,
          name,
          ticker
        ],
      );
    });
  }

  async tokens(): Promise<Token[]> {
    return new Promise(
      (resolve, reject): void => {
        this.database.readTransaction((db: any) => {
          db.executeSql(
            'SELECT * FROM tokens',[],
            (_db: any, rs: any) => {
              const tokens: Token[] = [];
              for (let i = 0; i < rs.rows.length; i++) {
                tokens.push(new Token(rs.rows.item(i)));
              }
              resolve(tokens);
            },
            (_db: any, error: any) => {
              console.error(_db, error);
              reject(error);
            },
          );
        });
      },
    );
  }

  async clear(): Promise<void> {
    new Promise(
      (resolve, reject): void => {
        this.database.transaction((db: any) => {
          db.executeSql(
            'DELETE FROM tokens', [],
            (_db: any, _rs: any) => {
              resolve(void 0);
            },
            (_db: any, error: any) => {
              reject(error);
            },
          );
        });
      },
    );
  }
}