import React, { createContext } from "react";
import { GasProvider } from "./GasContext";
import { OrderProvider } from "./OrderContext";
import { PriceProvider } from "./PriceContext";
import { UniswapProvider } from "./UniswapContext";
import { PrimitiveProvider } from "./PrimitiveContext";

const MetaContext = createContext(false);

const MetaProvider = (props) => {
    return (
        <MetaContext.Provider value={true}>
            <PriceProvider>
                <GasProvider>
                    <PrimitiveProvider>
                        <UniswapProvider>
                            <OrderProvider>{props.children}</OrderProvider>
                        </UniswapProvider>
                    </PrimitiveProvider>
                </GasProvider>
            </PriceProvider>
        </MetaContext.Provider>
    );
};

export { MetaContext, MetaProvider };
