-- migrate:up
alter table users drop column socket_id;    

-- migrate:down
alter table users add column socket_id varchar(255) not null;