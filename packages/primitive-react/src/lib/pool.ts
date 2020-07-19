import { UniswapFactory, UniswapRouter, UniswapPair } from "@primitivefi/sdk";
import Stablecoin from "@primitivefi/contracts/deployments/rinkeby/USDC.json";
import { ethers } from "ethers";

const UniswapFactoryRinkeby = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

const getPair = async (providerOrSigner, optionAddr) => {
    const chainId = providerOrSigner._network.chainId;
    let poolAddr = ethers.constants.AddressZero;
    if (chainId.toString() == "rinkeby" || "4") {
        const uniFac = new UniswapFactory(
            UniswapFactoryRinkeby,
            providerOrSigner
        );
        poolAddr = await uniFac.getPair(optionAddr, Stablecoin.address);
    }

    return poolAddr;
};

const getPremium = async (provider, optionAddress) => {
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

const getPairData = async (provider, optionAddress) => {
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

const getOpenInterest = async (provider, optionAddress) => {
    const pairAddress = await getPair(provider, optionAddress);
    const pair = new UniswapPair(pairAddress, provider);
    const token0 = await pair.token0();
    const reserves = await pair.getReserves();
    let openInterest = 0;
    if (token0 == optionAddress) {
        openInterest = reserves._reserve0;
    } else {
        openInterest = reserves._reserve1;
    }

    return openInterest;
};

export { getPair, getPremium, getPairData, getOpenInterest };
