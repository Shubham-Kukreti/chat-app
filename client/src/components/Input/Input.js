import React from 'react';

import './Input.css'

const Input = ({ message, setMessage, sendMessage }) => (
    <form action="" className="form">
        <input 
        type="text" 
        className="input"
        placeholder="Type a message..."
        value={message}
        onChange = {({target: {value} }) => setMessage(value)}
        onKeyPress= {e => e.key === 'Enter' ? sendMessage(e): null}
        />
        <button className="sendButton" onClick={e => sendMessage(e)} >Send</button>
    </form>
)

export default Input;