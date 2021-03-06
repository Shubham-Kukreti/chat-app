import React, {useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'
import { useHistory } from 'react-router-dom'

let socket;

const connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

const Chat = ({location}) => {
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://react-chat-web-application.herokuapp.com/';
    
    const history = useHistory();

    useEffect(()=>{
        const { name, room } = queryString.parse(location.search)
        
        socket = io(ENDPOINT, connectionOptions);

        setName(name);
        setRoom(room);

        socket.emit('join',{ name, room}, (error) => {
            if(error) {
                alert(error);
                history.push("/");
            }
        });

        return () => {
            socket.disconnect();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
        });

    socket.on("roomData", ({ users }) => {
        setUsers(users);
      });
  }, []);
  

    const sendMessage = (e) => {
        e.preventDefault();
        
        if(message) {
            socket.emit('sendMessage', message , () => setMessage(''));
        }
    }

    console.log(message, messages)
    
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room =  {room}/>
                <Messages messages={messages} name = {name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat;