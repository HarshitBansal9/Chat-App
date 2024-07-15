-- migrate:up
alter table messages add column chat_id uuid references chats(chat_id);
-- migrate:down
alter table messages drop column chat_id;
