BigNumber.config({ FORMAT: {
        groupSize: 3,
        groupSeparator: ' ',
        decimalSeparator: ','
}});

const MAX_QUANTITY = new BigNumber('100000.00');
const LEVEL3_THRESHOLD = new BigNumber('40000');
const LEVEL2_THRESHOLD = new BigNumber('10000');
const ONE = new BigNumber('1');
const ZERO = new BigNumber('0');

class ItemsContainer {

    constructor() {
        this._items = [];
    }

    add(newItem) {
        const existing = this._items.find(item => item.product.sku === newItem.product.sku);

        if (undefined !== existing) {
            existing.addQuantity(newItem.quantity);
            return existing;
        } else {
            this._items.push(newItem);
            return newItem;
        }
    }

    getSize() {
        return this._items.length;
    }

    getTotalForLevel(level) {
        return this._items
            .filter(item => item.selected)
            .reduce((total, item) => total.plus(item.getTotalForLevel(level)), ZERO);
    }

    getTotalInRetailPrice() {
        return this._items
            .filter(item => item.selected)
            .reduce((total, item) => total.plus(item.getTotalInRetailPrice()), ZERO);
    }

    find(sku) {
        const item = this._items.find(item => item.product.sku === sku);

        if (!item) {
            const existing = this._items.map(item => item.product.sku).join(', ');
            throw new Error("Product with sku {" + sku + "} not found in [" + existing + "]");
        }
        return item;
    }

    forEach(callback) {
        this._items.forEach(callback);
    }

    filter(callback) {
        return this._items.filter(callback);
    }

    map(callback) {
        return this._items.map(callback);
    }

    reduce(callback, initial) {
        return this._items.reduce(callback, initial);
    }

    toJson() {
        const retail = this.getTotalInRetailPrice();
        const level = ItemsContainer.getPriceLevel(retail);
        return {
            totalRetail: retail.toFormat(2),
            total: this.getTotalForLevel(level).toFormat(2),
            count: this._items.length,
            level: level,
            items: this._items.map(item => item.toJson())};
    }

    toFormData() {
        if (this._items.length === 0) {
            throw new Error('No elements to submit');
        }

        const result = {};
        this._items
            .filter(item => item.selected)
            .forEach(item => result[item.product.id] = item.quantity.toFixed(4));
        return result;
    }

    static getPriceLevel(total) {
        if (total.gte(LEVEL3_THRESHOLD)) {
            return 3;
        }
        return total.gte(LEVEL2_THRESHOLD) ? 2 : 1;
    }
}


class Item {

    constructor(product, quantity, selected = false) {
        this.product = product;
        this._validateQuantity(quantity);
        this.quantity = quantity;
        this.selected = selected;

        // division remainder not working as expected, have to use divToInt
        if (!this.quantity.div(this.product.multiplicity).equals(this.quantity.divToInt(this.product.multiplicity))) {
            throw new RangeError('Quantity should be times of multiplicity ['
                + this.product.multiplicity + '] but [' + quantity + '] given');
        }
    }

    getTotalInRetailPrice() {
        return this.quantity.mul(this.product.getRetailPrice());
    }

    getTotalForLevel(lvl) {
        return this.quantity.mul(this.product.getPriceForLevel(lvl));
    }

    decrementQuantity() {
        const newQty = this.quantity.minus(this.product.multiplicity);
        this.quantity = this._coerceQuantity(newQty);
        return Item.isQuantityValid(this.product, newQty);
    }

    incrementQuantity() {
        const newQty = this.quantity.plus(this.product.multiplicity);
        this.quantity = this._coerceQuantity(newQty);
        return Item.isQuantityValid(this.product, newQty);
    }

    setQuantity(qty) {
        this.quantity = this._coerceQuantity(qty);
        return Item.isQuantityValid(this.product, qty);
    }

    addQuantity(qty) {
        const newQty = this._coerceQuantity(qty);
        this._validateQuantity(newQty);
        this.quantity = this._coerceQuantity(this.quantity.plus(newQty));
    }

    toJson() {
        return {
            sku: this.product.sku,
            quantity: this.quantity.toFixed(),
            total: this.getTotalInRetailPrice().toFormat(2)};
    }

