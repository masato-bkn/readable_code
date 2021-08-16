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
