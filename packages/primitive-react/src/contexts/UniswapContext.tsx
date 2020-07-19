import React, { createContext, useState, useContext, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
    Trader,
    Option,
    UniswapFactory,
    UniswapRouter,
    UniswapPair,
    Token,
} from "@primitivefi/sdk";
import TraderDeployed from "@primitivefi/contracts/deployments/rinkeby/Trader.json";
import Stablecoin from "@primitivefi/contracts/deployments/rinkeby/USDC.json";
import Ether from "@primitivefi/contracts/deployments/rinkeby/ETH.json";
import { parseEther } from "ethers/utils";
import { getOptionParameters } from "../lib/option";
import { ethers } from "ethers";
import { getPair } from "../lib/pool";

const OPTIONS_ARRAY = ["0x6AFAC69a1402b810bDB5733430122264b7980b6b"];

const UniswapContext = createContext<any[]>([]);

const UniswapProvider = (props) => {
    const web3React = useWeb3React();
    const provider = web3React?.library
        ? web3React.library
        : ethers.getDefaultProvider("rinkeby");
    const [parameters, setParameters] = useState<any>({});
    const [uniswapData, setUniswapData] = useState<any>();

    const getPremium = async (optionAddress) => {
        const pairAddress = await getPair(provider, optionAddress);
        // need price to calc premium + breakeven, total liquidity for option, volume
        const pair = new UniswapPair(pairAddress, provider);
        const token0 = await pair.token0();
        const reserves = await pair.getReserves();
        let premium = 0;

        if (token0 == optionAddress) {
            premium = await pair.price0CumulativeLast();
        } else {
            premium = await pair.price1CumulativeLast();
        }

        if (premium == 0) {
            premium = reserves._reserve0 / reserves._reserve1;
        }
        return premium;
    };

    async function updateUniswapContext() {
        setUniswapData(await getPairData());
    }

    useEffect(() => {
        updateUniswapContext();
    }, []);

    const getPairData = async () => {
        const optionAddress = "0x6AFAC69a1402b810bDB5733430122264b7980b6b";
        const pairAddress = await getPair(provider, optionAddress);
        // need price to calc premium + breakeven, total liquidity for option, volume
        const pair = new UniswapPair(pairAddress, provider);
        const token0 = await pair.token0();
        const reserves = await pair.getReserves();
        let premium = 0;
        let openInterest = 0;
        if (token0 == optionAddress) {
            premium = await pair.price0CumulativeLast();
            openInterest = reserves._reserve0;
        } else {
            premium = await pair.price1CumulativeLast();
            openInterest = reserves._reserve1;
        }

        if (premium == 0) {
            premium = reserves._reserve0 / reserves._reserve1;
        }
        return { premium, openInterest };
    };

    return (
        <UniswapContext.Provider
            value={[uniswapData, setUniswapData, getPairData, getPremium]}
        >
            {props.children}
        </UniswapContext.Provider>
    );
};

export { UniswapContext, UniswapProvider };
