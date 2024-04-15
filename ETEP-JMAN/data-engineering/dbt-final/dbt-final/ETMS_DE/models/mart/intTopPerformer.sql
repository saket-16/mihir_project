{{
    config(
        tags=['mart', 'updatednow']
    )
}}


WITH

stg_user AS (

    SELECT

        *

    FROM {{ ref('stg_userdata') }}
    WHERE 
        usertype = 'intern'

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
        stg_user.fullname,
        stg_performance.scored_marks,
        stg_performance.email,
    FROM stg_user
    FULL JOIN 
        stg_performance on stg_performance.email = stg_user.email
),

marks_per_intern AS (
    SELECT 
        Fullname,
        email,
        sum(Scored_marks) as total_score_per_intern
    FROM joined_table 
    group by
        Fullname,
        email
    ORDER BY total_score_per_intern desc
    LIMIT 10
)

SELECT * from marks_per_intern