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

stg_training AS (
    SELECT
        *
    FROM {{ ref('stg_trainingplandata') }} 
    WHERE
        audience = 'intern' and plantype = 'training'
),



joined_table AS (
    SELECT
        stg_module.Name,
        stg_training.topic,
        stg_training.duration,
    FROM stg_module 
    FULL JOIN 
        stg_training on stg_training.TOPIC = stg_module.TOPIC
),

duration_per_topic_table AS (
    SELECT 
        Name,
        Topic,
        sum(Duration) as total_duration_per_topic
    FROM joined_table 
    group by
        Name,
        Topic

)


SELECT * from duration_per_topic_table