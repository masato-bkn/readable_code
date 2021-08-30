class Site {
  get customer() {return this._customer;}
}

class Customer {
  get name() {}
  get billingPlan() {}
  set billingPlan(arg) {}
  get paymentHistory() {}
}

// client 1
const aCustomer = site.customer;
// ...
let customerName;
if (aCustomer === "unknown") customerName = "occupant";
else customerName = aCustomermer.name;

// client2
const plan = (aCustomer === "unknow") ?
      registry.billingPlan.basic
      : aCustomer.billingPlan;

// 特殊ケース判定後の共通処理が広範囲に及んでいるときは、特殊ケース用オブジェクトが有用
