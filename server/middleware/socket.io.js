import User from '../models/user';

const disconnect = () => console.log('Socket IO disconnected');
const updateUserSocketID = async ({ userId: id, socketId: socket_id }) => {
  console.log(`Updating user socket: ${JSON.stringify({ userId: id, socketId: socket_id })}`)
  return await User.update({ socket_id }, {
    where: { id }
  });
};

module.exports = (io) => { 
  io.on("connect", (socket) => {
    console.log(`Socket IO connected: ${socket.id}`);
    socket.on('update-user-socket', updateUserSocketID);
    // socket.on('disconnect', disconnect);
  });
  return io;
}