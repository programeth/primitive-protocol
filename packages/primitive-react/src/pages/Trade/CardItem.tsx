import React, {
    FunctionComponent,
    useEffect,
    useState,
    useContext,
} from "react";
import styled from "styled-components";
import Row from "../../components/Row";
import { PrimitiveContext } from "../../contexts/PrimitiveContext";
import { formatEther } from "ethers/utils";
import LeftText from "../../components/LeftText";
import RightText from "../../components/RightText";
import Column from "../../components/Column";
import H3 from "../../components/H3";

export const CardItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    background-color: #212121;
    color: white;
    font-size: inherit;
    list-style: none;
    max-height: 30em;
    border: none;
    border-color: #212121;
    border-bottom: solid thin #333333;
    padding: 1em;
`;

interface CardItemProps {
    option?: string;
}

const CardItem: FunctionComponent<CardItemProps> = ({ option }) => {
    const [cartItem, setCartItem] = useState<any>();
    const [primitiveData, setPrimitiveData] = useContext(PrimitiveContext);

    useEffect(() => {
        if (option) {
            let item = {};
            let data = primitiveData?.options[option];
            if (data) {
                let strike = data.params
                    ? (+formatEther(data.params?._quote)).toFixed(2)
                    : "...";
                let breakeven = +data.premium + +strike;
                let expiration = new Date(+data.params._expiry * 1000);
                let month = expiration.getMonth();
                let day = expiration.getDay();
                item = {
                    strike,
                    month,
                    day,
                };
            }
            setCartItem(item);
        }
    }, [primitiveData]);

    return (
        <CardItemWrapper>
            <Row id="card-item-container" style={{ width: "100%" }}>
                <Column id="card-item-details" style={{ width: "50%" }}>
                    <Row>
                        <LeftText>
                            {cartItem ? "$" + cartItem.strike : "..."}
                        </LeftText>
                        <LeftText>
                            {cartItem
                                ? cartItem?.isCall
                                    ? " Call"
                                    : "Put"
                                : "..."}
                        </LeftText>
                    </Row>

                    <Row>
                        <LeftText
                            style={{
                                color: "green",
                            }}
                        >
                            Buy
                        </LeftText>
                        <LeftText
                            style={{
                                fontWeight: 600,
                                color: "grey",
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            {cartItem
                                ? cartItem.month + "/" + cartItem.day
                                : "..."}
                            {" EXP"}
                        </LeftText>
                    </Row>
                </Column>
                <Column id="card-item-select" style={{ width: "25%" }}></Column>
                <Column id="card-item-remove" style={{ width: "25%" }}>
                    <RightText>$ {"..."}</RightText>
                </Column>
            </Row>
        </CardItemWrapper>
    );
};

export default CardItem;
