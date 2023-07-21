alter table "evm"."block" drop constraint "block_number_key";
alter table "evm"."block" add constraint "block_number_hash_key" unique ("number", "hash");
