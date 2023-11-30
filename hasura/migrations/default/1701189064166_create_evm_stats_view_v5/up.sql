DROP VIEW IF EXISTS "evm"."stats";
CREATE OR REPLACE VIEW "evm"."stats" AS 
 SELECT COALESCE(evm_block.avg_gas_used, (0)::numeric) AS block_gas_avg,
    COALESCE(daily_transactions.total_transaction_count, (0)::bigint) AS daily_transaction_count,
    COALESCE(max_transaction_sum, (0)::numeric) AS ath_transactions_count, 
    COALESCE(gas_used_sum, (0)::numeric) AS ath_gas_used,
    blocks AS ath_blocks 
 FROM (((( SELECT avg(subquery_alias.gas_used) AS avg_gas_used
    FROM ( SELECT block.gas_used, block."timestamp"
        FROM evm.block
        ORDER BY block."timestamp" DESC
        LIMIT 100) subquery_alias) evm_block
     CROSS JOIN LATERAL ( 
        SELECT sum(jsonb_array_length(block.transactions)) AS total_transaction_count
        FROM evm.block
        WHERE (block."timestamp" >= (now() - '24:00:00'::interval))) daily_transactions)
     CROSS JOIN LATERAL ( 
        WITH subquery AS(
            SELECT array_to_string(array_agg(evm.block.number), ',') AS blocks , 
                sum(jsonb_array_length(evm.block.transactions)) AS total_transaction_count,
                sum(evm.block.gas_used) AS gas_used_sum
            FROM evm.block 
            WHERE (block."timestamp" >= (now() - '00:30:00'::interval))
            GROUP BY timestamp) 
        SELECT blocks, max_transaction_sum, gas_used_sum
        FROM ( SELECT max(subquery.total_transaction_count) AS max_transaction_sum 
               FROM subquery) q1
        INNER JOIN subquery q2 ON q1.max_transaction_sum = q2.total_transaction_count 
        LIMIT 1) partial_ath));
