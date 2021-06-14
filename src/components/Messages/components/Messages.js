import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);
const userName = 'User '+parseInt(Math.random()*10)

function Messages() {
  // const [playSend] = useSound(config.SEND_AUDIO_URL);
  // const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { messages, setLatestMessage } = useContext(LatestMessagesContext);
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  console.log(chat)

  useEffect(() => {
    socket.on('bot-message', message => {
      setChat([...chat, message])
    })
  })

  const sendMessage = (e) => {
    socket.emit('message',{userName,message})
    setMessage([...message, e.target.body])
  };

  function onChangeMessage(e) {
    setMessage(e.target.value);
  }
  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        <Message message={messages}></Message>
        <TypingMessage />
        <p className="messages__message messages__message--me">{message}</p>
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;
