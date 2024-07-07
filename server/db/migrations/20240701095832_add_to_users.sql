-- migrate:up
create or replace function public.add_to_users() returns trigger as $$ 
begin 
insert into public.users (username,auth_user_id) values (new.raw_user_meta_data->>'name',new.id);
return new;
end;
$$ language plpgsql security definer;
create trigger add_to_users after insert on auth.users for each row execute procedure public.add_to_users();

-- migrate:down
drop trigger add_to_users on auth.users;