-- migrate:up
create table chats(
    chat_id serial primary key,
    created_at timestamp default current_timestamp,
    created_by uuid references users(auth_user_id),
    is_group boolean default false,
    chat_name varchar(255)
);

-- migrate:down
drop table chats;