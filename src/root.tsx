import { mono } from "rakun";
import React, { useContext, useMemo } from "react";
import { RakunRootContext, RakunRootProps } from "./types";

export const RakunSnapshotContext = React.createContext<RakunRootContext>(mono.then());
export const RakunRoot = (props: RakunRootProps) => {
    const contextOld = useContext(RakunSnapshotContext);
    const value = props.value
    const context = useMemo(() => {
        return contextOld.then(value);
    }, [value, contextOld])
    return (
        <RakunSnapshotContext.Provider value={context}>
            {props.children}
        </RakunSnapshotContext.Provider>
    );

}