/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AllDateOutputTypes {
    date: Date;
    dateInMilliseconds: number;
    datePrintOut: string;
}

export type AnyArray = any[];

export type AnyArrayOrNumber = AnyArray | number;

export type AnyObject = Record<StandardObjectProperty, any>;

export type CountOf<T> = OrArray<T> | number;

export type DateData = Date | Primitive;

export type FindMax = {
    <T>(array: T[]): T | null;
    <T extends AnyObject>(array: T[], property: keyof T): ValueOf<T> | null;
};

export type NestedArray<T> = T[][];

export type NestedObject<T> = Record<StandardObjectProperty, T>;

export type ObjectOf<T> = Record<keyof T, ValueOf<T>>;

export type PossibleString = string | undefined;

export type OrArray<T> = T | T[];

export type PossibleErrors = UnknownObject | TypeError | Error | string;

export type Primitive = string | number;

export type PrimitiveObject = Record<StandardObjectProperty, Primitive>;

export type StandardObjectProperty = Primitive | symbol;

export type UnknownArray = unknown[];

export type UnknownObject = Record<StandardObjectProperty, unknown>;

export type WholeOrPartial<T> = T | Partial<T>;

export type ValidatorMethod<T> = (object: unknown) => object is T | boolean;

export type ValueOf<T> = T[keyof T];

export const RestCallMethods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT'
} as const;

export type RestCallMethod = ValueOf<typeof RestCallMethods>;
