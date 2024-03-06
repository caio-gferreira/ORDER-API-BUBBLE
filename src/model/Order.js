module.exports = class Order {
    /**
     * 
     * @param {OrderT} orderOptions 
     */
    constructor(orderOptions = null) {
        this.dateCreated = orderOptions.dateCreated;
        this.totalValue = orderOptions.totalValue;
        this.orderId;
        /**@typedef {ProductT[]} */
        this.items;
    }

    setOrderId(id) {
        this.orderId = id
    };

    setItems(items) {
        this.items = items;
    }
}
