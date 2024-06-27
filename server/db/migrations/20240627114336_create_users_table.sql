-- migrate:up
create table users (
    id serial primary key,
    username varchar(255),
    auth_user_id uuid references auth.users(id)
);
-- migrate:down
drop table users;