    static isQuantityValid(product, newQuantity) {
        return product.minOrder.lte(newQuantity) && product.maxOrder.gte(newQuantity);
    }

    // always cource to upper (c) Nikita
    _coerceQuantity(newQuantity) {
        if (newQuantity.lt(this.product.minOrder)) {
            return this.product.minOrder;
        }
        if (newQuantity.gt(this.product.maxOrder)) {
            return this.product.maxOrder;
        }

        if (!newQuantity.div(this.product.multiplicity).equals(newQuantity.divToInt(this.product.multiplicity))) {
            return newQuantity.divToInt(this.product.multiplicity).plus(1).mul(this.product.multiplicity);
        } else {
            return newQuantity;
        }
    }

    _validateQuantity(newQuantity) {
        if (!Item.isQuantityValid(this.product, newQuantity)) {
            const strValue = newQuantity instanceof BigNumber ? newQuantity.toFixed(2) : newQuantity;
            throw new RangeError(
                'Quantity ' + strValue + ' out of range ['
                + this.product.minOrder.toFixed(2) + ', ' + this.product.maxOrder.toFixed(2) + ']'
            );
        }
    }
}

class Product {

    constructor(data) {
        this.id = data['id'];
        this.sku = data['sku'];

        if (data['multiplicity'] === null) {
            this.multiplicity = ONE;
        } else {
            this.multiplicity = new BigNumber(data['multiplicity']);
        }

        if (this.multiplicity.eq(ZERO)) {
            this.multiplicity = ONE;
        }

        if (data['minOrder'] === null || data['minOrder'] === 0 || data['minOrder'] === '0') {
            this.minOrder = this.multiplicity;
        } else {
            const minOrder = new BigNumber(data['minOrder']);
            this.minOrder = minOrder.lt(this.multiplicity)
                ? this.multiplicity
                : minOrder.divToInt(this.multiplicity).mul(this.multiplicity);
        }

        if (data['maxOrder'] === null || data['maxOrder'] === 0 || data['maxOrder'] === '0') {
            this.maxOrder = MAX_QUANTITY;
        } else {
            this.maxOrder = (new BigNumber(data['maxOrder'])).divToInt(this.multiplicity).mul(this.multiplicity);
        }

        this.prices = data['prices'];
        this.promotions = data['promotions'];
    }

    getRetailPrice() {
        const price = this.prices['GENERAL']['regular'];
        return new BigNumber(price ? price : 0);
    }

    getPriceForLevel(lvl) {
        const price = this._getPrice(lvl);
        return new BigNumber(price ? price : 0);
    }

    toJson() {
        return {
            'id': this.id,
            'sku': this.sku,
            'shortSku': this.sku.replace(/[^\d]/g, ''),
            'generalCurrent': this._formatCurrentPrice(this.prices['GENERAL']['regular'], this.prices['GENERAL']['old']),
            'generalOld': this._formatOldPrice(this.prices['GENERAL']['old']),
            'swhCurrent': this._formatCurrentPrice(this.prices['SWH']['regular'], this.prices['SWH']['old']),
            'swhOld': this._formatOldPrice(this.prices['SWH']['old']),
            'whCurrent': this._formatCurrentPrice(this.prices['WH']['regular'], this.prices['WH']['old']),
            'whOld': this._formatOldPrice(this.prices['WH']['old']),
        }
    }

    _formatCurrentPrice(current, old) {
        if (current == 0) {
            return 'Цена по запросу';
        }

        return (new BigNumber(current)).toFormat(2) + ' ₽';
    }

    _formatOldPrice(old) {
        if (old > 0) {
            return (new BigNumber(old)).toFormat(2) + ' ₽';
        } else {
            return '';
        }
    }

    _getPrice(lvl) {
        switch(lvl) {
            case 1:
                return this.prices['GENERAL']['regular'];
            case 2:
                return this.prices['SWH']['regular'];
            case 3:
                return this.prices['WH']['regular'];
            default:
                throw new Error('Unknown price level: ' + this.priceLevel);
        }
    }
}

class ProxyHandler {

    constructor(type) {
        this.type = type;
    }

    get(target, key) {
        if (key === 'type') {
            return this.type;
        }

        return target[key];
    }
}

class Promotion {

