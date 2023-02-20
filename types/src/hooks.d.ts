import { RakunFlux, RakunMono } from "rakun";
import { Loadable } from "./types";
type UseRakunValueLoadable = {
    <T>(rakunSource: RakunMono<T>): Loadable<T | null>;
    <T>(rakunSource: RakunFlux<T>): Loadable<T[]>;
};
export declare const useRakunValueLoadable: UseRakunValueLoadable;
type UseRakun = {
    <T>(rakunMono: RakunMono<T>): RakunMono<T>;
    <T>(rakunFlux: RakunFlux<T>): RakunFlux<T>;
};
export declare const useRakun: UseRakun;
type UseRakunCallback = {
    <Args extends ReadonlyArray<unknown>, Source extends (RakunFlux<any> | RakunMono<any>)>(fn: (...args: Args) => Source): (...args: Args) => Source;
};
export declare const useRakunCallback: UseRakunCallback;
type UseRakunValue = {
    <T>(rakunSource: RakunMono<T>): T;
    <T>(rakunSource: RakunFlux<T>): T[];
};
export declare const useRakunValue: UseRakunValue;
export {};
