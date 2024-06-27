-- migrate:up
create table friends (
    user1_id serial references users(id),
    user2_id serial references users(id),
    accepted boolean default false
);

-- migrate:down
drop table friends;
