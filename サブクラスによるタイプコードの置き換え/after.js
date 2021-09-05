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
    // 継承の代わりにstrategyパターンで継承関係を表現
    set type(arg) {return this._arg = Employee.createEmployeeType(arg);}
  
    get capitalizedType() {
      return this._type.charAt(0).toUpperCase() + this._type.substr(1).toLowerCase();
    }
    toString() {
      return `${this._name} (${this.capitalizedType})`
    }

    static createEmployeeType(aString) {
      switch(aString) {
        case "engineer" : return new Engineer();
        case "manager" : return new Manager();
        default: throw new Error();
      }
    }
  }

class EmployeeType {}
class Engineer extends EmployeeType {
  toString() {return 'enginner';}
}
class Manager extends EmployeeType {
  toString() {return 'manager';}
}
