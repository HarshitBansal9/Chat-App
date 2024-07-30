"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const uuid_1 = require("uuid");
class Chat {
    userId;
    //create a new uui
    async createUUID() {
        const uuid = await (0, uuid_1.v4)();
        return uuid;
    }
    //Getting all users chats
    async getChats() {
        database_1.db.selectFrom("chat_participants as cp")
            .selectAll()
            .innerJoin("users as u", "u.auth_user_id", "cp.user_id")
            .innerJoin("chats as c", "c.chat_id", "cp.chat_id")
            .leftJoin("messages as m", "m.message_id", "c.last_message_id")
            .where("cp.chat_id", "in", database_1.db
            .selectFrom(["chat_participants", "chats"])
            .select("chats.chat_id")
            .where("chats.chat_id", "=", "chat_participants.chat_id")
            .where("chat_participants.user_id", "=", this.userId))
            .execute();
    }
    //Sending a chat message
    async sendChatMessage(message) {
        const { chatId, messageText, timestamp, imageUrl } = message;
        const messageId = await database_1.db
            .insertInto("messages")
            .columns(["chat_id", "sender_id", "message_text", "sent_at", "image_url"])
            .returning("message_id")
            .values([chatId, this.userId, messageText, timestamp, imageUrl])
            .execute();
    }
    //getting all chat messages
    async getChatMessages() {
        const messages = await database_1.db
            .selectFrom("chat_participants as cp")
            .innerJoin("messages as m", "cp.chat_id", "m.chat_id")
            .innerJoin("users as u", "m.sender_id", "u.auth_user_id")
            .select([
            "cp.chat_id",
            "m.message_text",
            "m.sender_id",
            "m.sent_at",
            "m.image_url as message_image_url",
            "u.username",
            "u.image_url as sender_image",
        ])
            .where("cp.user_id", "=", this.userId)
            .orderBy("m.sent_at", "desc")
            .execute();
        return messages;
    }
    //creating a new chat
    async createNewChat(chat) {
        const { user, isGroup, chatName } = chat;
        const uuid = await this.createUUID();
        const chatId = await database_1.db
            .insertInto("chats")
            .values([
            {
                chat_id: uuid,
                created_by: this.userId,
                is_group: isGroup,
                chat_name: chatName,
            },
        ])
            .execute();
        const chatParticipant = await database_1.db
            .insertInto("chat_participants")
            .values([
            {
                chat_id: uuid,
                user_id: this.userId,
            },
            {
                chat_id: uuid,
                user_id: user,
            },
        ])
            .execute();
    }
    constructor(userId) {
        this.userId = userId;
    }
}
exports.default = Chat;
