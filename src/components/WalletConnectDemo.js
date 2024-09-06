// src/WalletConnectDemo.js
import React, { useState, useEffect } from 'react';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

const WalletConnectDemo = () => {
    const [connector, setConnector] = useState(null);
    const [connected, setConnected] = useState(false);
    const [chainId, setChainId] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(() => {
        if (connector) {
            const handleConnect = (error, payload) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const { accounts, chainId } = payload.params[0];
                setSelectedAddress(accounts[0]);
                setChainId(chainId);
                setConnected(true);
            };

            const handleSessionUpdate = (error, payload) => {
                if (error) {
                    console.error(error);
                    return;
                }
                const { accounts, chainId } = payload.params[0];
                setSelectedAddress(accounts[0]);
                setChainId(chainId);
            };

            const handleDisconnect = (error) => {
                if (error) {
                    console.error(error);
                    return;
                }
                setSelectedAddress("");
                setChainId(1);
                setConnected(false);
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

    const disconnect = () => {
        if (connector) {
            connector.killSession();
        }
    };

    const sendTransaction = async () => {
        if (!connector || !selectedAddress) {
            alert("Connect wallet first");
            return;
        }

        const tx = {
            from: selectedAddress,
            to: document.querySelector("#to").value,
            data: "0x",
            gasPrice: "0x02540be400",
            gas: "0x9c40",
            value: String(document.querySelector("#amount").value * 10 ** 18),
        };

        try {
            await connector.sendTransaction(tx);
            alert("Transaction sent successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to send transaction");
        }
    };

    return (
        <div className="wallet-connect-demo">
            <div>
                <h1>WalletConnect Demo</h1>
                <button onClick={connect} disabled={connected}>Connect</button>
                <button onClick={disconnect} disabled={!connected}>Disconnect</button>
                <div>
                    <p>Selected Address: <span>{selectedAddress}</span></p>
                    <p>Chain ID: <span>{chainId}</span></p>
                </div>
            </div>

            <div>
                <h1>Send Transaction</h1>
                <div>
                    From: <input id="from" type="text" value={selectedAddress} disabled />
                </div>
                <div>
                    To: <input id="to" type="text" defaultValue="0x1da770d53eBe21c79cebD9cb0C9ce885BeD251DC" />
                </div>
                <div>
                    Amount: <input id="amount" type="number" />
                </div>
                <button onClick={sendTransaction}>Send Transaction</button>
            </div>
        </div>
    );
};

export default WalletConnectDemo;
