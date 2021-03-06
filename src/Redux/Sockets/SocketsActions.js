import SocketIOClient from 'socket.io-client';
import { push } from 'connected-react-router';
import * as types from './SocketsActionTypes';
import { pushFailure } from '../Notification/NotificationActions';
import ConfigHelper from '../../Helpers/ConfigHelper';

const connect = () => ({
  type: types.SOCKETS_CONNECTION.SUCCESS,
});

const error = errorMessage => ({
  type: types.SOCKETS_CONNECTION.FAILURE,
  payload: new Error(`Connection: ${errorMessage}`),
});

const newMessage = message => ({
  type: types.RECIEVE_MESSAGE,
  payload: message,
});

const newChat = chat => ({
  type: types.RECIEVE_NEW_CHAT,
  payload: { chat },
});

const deletedChat = chat => ({
  type: types.RECIEVE_DELETED_CHAT,
  payload: { chat },
});

const createSocket = (token, dispatch, getState) => {
  const socket = SocketIOClient(ConfigHelper.SOCKETS_URI, {
    query: { token },
  });

  socket.on('error', (errorMessage) => {
    dispatch(error(errorMessage));
    dispatch(pushFailure(errorMessage));
  });

  socket.on('connect_error', () => {
    const message = 'We have lost a connection :(';
    dispatch(error(message));
    dispatch(pushFailure(message));
  });

  socket.on('new-message', message => dispatch(newMessage(message)));

  socket.on('new-chat', ({ chat }) => dispatch(newChat(chat)));

  socket.on('deleted-chat', ({ chat }) => {
    const { activeId } = getState().chats;
    dispatch(deletedChat(chat));

    if (activeId === chat._id) {
      dispatch(push('/chat'));
    }
  });

  return socket;
};

let socket = null;
export const socketsConnect = () => (dispatch, getState) => {
  const state = getState();
  const { token } = state.auth;

  socket = createSocket(token, dispatch, getState);
  dispatch(connect());

  return Promise.resolve();
};

export const missingSocketConnection = () => ({
  type: types.SOCKETS_CONNECTION_MISSING,
  payload: new Error('Missing connection!'),
});

export const sendMessage = (chatId, message) => (dispatch, getState) => {
  const { activeId } = getState().chats;

  if (!socket) {
    dispatch(missingSocketConnection());
  }

  console.warn(`socket.emit('send-message', ${chatId});`);
  socket.emit(
    'send-message',
    {
      chatId,
      content: message,
    },
    () => {
      dispatch({
        type: types.SEND_MESSAGE,
        payload: {
          chatId: activeId,
          content: message,
        },
      });
    },
  );
};

export const mountChat = chatId => (dispatch) => {
  if (!socket) {
    dispatch(missingSocketConnection());
  }

  console.warn(`socket.emit('mount-chat', ${chatId});`);
  socket.emit('mount-chat', chatId);

  dispatch({
    type: types.MOUNT_CHAT,
    payload: { chatId },
  });
};

export const unmountChat = chatId => (dispatch) => {
  if (!socket) {
    dispatch(missingSocketConnection());
  }

  console.warn(`socket.emit('unmount-chat', ${chatId});`);
  socket.emit('unmount-chat', chatId);

  dispatch({
    type: types.UNMOUNT_CHAT,
    payload: { chatId },
  });
};
