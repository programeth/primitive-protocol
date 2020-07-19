import React, {
    FunctionComponent,
    useEffect,
    useState,
    useContext,
} from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styled from "styled-components";

import Page from "../../components/Page";
import H3 from "../../components/H3";
import TableRow from "./TableRow";
import Section from "../../components/Section";
import Cart from "./Cart";
import Loading from "../../components/Loading";

import ethers from "ethers";
import Header from "./Header";
import Row from "../../components/Row";
import Column from "../../components/Column";
import TableButtons from "./TableButtons";
import Positions from "./Positions";

import { getPremium, getOpenInterest } from "../../lib/pool";
import {
    safeMint,
    estimateGas,
    estimateMintGas,
    getOptionParameters,
} from "../../lib/option";
import { OrderContext } from "../../contexts/OrderContext";
import { PrimitiveContext } from "../../contexts/PrimitiveContext";

const TABLE_HEADERS = [
    "Strike",
    "Breakeven",
    "Open Interest",
    "Volume 24hr",
    "% Change 24hr",
    "Price",
];

const OPTIONS_ARRAY = ["0x6AFAC69a1402b810bDB5733430122264b7980b6b"];

type TradeProps = {
    web3?: any;
};

export type OrderDetails = {
    tokenId: number;
    orderAmount: number;
    isBuyOrder: boolean;
};

export const View = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    padding: 100px 16px 0 16px;
    margin: 0 auto;
    margin-right: 0;
`;

const Table = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 1em auto;
`;

const TableHeader = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 1em auto;
`;

const TableHeaderText = styled(H3)`
    text-transform: uppercase;
    color: "#212121";
    letter-spacing: 0.025em;
`;

const TradeView = styled(Row)`
    margin: 128px;
    @media (max-width: 375px) {
        margin: 48px auto;
    }
`;

const TableView = styled(Column)`
    width: 65%;
`;

const CartView = styled(Column)`
    width: 35%;
    display: flex;
    flex-direction: column;
`;

const Trade: FunctionComponent<TradeProps> = () => {
    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [isCall, setIsCall] = useState<boolean>(true);
    const [expiry, setExpiry] = useState<any>();
    const [gasSpend, setGasSpend] = useState<any>();
    const [orderData, setOrderData] = useContext(OrderContext);
    const [primitiveData, setPrimitiveData] = useContext(PrimitiveContext);

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42],
    });
    const web3React = useWeb3React();
    const provider = web3React.library || ethers.getDefaultProvider("rinkeby");

    const updateTable = (isBuy, isCall) => {
        setIsCall(isCall);
        setIsBuy(isBuy);
    };

    useEffect(() => {
        async function run() {
            await updatePrimitiveContext();
        }
        run();
    }, [web3React.library]);

    const submitOrder = async () => {
        try {
            let gas = await estimateMintGas(
                provider,
                "0x6AFAC69a1402b810bDB5733430122264b7980b6b",
                1
            );
            setGasSpend(gas.toString());
        } catch (err) {
            console.log(err);
        }
        try {
            await safeMint(
                provider,
                "0x6AFAC69a1402b810bDB5733430122264b7980b6b",
                1
            );
        } catch (err) {
            console.log(err);
        }
    };

    const updatePrimitiveContext = async () => {
        let newOptions = {};
        for (let i = 0; i < OPTIONS_ARRAY.length; i++) {
            let option = OPTIONS_ARRAY[i];
            let premium = await getPremium(provider, option);
            let openInterest = await getOpenInterest(provider, option);
            let params = await getOptionParameters(provider, option);
            Object.assign(newOptions, {
                [option]: {
                    premium: premium,
                    openInterest: openInterest,
                    params: params,
                },
            });
        }

        setPrimitiveData((prevState) => {
            return { ...prevState, options: newOptions };
        });
    };

    const updateOrderContext = async () => {
        let cart = orderData?.cart;
        let prices = {};
        let premiums = {};
        let debit;
        for (let i = 0; i < cart.length; i++) {
            let premium;
            try {
                premium = await getPremium(provider, cart[i]);
            } catch (err) {
                if (cart[i] != ethers.constants.AddressZero) {
                    console.log(err);
                }
                premium = 0;
            }
            premiums[cart[i]] = premium;
            debit = debit + premium;
        }
        Object.assign(prices, {
            premiums: premiums,
            total: debit,
        });
        setOrderData((prevState) => {
            return { ...prevState, prices: prices };
        });
    };

    useEffect(() => {
        const run = async () => {
            await updateOrderContext();
            await updatePrimitiveContext();
        };
        run();
        console.log(orderData, primitiveData);
    }, [orderData?.cart]);

    return (
        <Page web3React={web3React} injected={injected}>
            <TradeView id="trade-view">
                <TableView id="table-view">
                    <Header />

                    <Row
                        id="table-view-select-container"
                        style={{ width: "100%" }}
                    >
                        <Section
                            style={{
                                margin: "2em auto 2em 0",
                            }}
                        >
                            <TableButtons update={updateTable} />
                        </Section>
                    </Row>

                    <TableHeader id="table-header">
                        {TABLE_HEADERS.map((v) => (
                            <TableHeaderText style={{ width: "20%" }}>
                                {v}
                            </TableHeaderText>
                        ))}
                    </TableHeader>

                    <Table id="table">
                        {primitiveData ? (
                            OPTIONS_ARRAY.map((v) => <TableRow option={v} />)
                        ) : (
                            <Loading />
                        )}
                    </Table>
                </TableView>

                <CartView id="cart-position-view">
                    <Cart submitOrder={submitOrder} />

                    {/* <Positions
                                        cart={cart}
                                        submitOrder={submitOrder}
                                        gasSpend={gasSpend}
                                        ethPrice={"100"}
                                        total={totalDebit}
                                    /> */}
                </CartView>
            </TradeView>
        </Page>
    );
};

export default Trade;
