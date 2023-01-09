CREATE OR REPLACE VIEW "public"."endpoints_by_producer_id" AS 
 SELECT node.producer_id,
    endpoint.type,
    endpoint.value,
    endpoint.response,
    endpoint.updated_at,
    endpoint.head_block_time
   FROM (endpoint
     JOIN node ON ((endpoint.node_id = node.id)));
