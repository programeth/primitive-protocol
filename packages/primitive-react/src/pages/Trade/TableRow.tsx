import React, {
    FunctionComponent,
    useEffect,
    useState,
    useContext,
} from "react";
import styled from "styled-components";
import H3 from "../../components/H3";
import Button from "../../components/Button";
import { formatEther } from "ethers/utils";
import Loading from "../../components/Loading";
import Row from "../../components/Row";
import { OrderContext } from "../../contexts/OrderContext";
import { PrimitiveContext } from "../../contexts/PrimitiveContext";

const Add = styled(Button)`
    border-radius: 720px;
    border-color: #212121;
    color: lightgreen;
    width: 1em;
    height: 1em;
    min-width: 0;
    min-height: 0;
    align-items: center;
    font-weight: 1000;
    margin: auto;
    padding: 8px;
    :hover {
        background-color: #f9f9f9;
        color: #000000;
    }
`;

const Item = styled.div`
    width: 100%;
    height: 10vmin;
    display: flex;
    align-items: center;
    border-top: ${(props) => (props.border ? "solid 0.1em #212121" : "none")};
`;

const TRow = styled(Row)`
    border-bottom: solid 0.1em #212121;
`;

const TableRow: FunctionComponent<any> = ({ option, isBuy }) => {
    const [tableItems, setTableItems] = useState<any>();
    const [orderData, setOrderData, addToCart] = useContext(OrderContext);
    const [primitiveData, setPrimitiveData] = useContext(PrimitiveContext);

    useEffect(() => {
        let table = ["...", "...", "...", "...", "...", "..."];
        let data = primitiveData?.options[option];
        if (data) {
            let strike = data.params ? formatEther(data.params?._quote) : "...";
            let breakeven = +data.premium + +strike;
            let openInterest = formatEther(data.openInterest);
            table = [
                `$ ${(+strike).toFixed(2)}`,
                `$ ${(+breakeven).toFixed(2)}`,
                `${(+openInterest).toFixed(2)}`,
                "$ ...",
                "... %",
            ];
        }
        setTableItems(table);
    }, [primitiveData]);

    return (
        <TRow id="table-row">
            {tableItems ? (
                tableItems.map((v, index) => (
                    <Item id={index} border>
                        <H3>{v}</H3>
                    </Item>
                ))
            ) : (
                <Loading />
            )}
            <Item>
                <Item onClick={() => addToCart(option, { isBuy })} border>
                    <H3>
                        ${" "}
                        {primitiveData?.options[option] ? (
                            (primitiveData?.options[option]?.premium).toFixed(2)
                        ) : (
                            <Loading />
                        )}
                    </H3>
                    <Add onClick={() => addToCart(option, { isBuy })}>+</Add>
                </Item>
            </Item>
        </TRow>
    );
};

export default TableRow;
