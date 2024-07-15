-- migrate:up
create table chat_participants(
    participant_id serial primary key,
    chat_id uuid references chats(chat_id),
    user_id uuid references users(auth_user_id),
    joined_at timestamp default current_timestamp
);

-- migrate:down
drop table chat_participants;
