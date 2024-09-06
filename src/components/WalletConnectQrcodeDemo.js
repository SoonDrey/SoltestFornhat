import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import React, { useState, useEffect } from 'react';

const WalletConnectQrcodeDemo = () => {
    const [connector, setConnector] = useState(null);
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        if (connector) {
            const handleConnect = (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts, chainId } = payload.params[0];
                setSelectedAddress(accounts[0]);
                setChainId(chainId);
            };

            const handleSessionUpdate = (error, payload) => {
                if (error) {
                    throw error;
                }
                const { accounts, chainId } = payload.params[0];
                setSelectedAddress(accounts[0]);
                setChainId(chainId);
            };

            const handleDisconnect = (error, payload) => {
                if (error) {
                    throw error;
                }
                setSelectedAddress("");
                setChainId(1);
            };

            connector.on("connect", handleConnect);
            connector.on("session_update", handleSessionUpdate);
            connector.on("disconnect", handleDisconnect);

            return () => {
                connector.off("connect", handleConnect);
                connector.off("session_update", handleSessionUpdate);
                connector.off("disconnect", handleDisconnect);
            };
        }
    }, [connector]);

    const connect = async () => {
        const bridge = "https://bridge.walletconnect.org";
        const newConnector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });

        if (!newConnector.connected) {
            await newConnector.createSession();
        } else {
            const { chainId, accounts } = newConnector;
            setSelectedAddress(accounts[0]);
            setChainId(chainId);
        }
        setConnector(newConnector);
    };

    const disconnected = () => {
        if (connector) {
            connector.killSession();
            setSelectedAddress("");
            setChainId(1);
        }
    };

    const sendTransaction = async () => {
        const tx = {
            from: selectedAddress,
            to: document.querySelector("#to").value,
            data: "0x",
            gasPrice: "0x02540be400",
            gas: "0x9c40",
            value: String(document.querySelector("#amount").value * 10 ** 18),
        };

        return connector.sendTransaction(tx);
    };

    return (
        <div className="testdemo">
            <div>
                <h1>connect</h1>
                <button disabled={!!selectedAddress} onClick={connect}>connect</button>
                <button onClick={disconnected}>disconnected</button>
                <div>
                    selectedAddress: <span id="account">{selectedAddress}</span>
                </div>
                <div>
                    chainId : <span id="chainId">{chainId}</span>
                </div>
            </div>

            <div>
                <h1>transfer EVM</h1>
                from:
                <input id="from" type="text" value={selectedAddress} disabled />
                to:
                <input id="to" type="text" defaultValue="0x1da770d53eBe21c79cebD9cb0C9ce885BeD251DC" />
                amount:
                <input id="amount" type="number" />
                <button onClick={sendTransaction}>sendTransaction</button>
            </div>
        </div>
    );
};

export default WalletConnectQrcodeDemo;
