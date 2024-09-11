-- migrate:up
create table chat_participants(
    participant_id serial primary key,
    chat_id uuid references chats(chat_id),
    user_id uuid references users(auth_user_id),
    joined_at timestamp default current_timestamp
);

-- migrate:down
drop table chat_participants;


-- SELECT chat_participants, users, chat,messages where 
-- chat_participants.chat_id = chat.chat_id AND 
-- chat_participants.user_id = users.auth_user_id AND 
-- chat.last_message_id = message.message_id AND
-- chat_participants.chat_id IN (SELECT chat.chat_id FROM chat,chat_participants where chat.chat_id = chat_participants.chat_id AND chat_participants.user_id = $1);


-- const chat = {
-- "123": {
--     chat_id: "123",
--     chat_name: "chat1",
--     is_group: false,
--     created_at: "2022-01-01",
--     created_by: "user1",
--     last_message_id: "1",
--     participants: [
--         {
--             user_id: "user1",
--             joined_at: "2022-01-01"
--         },
--         {
--             user_id: "user2",
--             joined_at: "2022-01-01"
--         }
--     ]
-- },
-- }


-- for (const participants of res) {
--     if (!chat[participants.chat_id]) {
--         chat[participants.chat_id] = {
--             chat_id: participants.chat_id,
--             chat_name: participants.chat_name,
--             is_group: participants.is_group,
--             created_at: participants.created_at,
--             created_by: participants.created_by,
--             last_message_id: participants.message_id,
--             last_message_text: participants.message_text,
--             participants: []
--         }
--     }

--     chat[participants.chat_id].participants.push(participants)
-- }