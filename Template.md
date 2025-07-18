---
sidebar_position: 1
---

# [NAME_API]

This reference shows how to use APIs to get information about [NAME_API].

### [GET] - Get [NAME_API] Information

Schema
```js
// Endpoint
https://<server_name>/api/data/v1/[CATEGORY]/[NAME_API]

// Parameters 
zterm: string(), //Optional
limit: int(), // Optional
page: int(), // Optional
// Response
{
  result: array()
}
```
<p class="p_example">Example</p>

Request URL 
```js
https://<server_name>/api/data/v1/[CATEGORY]/[NAME_API]
```

Responses
- Code 200 - Request succeeded
```js
{
    "page": 1,
    "totalPages": 1,
    "count": 2040,
    "limit": 10000,
    "previousLink": "",
    "nextLink": "",
    "result": [
        {
            "TEXT1": "E-commerce comprobante",
            "ZTAG1": "000",
            "ZTERM": "@000"
        },
        {
            "TEXT1": "E-commerce tarjeta de credito 31 días",
            "ZTAG1": "031",
            "ZTERM": "@001"
        },
        {
            "TEXT1": "E-commerce tarjeta de credito 61 días",
            "ZTAG1": "061",
            "ZTERM": "@002"
        },
        {
            "TEXT1": "E-commerce tarjeta de credito 91 días",
            "ZTAG1": "091",
            "ZTERM": "@003"
        }
        ...
    ]
}
```
- Code 401 - Request Unauthorized  
- Code 404 - The specified resource was not found