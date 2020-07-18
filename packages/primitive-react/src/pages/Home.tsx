import React, { FunctionComponent } from "react";
import Page from "../components/Page";
import styled from "styled-components";
import Button from "../components/Button";

type HomeProps = {
    title?: string;
    web3?: any;
};

export type OrderDetails = {
    tokenId: number;
    orderAmount: number;
    isBuyOrder: boolean;
};

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vmin;
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media (max-width: 375px) {
        flex-direction: column;
    }
    align-items: center;
    margin: 8px;
`;

export const H1 = styled.h1`
    font-size: 48px;
    font-weight: 600;
    text-decoration: none;
    color: #d9d9d9;
    text-align: center;
    align-self: center;
    padding: 4px;
    @media (max-width: 375px) {
        font-size: 24px;
    }
`;

export const Home: FunctionComponent<HomeProps> = ({ title, web3 }) => {
    return (
        <Page>
            <Column>
                <Row></Row>
                <Row>
                    <H1>The options market protocol.</H1>
                </Row>
                <Row>
                    <Button href="/trade" selected>
                        Testnet
                    </Button>

                    <Button href="https://docs.primitive.finance">Docs</Button>
                </Row>
            </Column>

            <Column style={{ backgroundColor: "#f9f9f9" }}>
                <H1 style={{ color: "#000000" }}>
                    Trade crypto options permissionlessly on Ethereum.
                </H1>
            </Column>
            <Column>
                <H1 style={{ color: "#f9f9f9" }}>Q4 2020</H1>
            </Column>

            <Column style={{ backgroundColor: "#f9f9f9" }}>
                <H1 style={{ color: "#000000" }}>Join our community.</H1>
                <Row>
                    <Button
                        href="https://discord.gg/rzRwJ4K"
                        style={{
                            borderColor: "#000000",
                            color: "#f9f9f9",
                            backgroundColor: "#000000",
                        }}
                    >
                        Discord
                    </Button>
                </Row>
            </Column>
        </Page>
    );
};
