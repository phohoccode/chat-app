const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("Kết nối mới: ", socket.id);

    // listen to a connection 
    socket.on("addNewUser", (userId) => {
        const isExist = onlineUsers.some((user) => user.userId === userId)
        if (!isExist) {
            if (userId) {
                onlineUsers.push({
                    userId,
                    socketId: socket.id
                })
            }
        }

        console.log("Danh sách người dùng online", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    })

    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
        } else {
            console.log("Người dùng không online");
        }
    })

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        console.log("Danh sách người dùng online", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    })
});

io.listen(3000);