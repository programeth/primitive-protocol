import React, {
    FunctionComponent,
    useEffect,
    useState,
    useContext,
} from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import Row from "../../components/Row";
import Column from "../../components/Column";
import Card from "../../components/Card";
import CardHeader from "./CardHeader";
import CardItem from "./CardItem";
import LeftText from "../../components/LeftText";
import RightText from "../../components/RightText";
import { GasContext } from "../../contexts/GasContext";
import { PrimitiveContext } from "../../contexts/PrimitiveContext";
import { UniswapContext } from "../../contexts/UniswapContext";
import { PriceContext } from "../../contexts/PriceContext";
import { OrderContext } from "../../contexts/OrderContext";

const Wrapper = styled(Column)`
    margin: 0 auto 1em auto;
`;

const Summary = styled(Column)`
    padding: 1em;
`;

interface CartProps {
    cart: string[];
    submitOrder: Function;
}

const Cart: FunctionComponent<CartProps> = ({ /* cart, */ submitOrder }) => {
    const [priceData, setPriceData] = useContext(PriceContext);
    const [orderData, setOrderData] = useContext(OrderContext);
    const [gasData, setGasData] = useContext(GasContext);
    const [primitiveData, setPrimitiveData] = useContext(PrimitiveContext);
    const [totalGasCost, setTotalGasCost] = useState<any>();
    const [premium, setPremium] = useState<any>("");

    const calculateGasCost = async () => {
        let cost;
        if (gasData.gas) {
            cost = gasData?.gas?.fast / 10 ** 10;
            cost = cost * 100000;
            if (priceData) {
                cost = cost * +priceData.asset?.usd;
            }
        } else {
            cost = cost * 100000 * 250;
        }

        return cost;
    };

    useEffect(() => {
        async function calcGas() {
            const total = await calculateGasCost();
            setTotalGasCost(total);
        }
        calcGas();
    }, [orderData, gasData.isLoaded]);

    return (
        <Wrapper id="cart">
            <Card id="cart-card">
                <CardHeader>Your Order</CardHeader>
                {orderData?.cart.map((v, index) => (
                    <CardItem>
                        <Column id="card-item-details" style={{ width: "50%" }}>
                            <LeftText>
                                {orderData?.cart[index]
                                    .substr(0, 6)
                                    .concat("...")}
                            </LeftText>
                        </Column>
                        <Column
                            id="card-item-select"
                            style={{ width: "25%" }}
                        ></Column>
                        <Column id="card-item-remove" style={{ width: "25%" }}>
                            <RightText>
                                ${" "}
                                {orderData?.prices
                                    ? (+orderData?.prices?.premiums[v]).toFixed(
                                          2
                                      )
                                    : "..."}
                            </RightText>
                        </Column>
                    </CardItem>
                ))}

                <Summary id="cart-summary">
                    <Row>
                        <Column id="card-item-total" style={{ width: "50%" }}>
                            <LeftText>Premium</LeftText>
                        </Column>
                        <Column
                            id="card-item-total:price"
                            style={{ width: "50%" }}
                        >
                            <RightText>
                                ${" "}
                                {orderData?.prices
                                    ? (+orderData?.prices?.total).toFixed(2)
                                    : "..."}
                            </RightText>
                        </Column>
                    </Row>

                    <Row>
                        <Column id="card-item-gas" style={{ width: "50%" }}>
                            <LeftText>Gas</LeftText>
                        </Column>
                        <Column
                            id="card-item-gas:price"
                            style={{ width: "50%" }}
                        >
                            <RightText>
                                ${" "}
                                {totalGasCost
                                    ? (+totalGasCost).toFixed(2)
                                    : "..."}{" "}
                            </RightText>
                        </Column>
                    </Row>

                    <Row>
                        <Column
                            id="card-item-protocol"
                            style={{ width: "50%" }}
                        >
                            <LeftText>Protocol</LeftText>
                        </Column>
                        <Column
                            id="card-item-protocol:price"
                            style={{ width: "50%" }}
                        >
                            <RightText>$1.00</RightText>
                        </Column>
                    </Row>

                    <CardItem>
                        <Button
                            style={{
                                margin: "auto",
                                backgroundColor: "lightgreen",
                                color: "black",
                                borderColor: "lightgreen",
                            }}
                            onClick={() => submitOrder()}
                        >
                            Submit
                        </Button>
                    </CardItem>
                </Summary>
            </Card>
        </Wrapper>
    );
};

export default Cart;
