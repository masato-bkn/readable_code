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
## 条件記述の分解
- before
```
if (!aDate.isBefore(plan.summerStart)) && !aDate.isAfter(plan.summerEnd)
  charge = quantitry * plan.summerDate;
else
  charge = quantitry * plan.regularDate + plan.regularServiceEnd;
```

- after
```
if (summer())
  charge = summerCharge();
else
  charge = regularCharge();

// charge = summer() ? summerCharge() : regularCharge()
```

- 大きなコードブロックに対しては、コードを分解し、それぞれの意図に沿って名付けた関数の呼び出しに置き換えることで、意図をより明確にできる

## 条件記述の統合
- before
```
if (anEmployee.seniority < 2) return 0;
if (anEmployee.monthsDisabled > 12) return 0;
if (anEmployee.isPartTime) return 0;
```

- after
```
if (isNotEligibleForDisability()) return 0;

function isNotEligibleForDisability() {
  return ((anEmployee.seniority < 2)
    || anEmployee.monthsDisabled > 12
    || anEmployee.isPartTime
  );
}
```
- 条件判定のコードを統合することで、行なっている判定が実は一つだという意図を明示できる
- 逆に複数の判定が別々のもので、単一の判定と考えるべきでない場合はこのリファクタは行わない

## ガード説による入れ子の条件記述の置き換え
- before
```
function getPayment() {
  let result;
  if (isDead) 
    result = deadAmount();
  else {
    if (isSeparated)
      result = retiredAmount();
    else
      if (isRetired)
        result = retiredAmount();
      else
        result = normalPayAmount();
        
  }
  return result;
}
```

- after
```
function getPayAmount() {
  if (isDead) return deadAmount();
  if (isSeparated) return retiredAmount();
  if (isRetired) return retiredAmount();

  return normalPayAmount();
}
```

- ガード節を使うことでコードの意図をより明確に表現できる

- before
```
function adjustedCapital(anInstrument) {
  let result = 0;
  if (anInstrument.capital > 0) {
    if (anInstrument.interestRate > 0 && anInstrument.duration > 0) {
      result = (anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;
    }
  }
  return result;
}
```

- after
```
function adjustedCapital(anInstrument) {
  if (anInstrument.capital <= 0) 
    || anInstrument.interestRate <= 0
    || anInstrument.duration <= 0) return 0; 

  return anInstrument.income / anInstrument.duration) * anInstrument.adjustmentFactor;
}
```

- 条件を逆にして、ガード節を使う場合が多い
- 記述を簡略化できないか考えるときは、条件を反転してみることも有効

## ポリモフィズムによる条件記述の書き換え
- ポリモフィズムを利用して型固有の振る舞いをさせることで、条件分岐のロジックの重複を排除できる
- 振る舞いを分離させることでロジックは理解しやすく、扱いやすくなる

## 特殊ケースの導入
- 特殊ケースとして共通の振る舞いを全て備えた要素を作成する
  - 特殊ケースの判定を簡単な呼び出しに置き換えることができる
  - ポリモフィズム
  - 更新がないのであればクラスでなくオブジェクトリテラルでもよい

## 問い合わせと更新の分離
- before
```
function alertForMiscreant(people) {
  for (const p of people) {
    if (p === "Don") {
      setOffAlarms();
      return "Don";
    }
    if (p === "Jhon") {
      setOffAlarms();
      return "Jhon";
    }
  }
}
```

- after
```
function findMiscreant (people) {
  for (const p of people) {
    if (p === "Don") {
      return "Don";
    }
    if (p === "Jhon") {
      return "Jhon";
    }
  }
}

function alertForMiscreant(people) {
  if (findMiscreant (people) !== "") setOffAlarms();
}
```
- コマンドとクエリの分離原則

## 問い合わせによるパラメータの置き換え
- パラメータを削ることで、パラメータを決める責務が呼び出し側から、関数の内側に移動する
- 本体関数に望ましくない依存関係が増える場合は避けた方が良い

## パラメータによる問い合わせの置き換え
- プログラマとしては目標設定をするtargetTemperature関数がグローバルなオブジェクトにどのような依存性を持っているかに関心があるはず
　- 関心の問題に応じて、値を問い合わせで取得するか、パラメータから取得するか考える必要がある

## セッターの削除
- セッターを削除することで、変更させないという意図が明確になる

## ファクトリによるコンストラクタの置き換え
- before
```
leadEngineer = new Emplooyee(document.leadEngineer, 'E');
```

- after
```
leadEngineer = createEmplooyee(document.leadEngineer);
```
- コード値を理テラス文字列で渡すのは不吉な匂い

## コマンドによる関数の置き換え
- コマンドパターンにより、フィールドとメソッドを用いて煩雑な関数を分解可能にすることができる
- サブ関数に分けることで、テストやデバック用の呼び出しを直接書ける

## サブクラスによるタイプコードの置き換え
- エンジニアを従業員のサブタイプにすべきか、従業員クラスに従業員タイプのプロパティを持たせて、そこにエンジニアやマネージャなどのサブタイプを設定すべきかを検討する
