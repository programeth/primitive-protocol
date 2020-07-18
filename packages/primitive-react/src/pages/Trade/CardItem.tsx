import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Row from "../../components/Row";

const Wrapper = styled.div`
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
    children: any;
}

const CardItem: FunctionComponent<CardItemProps> = ({ children }) => {
    return (
        <Wrapper>
            <Row id="card-item-container" style={{ width: "100%" }}>
                {children}
            </Row>
        </Wrapper>
    );
};

export default CardItem;
