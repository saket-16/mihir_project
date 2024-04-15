{{
    config(
        tags=['trainingPlan', 'staging']
    )
}}

WITH required_fields AS (

    SELECT 
        _ID,
        PLANTYPE,
        DATE,
        CAST(TIME AS DECIMAL(10,2)) AS DURATION, -- Renaming TIME to TIME_DURATION and casting to NUMBER
        TOPIC,
        AUDIENCE,
        MENTOR,
        VENUE,
        LINK,
        LEVEL
    FROM {{ source('ETMS_DE', 'TRAININGPLANDATA') }})



SELECT * FROM required_fields