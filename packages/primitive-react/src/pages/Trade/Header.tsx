import React, { FunctionComponent, useContext, useEffect } from "react";
import styled from "styled-components";
import Column from "../../components/Column";
import Row from "../../components/Row";
import H3 from "../../components/H3";
import H2 from "../../components/H2";
import Loading from "../../components/Loading";
import PriceContext from "./context/PriceContext";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";

const Header: FunctionComponent<any> = () => {
    const { ethereum, isLoaded } = useContext(PriceContext);

    const upGreen = (
        <TrendingUpIcon
            style={{
                color: "lightgreen",
            }}
        />
    );
    const downRed = (
        <TrendingDownIcon
            style={{
                color: "red",
            }}
        />
    );

    const up = ethereum ? (+ethereum?.usd_24h_change > 0 ? true : false) : true;
    const color = up ? "lightgreen" : "red";

    useEffect(() => {}, [ethereum]);

    return (
        <Row id="trade-view-header">
            <Column style={{ width: "25%" }}>
                <H2>Ether</H2>
                <H2>
                    {!isLoaded ? (
                        <Loading />
                    ) : (
                        "$" + (+ethereum?.usd).toFixed(2)
                    )}
                </H2>
                <Row>
                    {up ? upGreen : downRed}
                    <H3 color={color}>
                        {" "}
                        {!isLoaded ? (
                            <Loading />
                        ) : ethereum ? (
                            (+ethereum?.usd_24h_change).toFixed(2) + "%"
                        ) : (
                            <Loading />
                        )}
                    </H3>
                    <H3 color="grey">Today</H3>
                </Row>
            </Column>
        </Row>
    );
};

export default Header;