    constructor(data, gift) {
        this.id = data['id'];
        this.multiplicity = new BigNumber(data['multiplicity']);
        this.giftMultiplicity = new BigNumber(data['giftMultiplicity']);
        this.gift = gift;
        this.data = data;
        this.type = data['type'];
        try {
            // anyway max should be proportional to multiplicity. Coerce to lower bound (c) Nikita
            this.max = new BigNumber(data['max_gift_count']).divToInt(this.giftMultiplicity).mul(this.giftMultiplicity);
        } catch (e) {
            this.max = new BigNumber(999999);
        }

        this._items = [];
        this.giftQty = ZERO;
    }

    hasAssociatedProduct(sku) {
        return this._items.filter(item => item.product.sku === sku).length > 0;
    }

    getQuantity() {
        return this._calculateQuantity();
    }

    addProduct(productItem, type) {
        this._items.push(new Proxy(productItem, new ProxyHandler(type)));
    }

    notify() {
        const oldGiftQty = this.giftQty;
        this.giftQty = this._calculateQuantity();
        return !this.giftQty.eq(oldGiftQty);
    }

    toJson() {
        return {
            promotion: {
                id: this.id,
                name: this.data['name'],
                shortDescription: this.data['short_description'],
                url: this.data['url']
            },
            gift: {
                id: this.gift['id'],
                sku: this.gift['sku'],
                name: this.gift['name'],
                url: this.gift['url'],
                image: this.gift['image']
            }
        }
    }

    _calculateQuantity() {
        let productQty;
        let cartQty;
        if ('money' === this.type) {
            productQty = this._items
                .filter(item => item.selected && item.type === 'page')
                .reduce((total, item) => total.plus(item.getTotalInRetailPrice()), ZERO);

            cartQty = this._items
                .filter(item => item && item.type === 'cart')
                .reduce((total, item) => total.plus(item.getTotalInRetailPrice()), ZERO);

            // todo not covered with tests
        } else {
            productQty = this._items
                .filter(item => item.selected && item.type === 'page')
                .reduce((total, item) => total.plus(item.quantity), ZERO);

            cartQty = this._items
                .filter(item => item && item.type === 'cart')
                .reduce((total, item) => total.plus(item.quantity), ZERO);
        }

        const left = cartQty.minus(cartQty.divToInt(this.multiplicity).mul(this.multiplicity));
        productQty = productQty.plus(left);

        const result = productQty.divToInt(this.multiplicity).mul(this.giftMultiplicity);
        return result.gt(this.max) ? this.max : result;
    }
}


class PriceLevelService {

    constructor(cart) {
        this._items = new ItemsContainer();
        this._promotions = [];
        this._cart = cart;
        this._changeLevelCallback = () => {};
        this._changePresentCallback = () => {};
        this._addToCartCallback = () => {};
        this._changeTotalCallback = () => {};
    }

    registerChangeLevelCallback(callback) {
        this._changeLevelCallback = callback;
    }

    registerChangePresentCallback(callback) {
        this._changePresentCallback = callback;
    }

    registerAddToCartCallback(callback) {
        this._addToCartCallback = callback;
    }

    registerChangeTotalCallback(callback) {
        this._changeTotalCallback = callback;
    }

    addPromotions(promotionsData) {
        const gifts = promotionsData.gifts;
        promotionsData.promotions.forEach (p => this._addPromotion(p, gifts[p.gift]));
    }

    addCartProduct(productData) {
        this._cart.add(new Item(new Product(productData), new BigNumber(productData['qty'])));
    }

    addProduct(productData) {
        if (this._promotions.length > 0) {
            throw new Error("Adding products after promotions is currently unsupported");
        }

        const product = new Product(productData);

        this._items.add(new Item(product, product.minOrder));
    }

    addProductWithQuantity(productData, qty) {
        this.addProduct(productData);
        this._setQuantity(productData['sku'], qty);
    }

    addToCart(sku, qty) {
        this._execute(() => { this._addToCart(this._items.find(sku).product, new BigNumber(qty))});
        this._addToCartCallback(this._cart.toJson());
    }

    hasSelectedItems() {
        return this._items
            .filter(item => item.selected)
            .reduce((total, item) => total.plus(item.quantity), ZERO)
            .gt(ZERO);
    }

