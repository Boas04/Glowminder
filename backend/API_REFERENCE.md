# Glowminder Backend API Reference

Base URL
- Local: http://localhost:5000
- Content-Type: application/json

Response shape
- Success responses: { "success": true, "data": ... }
- Error responses: { "success": false, "message": "..." }

## Health

GET /health

Response 200
{
  "status": "ok"
}

GET /

Response 200
{
  "message": "Glowminder backend running"
}

## Products

Path prefix: /api/product

Fields
- id: number
- name: string (required)
- usage_time: "morning" | "night" | "special_treatment" (optional, default: "morning")
- description: string (optional, nullable)
- ingredients: string (required)
- category_id: number (optional, nullable, must be positive)
- brand_id: number (optional, nullable, must be positive)
- created_at: timestamp

GET /api/product

Response 200
{
  "success": true,
  "data": [
    {
      "id": 4,
      "name": "Hydrating Cleanser",
      "usage_time": "morning",
      "description": "Gentle cleanser",
      "ingredients": "glycerin, aloe",
      "category_id": 2,
      "brand_id": 5,
      "created_at": "2026-05-26T13:20:11.000Z"
    }
  ]
}

GET /api/product/:id

Response 200
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Hydrating Cleanser",
    "usage_time": "morning",
    "description": "Gentle cleanser",
    "ingredients": "glycerin, aloe",
    "category_id": 2,
    "brand_id": 5,
    "created_at": "2026-05-26T13:20:11.000Z"
  }
}

Response 404
{
  "success": false,
  "message": "product not found"
}

POST /api/product

Request
{
  "name": "Hydrating Cleanser",
  "usage_time": "morning",
  "description": "Gentle cleanser",
  "ingredients": "glycerin, aloe",
  "category_id": 2,
  "brand_id": 5
}

Response 201
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Hydrating Cleanser",
    "usage_time": "morning",
    "description": "Gentle cleanser",
    "ingredients": "glycerin, aloe",
    "category_id": 2,
    "brand_id": 5,
    "created_at": "2026-05-26T13:20:11.000Z"
  }
}

Response 400 (validation)
{
  "success": false,
  "message": "name is required"
}

PUT /api/product/:id

Request (any of the fields below)
{
  "name": "Hydrating Cleanser Plus",
  "usage_time": "night",
  "description": "Updated description",
  "ingredients": "glycerin, aloe, panthenol",
  "category_id": 3,
  "brand_id": 5
}

Response 200
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Hydrating Cleanser Plus",
    "usage_time": "night",
    "description": "Updated description",
    "ingredients": "glycerin, aloe, panthenol",
    "category_id": 3,
    "brand_id": 5,
    "created_at": "2026-05-26T13:20:11.000Z"
  }
}

Response 400 (no fields)
{
  "success": false,
  "message": "no fields to update"
}

DELETE /api/product/:id

Response 200
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Hydrating Cleanser",
    "usage_time": "morning",
    "description": "Gentle cleanser",
    "ingredients": "glycerin, aloe",
    "category_id": 2,
    "brand_id": 5,
    "created_at": "2026-05-26T13:20:11.000Z"
  }
}

## Product Categories

Path prefix: /api/categories

Fields
- id: number
- name: string (required)

GET /api/categories

Response 200
{
  "success": true,
  "data": [
    { "id": 2, "name": "cleanser" },
    { "id": 3, "name": "serum" }
  ]
}

GET /api/categories/:id

Response 200
{
  "success": true,
  "data": { "id": 2, "name": "cleanser" }
}

POST /api/categories

Request
{ "name": "cleanser" }

Response 201
{
  "success": true,
  "data": { "id": 2, "name": "cleanser" }
}

PUT /api/categories/:id

Request
{ "name": "exfoliant" }

Response 200
{
  "success": true,
  "data": { "id": 2, "name": "exfoliant" }
}

DELETE /api/categories/:id

Response 200
{
  "success": true,
  "data": { "id": 2, "name": "exfoliant" }
}

## Brands

Path prefix: /api/brands

Fields
- id: number
- name: string (required)
- country: string (required)

GET /api/brands

Response 200
{
  "success": true,
  "data": [
    { "id": 5, "name": "Acme", "country": "Indonesia" }
  ]
}

GET /api/brands/:id

Response 200
{
  "success": true,
  "data": { "id": 5, "name": "Acme", "country": "Indonesia" }
}

POST /api/brands

Request
{ "name": "Acme", "country": "Indonesia" }

Response 201
{
  "success": true,
  "data": { "id": 5, "name": "Acme", "country": "Indonesia" }
}

PUT /api/brands/:id

Request (name or country)
{ "country": "Japan" }

Response 200
{
  "success": true,
  "data": { "id": 5, "name": "Acme", "country": "Japan" }
}

DELETE /api/brands/:id

Response 200
{
  "success": true,
  "data": { "id": 5, "name": "Acme", "country": "Japan" }
}

## Weather

Path prefix: /api/weather

GET /api/weather/current?lat={lat}&lon={lon}

Query params
- lat: number (required)
- lon: number (required)

Response 200
{
  "success": true,
  "message": "Weather data fetched successfully",
  "data": {
    "id": 12,
    "temperature": 30.1,
    "humidity": 78,
    "uv_index": null,
    "weather_condition": "Clouds",
    "wind_speed": 3.6,
    "location_name": "Denpasar",
    "created_at": "2026-05-26T13:22:11.000Z"
  }
}

Response 400
{
  "success": false,
  "message": "lat and lon are required"
}

GET /api/weather/logs

Response 200
{
  "success": true,
  "data": [
    {
      "id": 12,
      "temperature": 30.1,
      "humidity": 78,
      "uv_index": null,
      "weather_condition": "Clouds",
      "wind_speed": 3.6,
      "location_name": "Denpasar",
      "created_at": "2026-05-26T13:22:11.000Z"
    }
  ]
}

GET /api/weather/logs/:id

Response 200
{
  "success": true,
  "data": {
    "id": 12,
    "temperature": 30.1,
    "humidity": 78,
    "uv_index": null,
    "weather_condition": "Clouds",
    "wind_speed": 3.6,
    "location_name": "Denpasar",
    "created_at": "2026-05-26T13:22:11.000Z"
  }
}

## AI Reminder

Path prefix: /api/ai

POST /api/ai/reminder

Request
{
  "ingredients": "niacinamide, hyaluronic acid",
  "uv_index": 5.4,
  "humidity": 78
}

Response 200
{
  "success": true,
  "data": {
    "reminder": "Gunakan sunscreen dan perbanyak hidrasi"
  }
}

Response 400
{
  "success": false,
  "message": "ingredients, uv_index, and humidity are required"
}

Response 502
{
  "success": false,
  "message": "Failed to reach AI service"
}
