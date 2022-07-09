export class BalanceToPay {
  id: number;
  memberId: number;
  transaction: TransactionType;
  transactionId: number;
  balance: number;
}

export enum TransactionType {
  sale = 1,
  fee = 2
}
