# AI CRM - Core API Documentation

This document describes the core APIs currently implemented for the AI CRM backend.

## Base URL
`http://localhost:8000`

## Endpoints

### 1. Get All Customers
Retrieve a paginated list of customers.

**Endpoint:** `GET /customers`

**Query Parameters:**
- `skip` (integer, default `0`): Number of records to skip.
- `limit` (integer, default `100`): Maximum number of records to return.

**Response:**
Returns an array of `CustomerResponse` objects.

```json
[
  {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "created_at": "2026-01-01T00:00:00Z",
    "metadata_json": {
      "source": "organic"
    }
  }
]
```

---

### 2. Get Customer by ID
Retrieve details of a specific customer.

**Endpoint:** `GET /customers/{customer_id}`

**Path Parameters:**
- `customer_id` (string): The UUID of the customer.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2026-01-01T00:00:00Z",
  "metadata_json": {
    "source": "organic"
  }
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Customer not found"
}
```

---

### 3. Get All Orders
Retrieve a paginated list of orders.

**Endpoint:** `GET /orders`

**Query Parameters:**
- `skip` (integer, default `0`): Number of records to skip.
- `limit` (integer, default `100`): Maximum number of records to return.

**Response:**
Returns an array of `OrderResponse` objects.

```json
[
  {
    "id": "uuid",
    "customer_id": "uuid",
    "total_amount": 125.50,
    "status": "completed",
    "created_at": "2026-01-01T12:00:00Z",
    "items": {
      "line_items": [
        {
          "product": "Product A",
          "price": 50.0,
          "quantity": 2
        }
      ]
    }
  }
]
```
