---
sidebar_position: 1
---

# GetAllUsers

This reference shows how to use APIs to get information about GetAllUsers.

### [GET] - Get GetAllUsers Information

Schema
```js
// Endpoint
https://<server_name>/user

// Parameters 
// No parameters required

// Response
{
  result: array()
}
```
<p class="p_example">Example</p>

Request URL 
```js
https://<server_name>/user
```

Responses
- Code 200 - Request succeeded
```js
[
    {
        "_id": "65f9e8a7c5521a1f9c8b4567",
        "username": "johndoe",
        "name": "John Doe",
        "role": "comprador",
        "email": "johndoe@example.com",
        "data_nascimento": "1990-01-01T00:00:00.000Z",
        "address": [
            "65f9e8a7c5521a1f9c8b4568",
            "65f9e8a7c5521a1f9c8b4569"
        ],
        "products_reviewed": [],
        "favorite_address": "65f9e8a7c5521a1f9c8b4568",
        "telefone": "123456789",
        "block": false,
        "tentativas": 4
    },
    {
        "_id": "65f9e8a7c5521a1f9c8b4570",
        "username": "janedoe",
        "name": "Jane Doe",
        "role": "vendedor",
        "email": "janedoe@example.com",
        "data_nascimento": "1992-05-15T00:00:00.000Z",
        "address": [
            "65f9e8a7c5521a1f9c8b4571"
        ],
        "products_reviewed": [],
        "favorite_address": "65f9e8a7c5521a1f9c8b4571",
        "telefone": "987654321",
        "block": false,
        "tentativas": 4
    }
]
```
- Code 401 - Request Unauthorized  
- Code 404 - The specified resource was not found
- Code 500 - Error on server