class Booking {
  constructor (show, date) {
    this._show = show;
    this._date = date;
  }
  get hasTalkBack() {
    return this._show.hasOwnProperty('talkback') && !this.isPeakDay;
  }
  get basePrice() {
    let result = this._show.price;
    if (this.isPeakDay) result += Math.round(result * 0.15);
    return result;
  }
}

class PremiumBooking extends Booking {
  constructor (show, date, extra) {
    super(show, date);
    this._extra = extra;
  }
  get hasTalkBack() {
    return this._show.hasOwnProperty('talkback');
  }
  get basePrice() {
    return Math.round(super.basePrice + this._extra.premiumFee);
  }
  get hasDinner() {
    return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
  }
}
