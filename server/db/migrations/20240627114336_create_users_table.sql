-- migrate:up
create table users (
    id serial primary key,
    username varchar(255),
    auth_user_id uuid references auth.users(id) unique,
    socket_id varchar(255),
    image_url varchar(255) default null
);
-- migrate:down
drop table users;
