import React, { FunctionComponent, useEffect, useState } from "react";
import Page from "../../components/Page";
import Button from "../../components/Button";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import TableRow from "./TableRow";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Section from "../../components/Section";
import Dropdown from "./Dropdown";
import Cart from "./Cart";
import Loading from "../../components/Loading";
import {
    safeMint,
    estimateGas,
    estimateMintGas,
    getOptionParameters,
} from "../../lib/option";
import ethers from "ethers";
import Header from "./Header";
import Row from "../../components/Row";
import Column from "../../components/Column";
import TableButtons from "./TableButtons";
import PriceContext from "./context/PriceContext";
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
import { getPair } from "../../lib/pool";
import Positions from "./Positions";

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

const ethPriceApi =
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true";

const Trade: FunctionComponent<TradeProps> = () => {
    const [cart, setCart] = useState<string[]>([ethers.constants.AddressZero]);
    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [isCall, setIsCall] = useState<boolean>(true);
    const [expiry, setExpiry] = useState<any>();
    const [gasSpend, setGasSpend] = useState<any>();
    const [parameters, setParameters] = useState<any>();
    const [tableData, setTableData] = useState<any>();
    const [totalDebit, setTotalDebit] = useState<any>();

    const injected = new InjectedConnector({
        supportedChainIds: [1, 3, 4, 5, 42],
    });
    const web3React = useWeb3React();

    const addToCart = (option) => {
        setCart(cart.concat(option.toString()));
    };

    const getTotalDebit = async () => {
        let premiums: any[] = [];
        let debit;
        for (let i = 0; i < cart.length; i++) {
            let premium = await getPremium(cart[i]);
            premiums[i] = premium;
            debit = debit + premium;
        }

        return { premiums, debit };
    };

    useEffect(() => {
        async function calcPremium() {
            if (web3React.library) {
                const total = await getTotalDebit();
                setTotalDebit(total);
            }
        }
        calcPremium();
    }, [cart]);

    const update = (isBuy, isCall) => {
        setIsCall(isCall);
        setIsBuy(isBuy);
    };

    const submitOrder = async () => {
        console.log("Submitting order for: ");
        cart.map((v) => console.log({ v }));
        const provider: ethers.providers.Web3Provider = web3React.library;
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

    const tableHeaders = [
        "Strike",
        "Breakeven",
        "Open Interest",
        "Volume 24hr",
        "% Change 24hr",
        "Price",
    ];

    const options = ["0x6AFAC69a1402b810bDB5733430122264b7980b6b"];
    const getTable = async () => {
        let data = {};
        for (let i = 0; i < options.length; i++) {
            let table = await getTableData(options[i]);
            data[i] = table;
        }
        return data;
    };

    useEffect(() => {
        async function updateParams() {
            if (web3React.library) {
                const provider: ethers.providers.Web3Provider =
                    web3React.library;
                let params = await getOptionParameters(
                    provider,
                    "0x6AFAC69a1402b810bDB5733430122264b7980b6b"
                );
                setParameters(params);
                let data = await getTable();
                setTableData(data);
            }
        }
        updateParams();
    }, [web3React.library]);

    const getPremium = async (optionAddress) => {
        const provider = web3React.library;
        const pairAddress = await getPair(web3React.library, optionAddress);
        // need price to calc premium + breakeven, total liquidity for option, volume
        const pair = new UniswapPair(pairAddress, await provider.getSigner());
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

    const getPairData = async () => {
        const optionAddress = "0x6AFAC69a1402b810bDB5733430122264b7980b6b";
        const provider = web3React.library;
        const pairAddress = await getPair(web3React.library, optionAddress);
        // need price to calc premium + breakeven, total liquidity for option, volume
        const pair = new UniswapPair(pairAddress, await provider.getSigner());
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

    const getPriceData = () => {
        return ethereum ? ethereum?.usd : "...";
    };

    const getOptionParams = async (optionAddress) => {
        const provider = web3React.library;
        const params = await getOptionParameters(provider, optionAddress);
        return params;
    };

    const getTableData = async (optionAddress) => {
        let params = await getOptionParams(optionAddress);
        let price = getPriceData();
        let pair = await getPairData();
        return { params, price, pair };
    };

    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [ethereum, setEthereum] = useState<any>();

    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
        fetch(ethPriceApi)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setEthereum(result.ethereum);
                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                    console.log(isLoaded);
                }
            );
    }, []);

    const testFunc = async () => {
        if (web3React.library) {
            const signer = await web3React.library.getSigner();
            const trader = new Trader(TraderDeployed.address, signer);

            const optionAddr = "0x6AFAC69a1402b810bDB5733430122264b7980b6b";
            const option = new Option(optionAddr, signer);

            const uniFac = new UniswapFactory(
                "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
                signer
            );

            const uniRoutAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
            const uniRout = new UniswapRouter(uniRoutAddr, signer);
            const stablecoin = new Token(Stablecoin.address, signer);
            const optionToken = new Token(optionAddr, signer);
            const underlyingToken = new Token(Ether.address, signer);
            const poolAddr = await uniFac.getPair(
                optionAddr,
                Stablecoin.address
            );

            /* try {
                await stablecoin.approve(uniRoutAddr, parseEther("10000000"));
                await optionToken.approve(uniRoutAddr, parseEther("10000000"));
                console.log(
                    await signer.getAddress(),
                    (
                        await underlyingToken.balanceOf(
                            await signer.getAddress()
                        )
                    ).toString()
                );
                await underlyingToken.approve(
                    uniRoutAddr,
                    parseEther("10000000")
                );
                await trader.safeMint(
                    optionAddr,
                    parseEther("5000"),
                    await signer.getAddress()
                );
                console.log(
                    (
                        await option.balanceOf(await signer.getAddress())
                    ).toString()
                );
                await uniRout.addLiquidity(
                    optionAddr,
                    Stablecoin.address,
                    parseEther("5000"),
                    parseEther("5000"),
                    1,
                    1,
                    await signer.getAddress(),
                    +new Date() + 1000000
                );
            } catch (err) {
                console.log(err);
            } */
        }
    };

    return (
        <Page web3React={web3React} injected={injected}>
            <TradeView id="trade-view">
                <PriceContext.Provider value={{ ethereum, isLoaded, error }} />

                <div id="contexts"> </div>

                <TableView id="table-view">
                    <Header />

                    <Row
                        id="table-view-select-container"
                        style={{ width: "100%" }}
                    >
                        <Section style={{ margin: "2em auto 2em 0" }}>
                            <TableButtons update={update} />
                        </Section>
                    </Row>

                    <TableHeader id="table-header">
                        {tableHeaders.map((v) => (
                            <TableHeaderText style={{ width: "20%" }}>
                                {v}
                            </TableHeaderText>
                        ))}
                    </TableHeader>

                    <Table id="table">
                        {tableData ? (
                            options.map((v, i) => (
                                <TableRow
                                    option={v}
                                    addToCart={addToCart}
                                    data={tableData[i]}
                                />
                            ))
                        ) : (
                            <Loading />
                        )}
                    </Table>
                </TableView>

                <CartView id="cart-position-view">
                    <Cart
                        cart={cart}
                        submitOrder={submitOrder}
                        gasSpend={gasSpend}
                        ethPrice={ethereum?.usd}
                        total={totalDebit}
                    />

                    <Positions
                        cart={cart}
                        submitOrder={submitOrder}
                        gasSpend={gasSpend}
                        ethPrice={ethereum?.usd}
                        total={totalDebit}
                    />
                </CartView>
            </TradeView>
        </Page>
    );
};

export default Trade;
