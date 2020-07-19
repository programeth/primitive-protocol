import React, { createContext, useContext, useState, useEffect } from "react";
import ethers from "ethers";
import { UniswapProvider, UniswapContext } from "./UniswapContext";

const getOrder = () => {
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

const OrderContext = createContext<any[]>([]);

const OrderProvider = (props) => {
    const [, , , getPremium] = useContext(UniswapContext);
    const [orderData, setOrderData] = useState<any>();
    const [cart, setCart] = useState<string[]>([ethers.constants.AddressZero]);

    const addToCart = (option) => {
        setCart(cart.concat(option.toString()));
        setOrderData({ cart: cart });
    };

    const updateOrderContext = async () => {
        let prices = {};
        let premiums: any[] = [];
        let debit;
        for (let i = 0; i < cart.length; i++) {
            let premium = await getPremium(cart[i]);
            premiums[cart[i]] = premium;
            debit = debit + premium;
            Object.assign(prices, {
                premiums: premiums,
                total: debit,
            });
        }
        setOrderData({ prices, cart });
        return { prices, cart };
    };

    useEffect(() => {
        updateOrderContext();
    }, [orderData]);

    return (
        <OrderContext.Provider value={[orderData, setOrderData, addToCart]}>
            {props.children}
        </OrderContext.Provider>
    );
};

export { OrderContext, OrderProvider };
