# リーダブルコード
## 変数の抽出

- before
```
return order.quantity * order.itemPrice - 
  Math.max(0, order.quantity - 500) * order.itemPrice * 0.05 + 
  Math.min(order.quantity * order.itemPrice * 0.1, 100);
```

- after
```
const basePrice = order.quantity * order.itemPrice;
const quantityDiscount = Math.max(0, order.quantity - 500) * order.itemPrice * 0.05;
const shipping = Math.min(order.quantity * order.itemPrice * 0.1, 100);

return basePrice - quantityDiscount + shipping;
```
- クラスのコンテキストの中でも、basePrice、quantityDiscount、shippingをメソッドとして抽出ができる。

## 変数のカプセル化
- before
```
let defaultOwner = {firstName: "Martin", lastName: "Fowler"};
```

- after
```
let defaultOwnerData = {firstName: "Martin", lastName: "Fowler"};
export function defaultOwner() {return defaultOwnerData;}
export function setDefaultOwner(arg) {defaultOwnerData = arg;}
```
- 参照の利用と再代入を制御する
- 値のあらゆる変更を禁止する


```
export function defaultOwner() {return Object.assign({}, defaultOwnerData);}

```

## パラメータオブジェクトの導入
- before
```
function amountInvoiced(startDate, endDate) {}
```

- after
```
function amountInvoiced(aDateRange) {}
```
- パラメータオブジェクトとして、新たな構造体を作成する
- オブジェクトに新たな振る舞いを移設できるという利点

```
function readingsOutsideRange(station, range) {
  return station.readings.filter(r => !range.contains(r.temp));
}
```

```
class NumberRange
  contains(arg) {return (arg >= this.min && arg <= this.max);}
```

## 関数群の変換への集約
- before
```
function base(aReading) {...}
function taxableCharge(aReading) {...}
```

- after
```
function enrichReading(argReading) {
  const aReading = _.cloneDeep(argReading);
  aReading.baseCharge = base(argReading);
  aReading.taxableCharge = taxableCharge(argReading);
  return aReading;
}
```

- 元のデータが更新される場合は、クラスに集約した方がよさそうではある

## フェーズの分離
- before
```
const orderData = orderString.split(/\s+/)
const productPrice = priceList[orderData[0].split("-")[1]];
const orderPrice = parseInt(orderData[1]) * productPrise;
```

- after
```
const orderRecord = parseOrder(order);
const orderPrice = price(orderRecord, priceList);

function parseOrder(aString) {
    const values = aString.split(/\s+/);
    return ({
      productID = values[0].split("-")[1],
      quantity: parseInt(values[1]),
    });
}

function price(order, priceList) {
  return order * priceList[order.productID];
};
```

## コレクションのカプセル化
- before
```
class Person {
  get courses() {return this._courses;}
  set courses(aList) {this._course = course}
}
```

- after
```
class Person {
  get courses() {return _courses.slice();}
  addCourse(aCourse) { ... }
  removeCourse(aCourse) { ... }
}
```

- コレクションを管理する責任のあるクラスでは、常にコピーしたコレクションを返すようにして外から変更されないようにする
  - aPerson.courses.push(new Course(name, false));
  - Personクラスは変更をコントロールできない

## オブジェクトによるプリモティブの置き換え

- before
```
orders.filter(o => "high" === o.priority || "rush" === o.priority)
```

- after
```
orders.filter(o => o.priority.higherThan(new Priority("normal")))
```

- オブジェクトで数値や文字列を隠蔽することはできないか
- 数値や文字列を値オブジェクトとしてクラス化してしまう
- 振る舞いを書くことができる

## 問い合わせによる一時変数の置き換え
- before
```
get price() {
  var basePrice = this._quantity * this._item.price;
  var discountFactor = 0.98;
  if (basePrice > 1000) discountFactor -= 0.03;
  return basePrice * discountFactor;
}
```

- after
```
get basePrice() {
  return this._quantity * this._item.price;
}

get discountFactor() {
  var discountFactor = 0.98;
  if (basePrice > 1000) discountFactor -= 0.03;
  return basePrice * discountFactor
}

get price() {
  return this.basePrice * this.discountFactor
}
```
## クラスの抽出
- before
```
class Person {
  get officeAreaCode() { return this._officeAreaCode;}
  get officeNumber() { return this._officeNumber;}
}
```

- after
```
class Person {
  get officeAreaCode() { return this._telephoneNumber.areaCode;}
  get officeNumber() { return this._telephoneNumber.officeNumber;}
}

class TelephoneNumber {
  get areaCode() {return this,_areaCode;}
  get number() {return this,_number;}
}
```

