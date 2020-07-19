import React, { createContext, useContext, useState, useEffect } from "react";
import ethers from "ethers";
import { UniswapProvider, UniswapContext } from "./UniswapContext";

const OrderContext = createContext<any[]>([]);

const OrderProvider = (props) => {
    const [, , , getPremium] = useContext(UniswapContext);
    const [cart, setCart] = useState<string[]>([ethers.constants.AddressZero]);
    const [asset, setAsset] = useState("ethreum");
    const [orderData, setOrderData] = useState<any>({
        cart: cart,
        asset: asset,
        orderTypes: {},
    });

    const addToCart = (option, orderType) => {
        setCart(cart.concat(option.toString()));
        setOrderData((prevState) => {
            return {
                ...prevState,
                cart: cart,
                orderTypes: {
                    [option]: {
                        isBuy: orderType.isBuy,
                        isCall: orderType.isCall,
                    },
                },
            };
        });
    };

    const handleAssetChange = (newAsset) => {
        setAsset(newAsset);
        setOrderData((prevState) => {
            return { ...prevState, asset: newAsset };
        });
    };

    return (
        <OrderContext.Provider value={[orderData, setOrderData, addToCart]}>
            {props.children}
        </OrderContext.Provider>
    );
};

export { OrderContext, OrderProvider };
