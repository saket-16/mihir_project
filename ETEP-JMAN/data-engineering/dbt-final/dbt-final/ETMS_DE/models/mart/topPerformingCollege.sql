{{
    config(
        tags=['mart', 'college']
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
        stg_user.location,
        stg_user.collegename,
        stg_user.email,
        stg_performance.scored_marks
    FROM stg_user
    FULL JOIN 
        stg_performance on stg_performance.email = stg_user.email
),

marks_per_intern AS (
    SELECT 
        fullname,
        location,
        collegename,
        email,
        sum(Scored_marks) as total_score_per_intern
    FROM joined_table 
    group by
        fullname,
        location,
        collegename,
        email
    ORDER BY total_score_per_intern desc
),

best_performing_college AS (
    SELECT
    collegename,
    count(fullname) as best_performers_per_college,
    FROM marks_per_intern
    group by
    collegename
    ORDER By best_performers_per_college desc
    LIMIT 20
)

SELECT * from best_performing_college