class Order {
    get finalPrice() {
      const basePrice = this.quantity * this.itemPrice;
      return this.discountPrice(basePrice);
    }

    // 問い合わせによる一時変数の置き換え
    discountLevel() {
      return this.quantity > 100 ? 2 : 1;
    }
  
    discountPrice(basePrice) {
      switch (this.discountLevel) {
        case 1: return basePrice * 0.95;
        case 2: return basePrice * 0.9;
      }
    }
  };
  