## 委譲の隠蔽
- before
```
manager = aPerson.department.manager;
```

- after
```
manager = aPerson.manager;

class Person {
  get manager() {
    return this.department.manager;
  }
}
```
- 委譲先オブジェクトの変更がクライアントにまで波及することを防ぐ
- フィールドだけでなく委譲先のフィールド、メソッドもカプセル化の対象になる

## 関数呼び出しによるインライコードの置き換え
- before
```
let appliesToMass = false;
for(count of states) {
  if (s === "MA") appliesToMass = true;
}
```

- after
```
appliesToMass = status.includes("MA");
```

- 名前のついた関数はコードの仕組みではなく目的を説明できる

## ステートメントのスライド
- before
```
const pricingPlan = retrievePricingPlan();
const order = retreiveOrder();
let charge;
const chargePerUnit = pricingPlan.unit;
```

- after
```
const pricingPlan = retrievePricingPlan();
const chargePerUnit = pricingPlan.unit;
const order = retreiveOrder();
let charge;
```

## ループの分離
- before
```
let youngest = people[0] ? people[0].age : Infinity;
let totalSalary = 0;
for (const p of people) {
  if (p.age < youngest) yongest = p.age;
  totalSalary += p.salary;
}
return `youngestAge: $(yongest), totalSalary: ${totalSalary}`;
```
- after
```
function yongestAge(people) {
  let youngest = people[0] ? people[0].age : Infinity;
  for (const p of people) {
    if (p.age < youngest) yongest = p.age;
  }
  return yongest
}

function totalSalary(people) {
  if (p.age < youngest) yongest = p.age;
    totalSalary += p.salary;
  }
  return totalSalary
}

return `youngestAge: $(yongestAge(people)), totalSalary: ${totalSalary(people)}`;
```

- ループを分離することで、変更すべき処理だけを理解すればよくなる
- ループの分離はそれ自体が目的ではなく、次のリファクタを準備することにある。
  - 通常はそれぞれを独立した関数に抽出できないか調べる


## 問い合わせによる導出変数の置き換え
- 変更可能なデータの影響範囲はできる限り小さくする
- 簡単に計算できる変数は削除できないか考える

- before
```
class ProductionPlan {
  get production () { return this._production }
  applyAdjustment(anAjustment) {
    this._adjustments.push(anAjustment)
    this._production += anAdjustmnet.amount;
  }
}
```

- after
```
class ProductionPlan {
  get production () { return this.calculatedProduction }
  applyAdjustment(anAjustment) {
    this._adjustments.push(anAjustment)
  }
  get calculatedProduction() {
    return this._adjustments.reduce((sum, a) => sum + a.amount, 0);
  }
}
```

## 参照から値への変更
- before
```
class Product {
  applyDiscount(arg) { this._price.amount -= arg;}
}
```

- after
```
class Product {
  applyDiscount(arg) {
    this._price = new Money(this._price.amount - arg, this._price.currency;)
  }
}
```

- 値オブジェクトは変更不可なので一般的には使用の把握が容易
- 変更不可のデータ値をプログラムの他の部分に渡しても、保有側のオブジェクトで、知らぬ間に値が変更される心配はない

- before
```
class Person {
  constructor() {
    this._telephoneNumber = new TelephoneNumber();
  }

  get officeAreaCode() {return this._telephoneNumber.areaCode;}
  set officeAreaCode(arg) {this._telephoneNumber.areaCode = arg;}  
  get officeNumber() {return this._telephoneNumber.number;}
  set officeNumber(arg) {this._telephoneNumber.number = arg;}
}

class TelephoneNumber {
  get areaCode() {return this._areaCode;}
  set areaCode(arg) {this._areaCode = arg;}

  get number() {return this._number;}
  set number(arg) {this._number = arg;}
}
```

- after
```
class Person {
  set officeNumber(arg) {
    this._telephoneNumber = new TelephoneNumber(arg, this.officeNumber);
  }  
  set officeAreaCode(arg) {
    this._telephoneNumber = new TelephoneNumber(this.officeAreaCode, arg);
  }  
}
```
- beforeの更新メソッドは値オブジェクトに更新できる

## 値から参照への変更
- before
```
let customer = new Customer(customerData);
```

- after
```
let customer = customerRepository.get(customerData.id);
```
- データをグローバルに保ちたい場合は参照が有効

```
let _repositoryData;

export function initializa() {
  _repositoryData = {};
  _repositoryData.customers = new Map();
}

export function registoryCustomer(id) {
  if(!_repositoryData.customers.has(id))
    _repositoryData.customer.set(id, new Customer(id));
  return findCustomer(id);
}

export function findCustomer(id) {
  return _repositoryData.customer.get(id);
}
```
