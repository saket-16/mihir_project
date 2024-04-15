{{
    config(
        tags=['module', 'staging']
    )
}}


WITH

required_fields AS (


    SELECT 
    *
    FROM {{ source('ETMS_DE', 'MODULEDATA') }}

)


SELECT * FROM required_fields