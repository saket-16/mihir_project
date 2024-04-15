{{
    config(
        tags=['mart']
    )
}}


WITH

stg_module AS (

    SELECT

        *

    FROM {{ ref('stg_moduledata') }}
    WHERE 
        audience = 'employee'

),

stg_performance AS (
    SELECT
        *
    FROM {{ ref('stg_performancedata') }} 
    WHERE
        audience = 'employee'
),



joined_table AS (
    SELECT
        stg_module.Name,
        stg_performance.Topic,
        stg_performance.scored_marks
    FROM stg_module 
    FULL JOIN 
        stg_performance on stg_performance.TOPIC = stg_module.TOPIC
),

avg_marks_per_topic_table AS (
    SELECT 
        Name,
        Topic,
        avg(Scored_marks) as avg_score_per_topic
    FROM joined_table 
    group by
        Name,
        Topic

)



SELECT * from avg_marks_per_topic_table