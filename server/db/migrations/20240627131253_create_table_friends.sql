-- migrate:up
create table friends (
    id serial primary key,
    user1_id uuid references users(auth_user_id),
    user2_id uuid references users(auth_user_id),
    accepted boolean default false
);

-- migrate:down
drop table friends;
