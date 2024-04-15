{{
    config(
        tags=['performance', 'staging']
    )
}}

WITH required_fields AS (

    SELECT 
        _ID,
        AUDIENCE,
        EMAIL,
        TOPIC,
        CAST(SCORED AS NUMBER) AS SCORED_MARKS, -- Casting SCORED to NUMBER and renaming it
        CAST(TOTAL AS NUMBER) AS TOTAL_MARKS -- Casting TOTAL to NUMBER and renaming it
    FROM {{ source('ETMS_DE', 'PERFORMANCEDATA') }})

SELECT * FROM required_fields
