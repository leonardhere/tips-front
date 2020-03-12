'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

BigNumber.config({ FORMAT: {
        groupSize: 3,
        groupSeparator: ' ',
        decimalSeparator: ','
    } });

var MAX_QUANTITY = new BigNumber('100000.00');
var LEVEL3_THRESHOLD = new BigNumber('40000');
var LEVEL2_THRESHOLD = new BigNumber('10000');
var ONE = new BigNumber('1');
var ZERO = new BigNumber('0');

var ItemsContainer = function () {
    function ItemsContainer() {
        _classCallCheck(this, ItemsContainer);

        this._items = [];
    }

    _createClass(ItemsContainer, [{
        key: 'add',
        value: function add(newItem) {
            var existing = this._items.find(function (item) {
                return item.product.sku === newItem.product.sku;
            });

            if (undefined !== existing) {
                existing.addQuantity(newItem.quantity);
                return existing;
            } else {
                this._items.push(newItem);
                return newItem;
            }
        }
    }, {
        key: 'getSize',
        value: function getSize() {
            return this._items.length;
        }
    }, {
        key: 'getTotalForLevel',
        value: function getTotalForLevel(level) {
            return this._items.filter(function (item) {
                return item.selected;
            }).reduce(function (total, item) {
                return total.plus(item.getTotalForLevel(level));
            }, ZERO);
        }
    }, {
        key: 'getTotalInRetailPrice',
        value: function getTotalInRetailPrice() {
            return this._items.filter(function (item) {
                return item.selected;
            }).reduce(function (total, item) {
                return total.plus(item.getTotalInRetailPrice());
            }, ZERO);
        }
    }, {
        key: 'find',
        value: function find(sku) {
            var item = this._items.find(function (item) {
                return item.product.sku === sku;
            });

            if (!item) {
                var existing = this._items.map(function (item) {
                    return item.product.sku;
                }).join(', ');
                throw new Error("Product with sku {" + sku + "} not found in [" + existing + "]");
            }
            return item;
        }
    }, {
        key: 'forEach',
        value: function forEach(callback) {
            this._items.forEach(callback);
        }
    }, {
        key: 'filter',
        value: function filter(callback) {
            return this._items.filter(callback);
        }
    }, {
        key: 'map',
        value: function map(callback) {
            return this._items.map(callback);
        }
    }, {
        key: 'reduce',
        value: function reduce(callback, initial) {
            return this._items.reduce(callback, initial);
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            var retail = this.getTotalInRetailPrice();
            var level = ItemsContainer.getPriceLevel(retail);
            return {
                totalRetail: retail.toFormat(2),
                total: this.getTotalForLevel(level).toFormat(2),
                count: this._items.length,
                level: level,
                items: this._items.map(function (item) {
                    return item.toJson();
                }) };
        }
    }, {
        key: 'toFormData',
        value: function toFormData() {
            if (this._items.length === 0) {
                throw new Error('No elements to submit');
            }

            var result = {};
            this._items.filter(function (item) {
                return item.selected;
            }).forEach(function (item) {
                return result[item.product.id] = item.quantity.toFixed(4);
            });
            return result;
        }
    }], [{
        key: 'getPriceLevel',
        value: function getPriceLevel(total) {
            if (total.gte(LEVEL3_THRESHOLD)) {
                return 3;
            }
            return total.gte(LEVEL2_THRESHOLD) ? 2 : 1;
        }
    }]);

    return ItemsContainer;
}();

