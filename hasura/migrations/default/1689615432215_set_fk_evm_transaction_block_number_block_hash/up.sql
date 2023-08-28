alter table "evm"."transaction"
  add constraint "transaction_block_number_block_hash_fkey"
  foreign key ("block_number", "block_hash")
  references "evm"."block"
  ("number", "hash") on update restrict on delete restrict;
