import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import Column from "../../components/Column";
import Row from "../../components/Row";
import H3 from "../../components/H3";
import H2 from "../../components/H2";
import Loading from "../../components/Loading";
import Button from "../../components/Button";
import Dropdown from "./Dropdown";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: calc(1248px + 16px * 2);
`;

const PositionButtons = styled(Button)`
    color: ${(props) => (props.selected ? "lightgreen" : "lightgrey")};
    background-color: ${(props) => (props.selected ? "#181818" : "black")};
    border: none;
`;

const Body: FunctionComponent<any> = ({ update }) => {
    const [isBuy, setIsBuy] = useState<boolean>(true);
    const [isCall, setIsCall] = useState<boolean>(true);

    const handleBuyChange = (state) => {
        setIsBuy(state);
        update(isBuy, isCall);
    };

    const handleCallChange = (state) => {
        setIsCall(state);
        update(isBuy, isCall);
    };

    return (
        <BodyContainer id="trade-selection-body">
            <Row style={{ width: "25%" }}>
                <PositionButtons
                    selected={isBuy}
                    onClick={() => handleBuyChange(true)}
                >
                    Buy
                </PositionButtons>
                <PositionButtons
                    selected={!isBuy}
                    onClick={() => handleBuyChange(false)}
                >
                    Sell
                </PositionButtons>
            </Row>
            <Row style={{ width: "25%" }}>
                <PositionButtons
                    selected={isCall}
                    onClick={() => handleCallChange(true)}
                >
                    Calls
                </PositionButtons>
                <PositionButtons
                    selected={!isCall}
                    onClick={() => handleCallChange(false)}
                >
                    Puts
                </PositionButtons>
            </Row>
            <Row style={{ width: "50%" }}>
                <Dropdown /* setExpiry={setExpiry} */ />
            </Row>
        </BodyContainer>
    );
};

export default Body;
