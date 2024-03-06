module.exports = class Product {
    /**
     * 
     * @param {ProductT} productOptions 
     */
    constructor(productOptions) {
        this.productName = productOptions.productName;
        this.unitValue = productOptions.unitValue;
        this.sku = productOptions.sku;
    }
}
