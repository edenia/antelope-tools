alter table "evm"."transaction" drop constraint "transaction_block_number_block_hash_fkey",
  add constraint "transaction_block_hash_block_number_fkey"
  foreign key ("block_hash", "block_number")
  references "evm"."block"
  ("hash", "number") on update restrict on delete cascade;
