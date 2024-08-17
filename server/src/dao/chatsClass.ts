import { RawBuilder, sql } from "kysely";
import { db } from "../database";
import { v4 as uuidv4 } from "uuid";

export function getKyselyUuid(uuid:string): RawBuilder<string>{
  return sql`${uuid}::uuid`
}
class Chat {
  //create a new uui
  async createUUID() {
    const uuid = await uuidv4();
    return uuid;
  }

  //Getting all users chats
  async getChats() {
    console.log("this.userId", this.userId);
    try{

    db.selectFrom("chats")
    .innerJoin("chat_participants", "chats.chat_id", "chat_participants.chat_id")
    .select("chats.chat_id")
    .where("chat_participants.user_id", "=", this.userId)
    .execute();
    // db.selectFrom("chat_participants as cp")
    //   .selectAll()
    //   .innerJoin("users as u", "u.auth_user_id", "cp.user_id")
    //   .innerJoin("chats as c", "c.chat_id", "cp.chat_id")
    //   .leftJoin("messages as m", "m.message_id", "c.last_message_id")
    //   .where(
    //     "cp.chat_id",S
    //     "in",
    //     db
    //       .selectFrom("chats")
    //       .select("chats.chat_id")
    //       .innerJoin("chat_participants", "chats.chat_id", "chat_participants.chat_id")
    //       .where("chat_participants.user_id", "=", this.userId)
    //   )
    //   .execute();
    } catch (error) {
      console.error("Error", error);
    }
  }

  //Sending a chat message
  async sendChatMessage(message: ChatMessage) {
    const { chatId, messageText, timestamp, imageUrl } = message;
    console.log(imageUrl);
    const messageId = await db
      .insertInto("messages")
      //.columns(["chat_id", "sender_id", "message_text", "sent_at", "image_url"])
      .returning("message_id")
      .values({
        chat_id: chatId,
        sender_id: this.userId,
        message_text: messageText,
        sent_at: timestamp,
        image_url: imageUrl,
      })
      .execute();

    return messageId;
  }

  //getting all chat messages
  async getChatMessages() {
    console.log("this.userId", this.userId);
    const messages = await db
      .selectFrom("chat_participants as cp")
      .innerJoin("messages as m", "cp.chat_id", "m.chat_id")
      .innerJoin("users as u", "m.sender_id", "u.auth_user_id")
      .select([
        "cp.chat_id",
        "m.message_text",
        "m.sender_id",
        "m.sent_at",
        "m.image_url as message_image",
        "u.username",
        "u.image_url as sender_image",
      ])
      .where("cp.user_id", "=", this.userId)
      .orderBy("m.sent_at", "desc")
      .execute();

    return messages;
  }

  //creating a new chat
  async createNewChat(chat: newChat) {
    const { user, isGroup, chatName } = chat;
    const uuid = await this.createUUID();
    const chatId = await db
      .insertInto("chats")
      .values(
        {
          chat_id: uuid,
          created_by: this.userId,
          is_group: isGroup,
          chat_name: chatName,
        },
      )
      .execute();

    const chatParticipant = await db
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

  constructor(private userId: string) {}
}

export default Chat;

interface ChatMessage {
  chatId: string;
  messageText: string;
  timestamp: Date;
  imageUrl?: string | null;
}

interface newChat {
  user: string;
  isGroup: boolean;
  chatName: string | null;
}
