-- migrate:up
create table messages(
    message_id serial primary key,
    chat_id integer references chats(chat_id),
    sender_id uuid references users(auth_user_id),
    message_text text,
    image_url varchar(255) default null,
    sent_at timestamp default current_timestamp
);


-- migrate:down
drop table messages;
