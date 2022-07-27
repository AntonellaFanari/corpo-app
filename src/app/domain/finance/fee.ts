import { MemberPromotion } from './member-promotion';
import { Promotion } from './promotion';

export class Fee {
    id: number;
    date: string;
    userId: number;
    memberId: number;
    credits: number;
    from: string;
    to: string;
    planName: string;
    promotion: Promotion;
    promotionId: number;
    creditId: number;
    totalPromotion: number;
    total: number;
    pay: number
}
