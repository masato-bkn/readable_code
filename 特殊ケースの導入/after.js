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
  get billingPlan() {}
  set billingPlan(arg) {}
  get paymentHistory() {}

  get isUnknown() { return false; }
}

function isUnknown(arg) {
  // ...
}

// client 1
const aCustomer = site.customer;
// ...
let customerName = aCustomermer.name;

// client2
const plan = (isUnknown(customerName)) ?
    registry.billingPlan.basic
    : aCustomer.billingPlan;
