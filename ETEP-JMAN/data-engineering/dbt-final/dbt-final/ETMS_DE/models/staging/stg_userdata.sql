{{
    config(
        tags=['user', 'staging']
    )
}}


WITH

required_fields AS (


    SELECT 
    *
    FROM {{ source('ETMS_DE', 'USERDATA') }}

)


SELECT * FROM required_fields