import React, { useState } from 'react';
import axios from "axios";

const SendTransactionForm = () => {
    const [fromPrivateKey, setFromPrivateKey] = useState('');
    const [toPublicKey, setToPublicKey] = useState('');
    const [amount, setAmount] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(fromPrivateKey)
            const response = await axios.get(`http://localhost:8080/api/solana/send?fromPrivateKey=${fromPrivateKey}&&toPublicKey=${toPublicKey}&&amount=${amount}`);
            console.log(response);
           window.alert("Thanh toán thành công")
        } catch (error) {
            setResponse('Error: ' + error.message);
        }
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>From Private Key:</label>
                    <input type="text" value={fromPrivateKey} onChange={(e) => setFromPrivateKey(e.target.value)} required />
                </div>
                <div>
                    <label>To Public Key:</label>
                    <input type="text" value={toPublicKey} onChange={(e) => setToPublicKey(e.target.value)} required />
                </div>
                <div>
                    <label>Amount (Lamports):</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                </div>
                <button type="submit">Send Transaction</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default SendTransactionForm;
