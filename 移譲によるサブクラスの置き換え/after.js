class Booking {
    constructor (show, date) {
      this._show = show;
      this._date = date;
    }
    get hasTalkBack() {
      return (this._premiumDelegate)
        ? this._premiumDelegate.hasTalkBack
        : this._show.hasOwnProperty('talkback') && !this.isPeakDay;
    }
    get basePrice() {
      return (this._premiumDelegate)
        ? this._premiumDelegate.basePrice
        : this._privateBasePrice;
    }

    get _privateBasePrice() {
     let result = this._show.price;
      if (this.isPeakDay) result += Math.round(result * 0.15);
      return result;
    }
    get hasDinner() {
      return (this._premiumDelegate)
      ? this._premiumDelegate.hasDinner
      : undefined;
    }
    _bePremium(extras) {
      this._premiumDelegate = new PremiumBookingDelegate(this, extras)
    }
  }
  
class PremiumBooking extends Booking {
  constructor (show, date, extra) {
    super(show, date);
    this._extra = extra;
  }
  get basePrice() {
    return Math.round(super.basePrice + this._extra.premiumFee);
  }
  get hasDinner() {
    return this._extras.hasOwnProperty('dinner') && !this.isPeakDay;
  }
}

class PremiumBookingDelegate {
  constructor(hostBooking, extras) {
    this._host = hostBooking;
    this._extras = extras;
  }
  get hasTalkBack() {
    return this._host._show.hasOwnProperty('talkback');
  } 
  get basePrice() {
    return Math.round(this._host._privateBasePrice + this._extra.premiumFee);
  }
  get hasDinner() {
    return this._extras.hasOwnProperty('dinner') && !this._host.isPeakDay;
  }
}

function createBooking(show, date) {
  return new Booking(show, date);
}

function createPremiumBooking(show, date, extras) {
  const result = PremiumBooking(show, date, extras);
  result._bePremium(extras);
  return result;
}

aBooking = createBooking(show, date);
aBooking = createPremiumBooking(show, date, extras);
