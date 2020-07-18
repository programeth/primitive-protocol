import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import Column from "../../components/Column";
import Card from "../../components/Card";
import CardHeader from "./CardHeader";
import CardItem from "./CardItem";
import LeftText from "../../components/LeftText";
import RightText from "../../components/RightText";

const Wrapper = styled(Column)`
    margin: 0 auto 1em auto;
`;

const Summary = styled(Column)`
    padding: 1em;
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
    children,
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
                            <LeftText>
                                {cart[index].substr(0, 6).concat("..")}
                            </LeftText>
                        </Column>
                        <Column
                            id="card-item-select"
                            style={{ width: "25%" }}
                        ></Column>
                        <Column id="card-item-remove" style={{ width: "25%" }}>
                            <RightText>$1.00</RightText>
                        </Column>
                    </CardItem>
                ))}

                <Summary id="positions-summary">{children}</Summary>
            </Card>
        </Wrapper>
    );
};

export default Positions;
