-- migrate:up
create table chats(
    chat_id uuid primary key,
    created_at timestamp default current_timestamp,
    created_by uuid references users(auth_user_id),
    is_group boolean default false,
    chat_name varchar(255),
    last_message_id integer references messages(message_id) default null
);

-- migrate:down
drop table chats; 