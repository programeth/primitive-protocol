import React, { createContext, useState, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { getOptionParameters } from "../lib/option";
import { ethers } from "ethers";

const OPTIONS_ARRAY = ["0x6AFAC69a1402b810bDB5733430122264b7980b6b"];
const PrimitiveContext = createContext<any[]>([]);

const PrimitiveProvider = (props) => {
    const web3React = useWeb3React();
    const provider = web3React?.library
        ? web3React.library
        : ethers.getDefaultProvider("rinkeby");
    const [parameters, setParameters] = useState<any>({});
    const [primitiveData, setPrimitiveData] = useState<any>({
        [OPTIONS_ARRAY[0]]: getOptionParameters(
            provider,
            OPTIONS_ARRAY[0]
        ).then((r) => {
            return r;
        }),
    });

    useEffect(() => {
        for (let i = 0; i < OPTIONS_ARRAY.length; i++) {
            getOptionParams(OPTIONS_ARRAY[i]);
        }
    }, [web3React.library, OPTIONS_ARRAY]);

    const getOptionParams = async (optionAddress) => {
        const params = await getOptionParameters(provider, optionAddress);
        setParameters(Object.assign(parameters, { optionAddress: params }));
        return params;
    };

    return (
        <PrimitiveContext.Provider
            value={[primitiveData, setPrimitiveData, getOptionParams]}
        >
            {props.children}
        </PrimitiveContext.Provider>
    );
};

export { PrimitiveContext, PrimitiveProvider };
