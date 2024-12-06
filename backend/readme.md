# Backend Api Documentation

## Endpoints

### POST /users/register

Creates a new user account with the provided details and returns a JSON response with the newly created user object and an authentication token.

**Request Body:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "johndoe@example.com",
  "password": "password123"
} 

```
**Response Body:**

``` json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaGFuIERvZSIsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.8gwLO4Qa8hV4H0x4k6MjU",
  "user": {
    "id": "1234567890",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "johndoe@example.com"
  }
}

```

#### Error Handling

- **400 Bad Request:** If the request body is invalid or missing required fields.
- **500 Internal Server Error:** If there is an error creating the user account.


# User Routes

The User Routes define the endpoints for user-related operations.

## Endpoints

### POST /users/login

Authenticates a user with the provided email and password and returns a JSON response with the authentication token.

**Request Body:**

* `email`: String (required)
* `password`: String (required)

**Example Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}

```

**Example Response Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaGFuIERvZSIsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.8gwLO4Qa8hV4H0x4k6MjU"
}

```

