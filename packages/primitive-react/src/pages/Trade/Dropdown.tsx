import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";

const Select = styled.select`
    display: flex;
    height: auto;
    background-color: black;
    color: white;
    font-size: inherit;
    list-style: none;
    margin: 0;
    max-height: 30em;
    padding: 0 1em;
    border-radius: 0.5em;
    border-color: #212121;
    background-position: right 50%;
    background-repeat: no-repeat;
    cursor: pointer;
    width: 16em;
`;

const Option = styled.option`
    cursor: pointer;
`;

interface DropdownProps {
    setExpiry?: Function;
}

const Dropdown: FunctionComponent<DropdownProps> = ({ setExpiry }) => {
    const [value, setValue] = useState<any>();
    useEffect(() => {}, [value]);
    return (
        <Select
            id="dropdown"
            name="expirations"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                if (setExpiry) setExpiry(e.target.value);
            }}
        >
            <Option value="july">July</Option>
            <Option value="august">August</Option>
            <Option value="september">September</Option>
            <Option value="october">October</Option>
        </Select>
    );
};

export default Dropdown;
