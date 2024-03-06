import env from '../config/env';
import  UserInterface from './UserInterface';
import { IOrder, IProduct } from './Order';
import controllers from '../controllers';
import database from '../database';


export declare global {
    export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
    export type RecursivePartial<T> = {
        [P in keyof T]?: RecursivePartial<T[P]>;
    };

    type Env = typeof env;
    type IUser = UserInterface.IUser;
    type OrderT = IOrder;
    type ProductT = IProduct;

    /**
     * @see {controllers}
     */
    export import Controllers = controllers;

     /**
     * @see {database}
     */
     export import Database = database;
}
