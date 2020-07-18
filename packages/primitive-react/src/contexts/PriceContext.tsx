import React, { createContext, useState } from "react";

const getPriceOf = (asset) => {
    let api = `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd&include_24hr_change=true`;
    let context = {
        asset: { usd: "", usd_24h_change: "" },
        isLoaded: false,
        error: null,
    };
    fetch(api)
        .then((res) => res.json())
        .then(
            (result) => {
                Object.assign(context, {
                    isLoaded: true,
                    asset: result[asset],
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                Object.assign(context, {
                    isLoaded: true,
                    error: error,
                });
                console.log(error);
            }
        );
    return context;
};

const PriceContext = createContext<any[]>([]);

const PriceProvider = (props) => {
    const [data, setData] = useState<any>(getPriceOf("ethereum"));

    const updatePrice = (asset) => {
        let updated = getPriceOf(asset);
        setData(updated);
    };

    return (
        <PriceContext.Provider value={[data, setData, getPriceOf, updatePrice]}>
            {props.children}
        </PriceContext.Provider>
    );
};

export { PriceContext, PriceProvider };
