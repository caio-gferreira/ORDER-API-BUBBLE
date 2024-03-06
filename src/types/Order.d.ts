export declare interface IProduct {
    sku: number;
    productName: string;
    unitValue: number;
}

export declare interface IOrder {
    orderId: number;
    items: IProduct[];
    totalValue: number;
    dateCreated: Date;
}