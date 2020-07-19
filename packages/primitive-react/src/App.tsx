import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";
import ethers from "ethers";
import styled from "styled-components";
import GlobalStyle from "./global-styles";

// == Context ==
import { MetaProvider } from "./contexts/MetaContext";

// == Pages ==
import Trade from "./pages/Trade";
import { Home } from "./pages/Home";
import { Otc } from "./pages/Otc";
import { Typeform } from "./pages/Typeform";

function getLibrary(provider, connector) {
    return new ethers.providers.Web3Provider(provider);
}

export interface IConnected {
    web3: Web3;
    address: string;
    networkId: number;
    chainId: number;
}

const Container = styled.div`
    margin: 0 auto;
    display: flex;
    min-height: 100%;
    flex-direction: column;
`;

function App() {
    return (
        <Container className="App">
            <Web3ReactProvider getLibrary={getLibrary}>
                <MetaProvider>
                    <Router>
                        <Switch>
                            <Route exact path="/" component={Home} />
                        </Switch>

                        <Switch>
                            <Route path="/trade" component={Trade} />
                        </Switch>

                        <Switch>
                            <Route path="/test" component={Typeform} />
                        </Switch>

                        <Switch>
                            <Route path="/otc" component={Otc} />
                        </Switch>
                    </Router>
                </MetaProvider>
            </Web3ReactProvider>
            <GlobalStyle />
        </Container>
    );
}

export default App;
