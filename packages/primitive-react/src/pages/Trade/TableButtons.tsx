import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import Row from "../../components/Row";
import Button from "../../components/Button";
import Dropdown from "./Dropdown";

const PositionButtons = styled(Button)`
    color: ${(props) => (props.selected ? "lightgreen" : "lightgrey")};
    background-color: ${(props) => (props.selected ? "#181818" : "black")};
    border: none;
`;

const TableButtons: FunctionComponent<any> = ({ update }) => {
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
        <Row id="trade-selection-body" style={{ width: "100%" }}>
            <Row>
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
            <Row>
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
        </Row>
    );
};

export default TableButtons;
