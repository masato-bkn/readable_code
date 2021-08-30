class Site {
  get customer() {return this._customer;}
}


class Customer {
  get name() {}
  get billingPlan() {}
  set billingPlan(arg) {}
  get paymentHistory() {}

  get isUnknown() { return false; }
}

class UnCustomer {
  get name() {}
  get billingPlan() {}
  set billingPlan(arg) {}
  get paymentHistory() {}

  get isUnknown() { return false; }
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
