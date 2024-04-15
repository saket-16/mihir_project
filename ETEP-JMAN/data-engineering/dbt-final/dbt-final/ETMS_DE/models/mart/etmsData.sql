{{
    config(
        tags=['mart', 'etmsData']
    )
}}


WITH

stg_module AS (

    SELECT

        *

    FROM {{ ref('stg_moduledata') }}


),

stg_training AS (
    SELECT
        *
    FROM {{ ref('stg_trainingplandata') }} 
    WHERE
        plantype = 'training'
),



joined_table AS (
    SELECT
        stg_module.Name,
        stg_training.topic,
        stg_training.audience,
        stg_training.plantype,
        stg_training.venue,
        stg_training.level,
        stg_training.duration,
    FROM stg_module 
    FULL JOIN 
        stg_training on stg_training.TOPIC = stg_module.TOPIC
)



SELECT * from joined_table