const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const NEW_CARD_ACTION_EVENT = 'newCardAction';
const CARD_ACTION = {
  REVEAL: 'reveal',
  HIDE: 'hide',
  DEAL: 'deal',
};
const CARD_VISIBILITY = {
  HIDDEN: 0,
  SHOWN: 1,
  REVEALED: 2,
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const getRandomLetter = () => {
  let index = Math.floor(Math.random() * 26);
  return LETTERS[index];
}

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    console.log(NEW_CHAT_MESSAGE_EVENT + ': ');
    console.log(data);  
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on(NEW_CARD_ACTION_EVENT, (data) => {
    console.log(NEW_CARD_ACTION_EVENT + ': ');
    console.log(data);
    switch(data.action) {
      case CARD_ACTION.DEAL:
        console.log(data);
        console.log('deal');
        for (let i = 0; i < data.quantity; i++) {
          const card = {
            letter: getRandomLetter(),
            visibility: CARD_VISIBILITY.REVEALED,
          }
  
          io.in(roomId).emit(NEW_CARD_ACTION_EVENT, card);
        }

        break;
    }
    // io.in(roomId).emit(NEW_CARD_ACTION_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
