import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import H1 from "../../components/H1";
import H2 from "../../components/H2";
import H3 from "../../components/H3";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Column from "../../components/Column";
import Card from "./Card";
import CardHeader from "./CardHeader";
import CardItem from "./CardItem";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    width: auto;
    margin: 0 auto 1em auto;
`;

const Summary = styled(Column)`
    padding: 1em;
`;

const Left = styled(H3)`
    display: flex;
    justify-content: flex-start;
    font-size: 1em;
    font-weight: 700;
    color: white;
`;

const Right = styled(H3)`
    display: flex;
    justify-content: flex-end;
`;

interface PositionsProps {
    cart: string[];
    submitOrder: Function;
    gasSpend?: string;
    ethPrice?: string;
    total?: string;
}

const gasPriceApi = `https://ethgasstation.info/api/ethgasAPI.json`;

const Positions: FunctionComponent<PositionsProps> = ({
    cart,
    submitOrder,
    gasSpend,
    ethPrice,
    total,
}) => {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [gas, setGas] = useState<any>();
    const [totalGasCost, setTotalGasCost] = useState<any>();
    const [premium, setPremium] = useState<any>("");

    const calculateGasCost = async () => {
        let cost;
        if (gas) {
            cost = gas / 10 ** 9;
            if (gasSpend) {
                cost = cost * +gasSpend;
                if (ethPrice) {
                    cost = cost * +ethPrice;
                    console.log(cost);
                }
            } else {
                cost = cost * 100000 * 250;
            }
        }
        return cost;
    };

    useEffect(() => {
        async function calcGas() {
            const total = await calculateGasCost();
            setTotalGasCost(total);
        }
        calcGas();
    });

    useEffect(() => {
        fetch(gasPriceApi)
            .then((res) => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setGas(result.fast / 10);
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
    }, [cart]);
    return (
        <Wrapper id="positions">
            <Card>
                <CardHeader>Your Positions</CardHeader>
                {cart.map((v, index) => (
                    <CardItem>
                        <Column id="card-item-details" style={{ width: "50%" }}>
                            <Left>{cart[index].substr(0, 6).concat("..")}</Left>
                        </Column>
                        <Column
                            id="card-item-select"
                            style={{ width: "25%" }}
                        ></Column>
                        <Column id="card-item-remove" style={{ width: "25%" }}>
                            <Right>$1.00</Right>
                        </Column>
                    </CardItem>
                ))}

                <Summary id="positions-summary"></Summary>
            </Card>
        </Wrapper>
    );
};

export default Positions;
