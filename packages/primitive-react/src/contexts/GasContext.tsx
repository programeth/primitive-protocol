import React, { createContext, useState } from "react";

const getGas = () => {
    const gasPriceApi = `https://ethgasstation.info/api/ethgasAPI.json`;
    let context = {
        gas: null,
        isLoaded: false,
        error: null,
    };
    fetch(gasPriceApi)
        .then((res) => res.json())
        .then(
            (result) => {
                Object.assign(context, {
                    isLoaded: true,
                    gas: result,
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
            }
        );
    return context;
};

const GasContext = createContext<any[]>([]);

const GasProvider = (props) => {
    const [gasData, setGasData] = useState<any>(getGas());

    const updateGas = () => {
        let updated = getGas();
        setGasData(updated);
    };

    return (
        <GasContext.Provider value={[gasData, setGasData, getGas, updateGas]}>
            {props.children}
        </GasContext.Provider>
    );
};

export { GasContext, GasProvider };
