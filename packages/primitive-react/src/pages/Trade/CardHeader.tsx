import React, { FunctionComponent, useState, useEffect } from "react";
import styled from "styled-components";
import Row from "../../components/Row";

const Select = styled.select`
    display: flex;
    width: 100%;
    height: auto;
    background-color: #212121;
    color: white;
    font-size: inherit;
    list-style: none;
    max-height: 30em;
    border: none;
    border-radius: 0.5em 0.5em 0 0;
    border-color: #212121;
    background-position: right 50%;
    background-repeat: no-repeat;
    border-bottom: solid thin #333333;
    cursor: pointer;
    padding: 1em;
`;

const Option = styled.option`
    cursor: pointer;
`;

interface CardHeaderProps {
    setExpiry?: Function;
}

const CardHeader: FunctionComponent<CardHeaderProps> = ({ children }) => {
    const [value, setValue] = useState<any>();
    useEffect(() => {}, [value]);
    return (
        <Row id="card-header">
            <Select id="order-dropdown" name="order" value={value}>
                <Option value="cart">{children}</Option>
            </Select>
        </Row>
    );
};

export default CardHeader;
