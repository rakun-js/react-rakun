import { isPromise, RakunFlux, RakunMono, WrappedValue_OPAQUE } from "rakun"
import { useCallback, useContext, useMemo, useState } from "react"
import { RakunSnapshotContext } from "./root"
import { Loadable } from "./types"

type UseRakunValueLoadable = {
    <T>(rakunSource: RakunMono<T>): Loadable<T|null>
    <T>(rakunSource: RakunFlux<T>): Loadable<T[]>

}


export const useRakunValueLoadable: UseRakunValueLoadable = <T>(rakunSource:RakunFlux<T>|RakunMono<T>) => {
    const context = useContext(RakunSnapshotContext)
    let setValueLoadable = (_: any)=> { }
    const loadHandler= useCallback(async (promise: Promise<T[] | null> | Promise<T | null> ) => {
        try {
            const contents= await promise
            setValueLoadable({
                state: "hasValue",
                contents: contents
            })
        } catch (error) {
            setValueLoadable({
                state: "hasError",
                contents: error
            })
        }
    }, [setValueLoadable]);
    const load = useCallback(():Loadable<T | T[] | null> => {
        try{
            let promiseOrValue:T | T[] | Promise<T[] | null> | Promise<T | null> | null = null
            if (rakunSource[WrappedValue_OPAQUE] == 'flux') {
                promiseOrValue= context.then(rakunSource)
                    .block();
            } else {
                promiseOrValue= context.then(rakunSource)
                    .blockFirst();
            }
            if(isPromise(promiseOrValue)){
                loadHandler(promiseOrValue)
                return{
                    state: 'loading',
                    contents: promiseOrValue.then((value)=>{

                        return value;
                    })
                }
            }else {
                return{
                    state: 'hasValue',
                    contents:promiseOrValue
                }
            }
        }catch(e){
            return{
                state: 'hasError',
                contents:e
            }
        }
    }, []);

    const [valueLoadable, _setValueLoadable] = useState<Loadable<any>>(() => load())
    setValueLoadable = _setValueLoadable
    return valueLoadable;
}



type UseRakun = {
    <T>(rakunMono: RakunMono<T>): RakunMono<T>
    <T>(rakunFlux: RakunFlux<T>): RakunFlux<T>

}
export const useRakun: UseRakun = (rakunSource) => {
    const context = useContext(RakunSnapshotContext)
    return useMemo<any>(() => {
        if (rakunSource[WrappedValue_OPAQUE] == 'flux') {
            return context.then(rakunSource);
        } else {
            return context.then(rakunSource);
        }
    }, [rakunSource]);
}
type UseRakunCallback = {
    <Args extends ReadonlyArray<unknown>, Source extends (RakunFlux<any> | RakunMono<any>)>(fn: (...args: Args) => Source): (...args: Args) => Source
}

export const useRakunCallback: UseRakunCallback = (fn) => {
    const context = useContext(RakunSnapshotContext)
    return useCallback((...args: any) => {
        return context.then(fn(...args));
    }, []);
}

type UseRakunValue = {
    <T>(rakunSource: RakunMono<T>): T
    <T>(rakunSource: RakunFlux<T>): T[]
}

export const useRakunValue: UseRakunValue = (rakunSource) => {
    const valueLoadable = useRakunValueLoadable(rakunSource as any);
    if (valueLoadable.state == "hasError")
        throw valueLoadable.contents
    else if (valueLoadable.state == "loading")
        throw valueLoadable.contents
    else
        throw valueLoadable.contents
}
