import { SaleDetail } from "./sale-detail";

export class Sale {
  id: number;
  date: string;
  userId: number;
  memberId: number;
  saleDetail: SaleDetail[];
  total: number;
  status: number;
  pay: number
}
