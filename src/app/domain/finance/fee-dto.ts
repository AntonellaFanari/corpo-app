import { MemberPromotion } from "./member-promotion";

export class FeeDto {
  userId: number;
  memberId: number;
  credits: number;
  creditId: number;
  from: string;
  to: string;
  planName: string;
  promotionId: number;
  totalPromotion: number;
  total: number;
  pay: number;
  expiration: number;
  initialCredit: number;
  creditConsumption: number;
  negative: number;
  transaction: TransactionType;
  balance: number;
  membersPromotion: MemberPromotion[] = [];
}

export enum TransactionType {
  sale = 1,
  fee = 2
}
