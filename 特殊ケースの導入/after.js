class Site {
  get customer() {
    // クライアントで行なっていた条件分岐を中に隠蔽
　  return (this._customer === "unknown") ? new UnKnownCustomer() : this._customer;
  }
}

class Customer {
  get name() {}
  get billingPlan() {}
  set billingPlan(arg) {}
  get paymentHistory() {}

  get isUnknown() { return false; }
}

class UnKnownCustomer {
  get name() {return "occupant";}
  get billingPlan() {return registry.billingPlans.basic;}
  set billingPlan(arg) {/* 何もしない*/}

  // 特殊ケース用オブジェクトは値オブジェクトなので、常に変更不可にすべき
  get paymentHistory() {return new NullPaymentHistory();}

  get isUnknown() { return true; }
}

class NullPaymentHistory {
  get weeksDeliquantInLastYear() {return 0;}
}

function isUnknown(arg) {
  // ...
}

// client 1
const aCustomer = site.customer;
// ...
let customerName = aCustomer.name;

// client2
const plan = aCustomer.billingPlan;

// client3
const weeksDeliquant = aCustomer.paymentHistory.weeksDeliquantInLastYear;
