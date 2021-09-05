class Employee {
  constructor(name, type) {
    this.validateType(type);
    this._name = name;
    this._type = type;
  }

  validateType(arg) {
    if (!["enginner", "manager", "salesman"].includes(arg))
    throw new Error(`従業員のタイプコードが不正: ${arg}`)
  }
  get type() {return this._type;}
  set type(arg) {return this._arg = arg;}

  get capitalizedType() {
    return this._type.charAt(0).toUpperCase() + this._type.substr(1).toLowerCase();
  }
  toString() {
    return `${this._name} (${this.capitalizedType})`
  }
}
// パートタイムとフルタイムの従業員用サブクラスが既にあるので、Employeeクラスをタイプコードごとにサブクラス化することはできない
