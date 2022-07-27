export class BalanceToPay {
  id: number;
  date: string;
  memberId: number;
  transaction: TransactionType;
  transactionId: number;
  balance: number;
  pay: number;
}

export enum TransactionType {
  sale = 1,
  fee = 2
}
