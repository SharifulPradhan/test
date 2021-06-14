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
const user = 'User ' + parseInt(Math.random() * 10)

function Messages() {
  // const [playSend] = useSound(config.SEND_AUDIO_URL);
  // const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { messages, setLatestMessage } = useContext(LatestMessagesContext);
  const [botChat, setBotChat] = useState([]);

  useEffect(() => {
    socket.on('message', payload => {
      setBotChat([...botChat, payload])
    })
  })

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(messages);
    socket.emit('message', { user, messages })
    setLatestMessage('');
  }

  const onChangeMessage = e => {
    setLatestMessage({user: user, message: e.target.value});
  }
  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        <Message message={messages}></Message>
        <TypingMessage></TypingMessage>
      </div>
      <Footer message={messages} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;
