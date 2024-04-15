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
        audience = 'intern'

),

stg_performance AS (
    SELECT
        *
    FROM {{ ref('stg_performancedata') }} 
    WHERE
        audience = 'intern'
),



joined_table AS (
    SELECT
        stg_module.Name,
        stg_performance.email,
        stg_performance.scored_marks
    FROM stg_module 
    FULL JOIN 
        stg_performance on stg_performance.TOPIC = stg_module.TOPIC
),

marks_per_module_table AS (
    SELECT 
        Name,
        Email,
        sum(Scored_marks) as total_score_per_module
    FROM joined_table 
    group by
        Name,
        Email

),

avg_marks_per_module_table AS (
     SELECT 
        Name,
        avg(total_score_per_module) as avg_score
    FROM marks_per_module_table 
    group by
        Name

)

SELECT * from avg_marks_per_module_table