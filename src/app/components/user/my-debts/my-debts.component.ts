import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BalanceToPay } from 'src/app/domain/finance/balance-to-pay';
import { Fee } from 'src/app/domain/finance/fee';
import { Sale } from 'src/app/domain/finance/sale';
import { SaleDetail } from 'src/app/domain/finance/sale-detail';
import { MemberView } from 'src/app/domain/member/member-view';
import { BalanceService } from 'src/app/services/balance.service';
import { FeeService } from 'src/app/services/fee.service';
import { SaleService } from 'src/app/services/sale.service';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-my-debts',
  templateUrl: './my-debts.component.html',
  styleUrls: ['./my-debts.component.scss']
})
export class MyDebtsComponent implements OnInit {
  idMember: number;
  balances: BalanceToPay[] = [];
  sale: Sale;
  detailsSale: SaleDetail[] = [];
  member: MemberView;
  status: number;
  fee: Fee;
  feeDetail: Fee[] = [];
  displaySale: boolean;
  displayFee: boolean;
  total: number;
  requesting: boolean;

  constructor(private balanceService: BalanceService,
    private saleService: SaleService,
    private userService: UserService,
    private feeService: FeeService,
    private accountService: AccountService,
    public modalController: ModalController) {
    this.idMember = this.accountService.getLoggedUser().id;
  }

  ngOnInit() {
    this.requesting = true;
    this.balanceService.getAllByIdMember(this.idMember).subscribe(
      result => {
        this.requesting = false;
        this.balances = result;
        this.total = result.reduce((x, i) => x + (i.balance - i.pay), 0);
      },
      error => {
        this.requesting = false;
        console.error(error);
      }
    )
  }


  close() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  modalClickSale() {
    this.displaySale = true;
    this.displayFee = false;
  }

  modalClickFee() {
    this.displaySale = false;
    this.displayFee = true;
  }

  getTransaction(balance) {
    if (balance.transaction == 1) {
      this.getSale(balance.transactionId);
      this.modalClickSale();
    } else {
      this.getFee(balance.transactionId);
      this.modalClickFee();
    }
  }

  getSale(id) {
    this.saleService.getSaleById(id).subscribe(
      result => {
        this.sale = result.result;
        this.getDetailsSale(id);
        this.status = this.sale.status;
      },
      error => console.error(error)
    );
  }

  getDetailsSale(id) {
    this.saleService.getSaleDetail(id).subscribe(
      result => {
        console.log("detalle: ", result);
        document.getElementById("trigger-button").click();
        this.detailsSale = result;
      },
      error => console.error(error)
    );
  }

  getFee(id) {
    this.feeService.getById(id).subscribe(
      result => {
        console.log("fee: ", result.result)
        document.getElementById("trigger-button").click();
        this.fee = result.result;
        this.feeDetail = [this.fee];
      },
      error => console.error(error)
    )
  }
}