var Item = function () {
    function Item(product, quantity) {
        var selected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classCallCheck(this, Item);

        this.product = product;
        this._validateQuantity(quantity);
        this.quantity = quantity;
        this.selected = selected;

        // division remainder not working as expected, have to use divToInt
        if (!this.quantity.div(this.product.multiplicity).equals(this.quantity.divToInt(this.product.multiplicity))) {
            throw new RangeError('Quantity should be times of multiplicity [' + this.product.multiplicity + '] but [' + quantity + '] given');
        }
    }

    _createClass(Item, [{
        key: 'getTotalInRetailPrice',
        value: function getTotalInRetailPrice() {
            return this.quantity.mul(this.product.getRetailPrice());
        }
    }, {
        key: 'getTotalForLevel',
        value: function getTotalForLevel(lvl) {
            return this.quantity.mul(this.product.getPriceForLevel(lvl));
        }
    }, {
        key: 'decrementQuantity',
        value: function decrementQuantity() {
            var newQty = this.quantity.minus(this.product.multiplicity);
            this.quantity = this._coerceQuantity(newQty);
            return Item.isQuantityValid(this.product, newQty);
        }
    }, {
        key: 'incrementQuantity',
        value: function incrementQuantity() {
            var newQty = this.quantity.plus(this.product.multiplicity);
            this.quantity = this._coerceQuantity(newQty);
            return Item.isQuantityValid(this.product, newQty);
        }
    }, {
        key: 'setQuantity',
        value: function setQuantity(qty) {
            this.quantity = this._coerceQuantity(qty);
            return Item.isQuantityValid(this.product, qty);
        }
    }, {
        key: 'addQuantity',
        value: function addQuantity(qty) {
            var newQty = this._coerceQuantity(qty);
            this._validateQuantity(newQty);
            this.quantity = this._coerceQuantity(this.quantity.plus(newQty));
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            return {
                sku: this.product.sku,
                quantity: this.quantity.toFixed(),
                total: this.getTotalInRetailPrice().toFormat(2) };
        }
    }, {
        key: '_coerceQuantity',


        // always cource to upper (c) Nikita
        value: function _coerceQuantity(newQuantity) {
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
    }, {
        key: '_validateQuantity',
        value: function _validateQuantity(newQuantity) {
            if (!Item.isQuantityValid(this.product, newQuantity)) {
                var strValue = newQuantity instanceof BigNumber ? newQuantity.toFixed(2) : newQuantity;
                throw new RangeError('Quantity ' + strValue + ' out of range [' + this.product.minOrder.toFixed(2) + ', ' + this.product.maxOrder.toFixed(2) + ']');
            }
        }
    }], [{
        key: 'isQuantityValid',
        value: function isQuantityValid(product, newQuantity) {
            return product.minOrder.lte(newQuantity) && product.maxOrder.gte(newQuantity);
        }
    }]);

    return Item;
}();

var Product = function () {
    function Product(data) {
        _classCallCheck(this, Product);

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
            var minOrder = new BigNumber(data['minOrder']);
            this.minOrder = minOrder.lt(this.multiplicity) ? this.multiplicity : minOrder.divToInt(this.multiplicity).mul(this.multiplicity);
        }

        if (data['maxOrder'] === null || data['maxOrder'] === 0 || data['maxOrder'] === '0') {
            this.maxOrder = MAX_QUANTITY;
        } else {
            this.maxOrder = new BigNumber(data['maxOrder']).divToInt(this.multiplicity).mul(this.multiplicity);
        }

        this.prices = data['prices'];
        this.promotions = data['promotions'];
    }

    _createClass(Product, [{
        key: 'getRetailPrice',
        value: function getRetailPrice() {
            var price = this.prices['GENERAL']['regular'];
            return new BigNumber(price ? price : 0);
        }
    }, {
        key: 'getPriceForLevel',
        value: function getPriceForLevel(lvl) {
            var price = this._getPrice(lvl);
            return new BigNumber(price ? price : 0);
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            return {
                'id': this.id,
                'sku': this.sku,
                'shortSku': this.sku.replace(/[^\d]/g, ''),
                'generalCurrent': this._formatCurrentPrice(this.prices['GENERAL']['regular'], this.prices['GENERAL']['old']),
                'generalOld': this._formatOldPrice(this.prices['GENERAL']['old']),
                'swhCurrent': this._formatCurrentPrice(this.prices['SWH']['regular'], this.prices['SWH']['old']),
                'swhOld': this._formatOldPrice(this.prices['SWH']['old']),
                'whCurrent': this._formatCurrentPrice(this.prices['WH']['regular'], this.prices['WH']['old']),
                'whOld': this._formatOldPrice(this.prices['WH']['old'])
            };
        }
    }, {
        key: '_formatCurrentPrice',
        value: function _formatCurrentPrice(current, old) {
            if (current == 0) {
                return 'Цена по запросу';
            }

            return new BigNumber(current).toFormat(2) + ' ₽';
        }
    }, {
        key: '_formatOldPrice',
        value: function _formatOldPrice(old) {
            if (old > 0) {
                return new BigNumber(old).toFormat(2) + ' ₽';
            } else {
                return '';
            }
        }
    }, {
        key: '_getPrice',
        value: function _getPrice(lvl) {
            switch (lvl) {
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
    }]);

    return Product;
}();

var ProxyHandler = function () {
    function ProxyHandler(type) {
        _classCallCheck(this, ProxyHandler);

        this.type = type;
    }

    _createClass(ProxyHandler, [{
        key: 'get',
        value: function get(target, key) {
            if (key === 'type') {
                return this.type;
            }

            return target[key];
        }
    }]);

    return ProxyHandler;
}();

var Promotion = function () {
    function Promotion(data, gift) {
        _classCallCheck(this, Promotion);

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

    _createClass(Promotion, [{
        key: 'hasAssociatedProduct',
        value: function hasAssociatedProduct(sku) {
            return this._items.filter(function (item) {
                return item.product.sku === sku;
            }).length > 0;
        }
    }, {
        key: 'getQuantity',
        value: function getQuantity() {
            return this._calculateQuantity();
        }
    }, {
        key: 'addProduct',
        value: function addProduct(productItem, type) {
            this._items.push(new Proxy(productItem, new ProxyHandler(type)));
        }
    }, {
        key: 'notify',
        value: function notify() {
            var oldGiftQty = this.giftQty;
            this.giftQty = this._calculateQuantity();
            return !this.giftQty.eq(oldGiftQty);
        }
    }, {
        key: 'toJson',
        value: function toJson() {
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
            };
        }
    }, {
        key: '_calculateQuantity',
        value: function _calculateQuantity() {
            var productQty = void 0;
            var cartQty = void 0;
            if ('money' === this.type) {
                productQty = this._items.filter(function (item) {
                    return item.selected && item.type === 'page';
                }).reduce(function (total, item) {
                    return total.plus(item.getTotalInRetailPrice());
                }, ZERO);

                cartQty = this._items.filter(function (item) {
                    return item && item.type === 'cart';
                }).reduce(function (total, item) {
                    return total.plus(item.getTotalInRetailPrice());
                }, ZERO);

                // todo not covered with tests
            } else {
                productQty = this._items.filter(function (item) {
                    return item.selected && item.type === 'page';
                }).reduce(function (total, item) {
                    return total.plus(item.quantity);
                }, ZERO);

                cartQty = this._items.filter(function (item) {
                    return item && item.type === 'cart';
                }).reduce(function (total, item) {
                    return total.plus(item.quantity);
                }, ZERO);
            }

            var left = cartQty.minus(cartQty.divToInt(this.multiplicity).mul(this.multiplicity));
            productQty = productQty.plus(left);

            var result = productQty.divToInt(this.multiplicity).mul(this.giftMultiplicity);
            return result.gt(this.max) ? this.max : result;
        }
    }]);

    return Promotion;
}();

var PriceLevelService = function () {
    function PriceLevelService(cart) {
        _classCallCheck(this, PriceLevelService);

        this._items = new ItemsContainer();
        this._promotions = [];
        this._cart = cart;
        this._changeLevelCallback = function () {};
        this._changePresentCallback = function () {};
        this._addToCartCallback = function () {};
        this._changeTotalCallback = function () {};
    }

    _createClass(PriceLevelService, [{
        key: 'registerChangeLevelCallback',
        value: function registerChangeLevelCallback(callback) {
            this._changeLevelCallback = callback;
        }
    }, {
        key: 'registerChangePresentCallback',
        value: function registerChangePresentCallback(callback) {
            this._changePresentCallback = callback;
        }
    }, {
        key: 'registerAddToCartCallback',
        value: function registerAddToCartCallback(callback) {
            this._addToCartCallback = callback;
        }
    }, {
        key: 'registerChangeTotalCallback',
        value: function registerChangeTotalCallback(callback) {
            this._changeTotalCallback = callback;
        }
    }, {
        key: 'addPromotions',
        value: function addPromotions(promotionsData) {
            var _this = this;

            var gifts = promotionsData.gifts;
            promotionsData.promotions.forEach(function (p) {
                return _this._addPromotion(p, gifts[p.gift]);
            });
        }
    }, {
        key: 'addCartProduct',
        value: function addCartProduct(productData) {
            this._cart.add(new Item(new Product(productData), new BigNumber(productData['qty'])));
        }
    }, {
        key: 'addProduct',
        value: function addProduct(productData) {
            if (this._promotions.length > 0) {
                throw new Error("Adding products after promotions is currently unsupported");
            }

            var product = new Product(productData);

            this._items.add(new Item(product, product.minOrder));
        }
    }, {
        key: 'addProductWithQuantity',
        value: function addProductWithQuantity(productData, qty) {
            this.addProduct(productData);
            this._setQuantity(productData['sku'], qty);
        }
    }, {
        key: 'addToCart',
        value: function addToCart(sku, qty) {
            var _this2 = this;

            this._execute(function () {
                _this2._addToCart(_this2._items.find(sku).product, new BigNumber(qty));
            });
            this._addToCartCallback(this._cart.toJson());
        }
    }, {
        key: 'hasSelectedItems',
        value: function hasSelectedItems() {
            return this._items.filter(function (item) {
                return item.selected;
            }).reduce(function (total, item) {
                return total.plus(item.quantity);
            }, ZERO).gt(ZERO);
        }
    }, {
        key: 'addSelectedToCart',
        value: function addSelectedToCart() {
            var _this3 = this;

            this._items.filter(function (item) {
                return item.selected;
            }).forEach(function (item) {
                return _this3._addToCart(item.product, item.quantity);
            });

            this._addToCartCallback(this._cart.toJson());
        }
    }, {
        key: 'deselectOtherThan',
        value: function deselectOtherThan(sku) {
            this._items.find(sku).selected = true;

            this._items.filter(function (item) {
                return item.product.sku !== sku;
            }).forEach(function (item) {
                return item.selected = false;
            });
        }
    }, {
        key: 'getPromotionsForProduct',
        value: function getPromotionsForProduct(sku) {
            return this._promotions.filter(function (p) {
                return p.hasAssociatedProduct(sku);
            }).map(function (p) {
                return p.toJson();
            });
        }
    }, {
        key: 'incrementQuantity',
        value: function incrementQuantity(sku) {
            var _this4 = this;

            return this._execute(function () {
                var item = _this4._items.find(sku);
                item.selected = true;
                return item.incrementQuantity();
            });
        }
    }, {
        key: 'isQuantityValid',
        value: function isQuantityValid(sku, quantity) {
            var item = this._items.find(sku);
            try {
                return Item.isQuantityValid(item.product, new BigNumber(quantity));
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'setQuantity',
        value: function setQuantity(sku, quantity) {
            var _this5 = this;

            return this._execute(function () {
                return _this5._setQuantity(sku, quantity);
            });
        }
    }, {
        key: 'getQuantity',
        value: function getQuantity(sku) {
            var item = this._items.find(sku);
            return item.selected ? item.quantity.toFixed() : ZERO.toFixed();
        }
    }, {
        key: 'decrementQuantity',
        value: function decrementQuantity(sku) {
            var _this6 = this;

            return this._execute(function () {
                var item = _this6._items.find(sku);
                item.selected = true;
                return item.decrementQuantity();
            });
        }
    }, {
        key: 'select',
        value: function select(sku) {
            var _this7 = this;

            this._execute(function () {
                return _this7._items.find(sku).selected = true;
            });
        }
    }, {
        key: 'deselect',
        value: function deselect(sku) {
            var _this8 = this;

            this._execute(function () {
                return _this8._items.find(sku).selected = false;
            });
        }
    }, {
        key: 'getLevel',
        value: function getLevel() {
            return ItemsContainer.getPriceLevel(this._getTotalRetailPrice());
        }
    }, {
        key: 'getFormData',
        value: function getFormData() {
            return this._items.toFormData();
        }
    }, {
        key: 'getProductData',
        value: function getProductData(sku) {
            return this._items.find(sku).product.toJson();
        }
    }, {
        key: 'getTotalRetailPrice',
        value: function getTotalRetailPrice() {
            return this._getTotalRetailPrice().toFormat(2);
        }
    }, {
        key: 'getTotalForProduct',
        value: function getTotalForProduct(sku) {
            return this._items.find(sku).getTotalForLevel(this.getLevel()).toFormat(2);
        }
    }, {
        key: '_getTotalRetailPrice',
        value: function _getTotalRetailPrice() {
            return this._cart.getTotalInRetailPrice().plus(this._items.getTotalInRetailPrice());
        }
    }, {
        key: '_setQuantity',
        value: function _setQuantity(sku, quantity) {
            var newQty = void 0;
            try {
                newQty = new BigNumber(quantity);
            } catch (e) {
                return false;
            }

            var item = this._items.find(sku);
            item.selected = true;
            return item.setQuantity(newQty);
        }
    }, {
        key: '_addPromotion',
        value: function _addPromotion(promotionData, gift) {
            var promo = new Promotion(promotionData, gift);
            this._promotions.push(promo);

            this._items.filter(function (item) {
                return item.product.promotions.includes(promo.id);
            }).forEach(function (item) {
                return promo.addProduct(item, 'page');
            });

            this._cart.filter(function (item) {
                return item.product.promotions.includes(promo.id);
            }).forEach(function (item) {
                return promo.addProduct(item, 'cart');
            });

            this._notifyPromotion(promo);
        }
    }, {
        key: '_addToCart',
        value: function _addToCart(product, quantity) {
            var item = new Item(product, quantity, true);
            var addedItem = this._cart.add(item);
            //we got link to same object if it was missing in cart, otherwise - to stored in cart
            if (addedItem === item) {
                this._promotions.filter(function (p) {
                    return addedItem.product.promotions.includes(p.id);
                }).forEach(function (p) {
                    return p.addProduct(addedItem, 'cart');
                });
            }
        }
    }, {
        key: '_getProduct',
        value: function _getProduct(sku) {
            var product = this._items.find(function (item) {
                return item.product.sku === sku;
            });

            if (!product) {
                throw new Error('Product with sku {' + sku + '} not found');
            }
            return product;
        }
    }, {
        key: '_execute',
        value: function _execute(block) {
            var oldLevel = this.getLevel();
            var result = block();
            var newLevel = this.getLevel();

            this._notifyPromotions();
            this._changeTotalCallback(this._items.getTotalForLevel(newLevel).toFormat(2));

            if (oldLevel !== newLevel) {
                this._changeLevelCallback(newLevel);
            }
            return result;
        }
    }, {
        key: '_notifyPromotions',
        value: function _notifyPromotions() {
            var _this9 = this;

            this._promotions.forEach(function (promo) {
                return _this9._notifyPromotion(promo);
            });
        }
    }, {
        key: '_notifyPromotion',
        value: function _notifyPromotion(promo) {
            if (promo.notify()) {
                // handle promotions with same present (todo need more testing)
                var qty = this._promotions.filter(function (p) {
                    return p.gift['id'] === promo.gift['id'];
                }).reduce(function (total, p) {
                    return total.plus(p.getQuantity());
                }, ZERO);

                this._changePresentCallback(promo.toJson(), qty.toFixed());
            }
        }
    }]);

    return PriceLevelService;
}();