    addSelectedToCart() {
        this._items
            .filter(item => item.selected)
            .forEach(item => this._addToCart(item.product, item.quantity));

        this._addToCartCallback(this._cart.toJson())
    }

    deselectOtherThan(sku) {
        this._items.find(sku).selected = true;

        this._items
            .filter(item => item.product.sku !== sku)
            .forEach(item => item.selected = false);
    }

    getPromotionsForProduct(sku) {
        return this._promotions
            .filter(p => p.hasAssociatedProduct(sku))
            .map(p => p.toJson());
    }

    incrementQuantity(sku) {
        return this._execute(() => {
            const item = this._items.find(sku);
            item.selected = true;
            return item.incrementQuantity();
        });
    }

    isQuantityValid(sku, quantity) {
        const item = this._items.find(sku);
        try {
            return Item.isQuantityValid(item.product, new BigNumber(quantity));
        } catch (e) {
            return false;
        }
    }

    setQuantity(sku, quantity) {
        return this._execute(() => this._setQuantity(sku, quantity));
    }

    getQuantity(sku) {
        const item = this._items.find(sku);
        return item.selected ? item.quantity.toFixed() : ZERO.toFixed();
    }

    decrementQuantity(sku) {
        return this._execute(() => {
            const item = this._items.find(sku);
            item.selected = true;
            return item.decrementQuantity();
        });
    }

    select(sku) {
        this._execute(() => this._items.find(sku).selected = true);
    }

    deselect(sku) {
        this._execute(() => this._items.find(sku).selected = false);
    }

    getLevel() {
        return ItemsContainer.getPriceLevel(this._getTotalRetailPrice());
    }

    getFormData() {
        return this._items.toFormData();
    }

    getProductData(sku) {
        return this._items.find(sku).product.toJson();
    }

    getTotalRetailPrice() {
        return this._getTotalRetailPrice().toFormat(2);
    }

    getTotalForProduct(sku) {
        return this._items.find(sku).getTotalForLevel(this.getLevel()).toFormat(2);
    }

    _getTotalRetailPrice() {
        return this._cart.getTotalInRetailPrice().plus(this._items.getTotalInRetailPrice());
    }

    _setQuantity(sku, quantity) {
        let newQty;
        try {
            newQty = new BigNumber(quantity);
        } catch (e) {
            return false;
        }

        const item = this._items.find(sku);
        item.selected = true;
        return item.setQuantity(newQty);
    }

    _addPromotion(promotionData, gift) {
        const promo = new Promotion(promotionData, gift);
        this._promotions.push(promo);

        this._items
            .filter(item => item.product.promotions.includes(promo.id))
            .forEach(item => promo.addProduct(item, 'page'));

        this._cart
            .filter(item => item.product.promotions.includes(promo.id))
            .forEach(item => promo.addProduct(item, 'cart'));

        this._notifyPromotion(promo);
    }

    _addToCart(product, quantity) {
        const item = new Item(product, quantity, true);
        const addedItem = this._cart.add(item);
        //we got link to same object if it was missing in cart, otherwise - to stored in cart
        if (addedItem === item) {
            this._promotions
                .filter(p => addedItem.product.promotions.includes(p.id))
                .forEach(p => p.addProduct(addedItem, 'cart'));
        }
    }

    _getProduct(sku) {
        const product = this._items.find(item => item.product.sku === sku);

        if (!product) {
            throw new Error('Product with sku {' + sku + '} not found');
        }
        return product;
    }

    _execute(block) {
        const oldLevel = this.getLevel();
        const result = block();
        const newLevel = this.getLevel();

        this._notifyPromotions();
        this._changeTotalCallback(this._items.getTotalForLevel(newLevel).toFormat(2));

        if (oldLevel !== newLevel) {
            this._changeLevelCallback(newLevel)
        }
        return result;
    }

    _notifyPromotions() {
        this._promotions.forEach(promo => this._notifyPromotion(promo))
    }

    _notifyPromotion(promo) {
        if(promo.notify()) {
            // handle promotions with same present (todo need more testing)
            const qty = this._promotions
                .filter(p => p.gift['id'] === promo.gift['id'])
                .reduce((total, p) => total.plus(p.getQuantity()), ZERO);

            this._changePresentCallback(promo.toJson(), qty.toFixed());
        }
    }
}
