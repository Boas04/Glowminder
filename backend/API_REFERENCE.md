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

## Reminders

Path prefix: /api/reminders

GET /api/reminders

Response 200
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Rutinitas Pagi",
      "time": "07:00:00",
      "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
      "active": true,
      "created_at": "2026-06-03T08:00:00.000Z"
    }
  ]
}

POST /api/reminders

Request
{
  "title": "Rutinitas Pagi",
  "time": "07:00",
  "days": ["Mon", "Tue", "Wed", "Thu", "Fri"]
}

Response 201
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Rutinitas Pagi",
    "time": "07:00:00",
    "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "active": true,
    "created_at": "2026-06-03T08:00:00.000Z"
  }
}

PATCH /api/reminders/:id/toggle

Response 200
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Rutinitas Pagi",
    "time": "07:00:00",
    "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "active": false,
    "created_at": "2026-06-03T08:00:00.000Z"
  }
}

DELETE /api/reminders/:id

Response 200
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Rutinitas Pagi",
    "time": "07:00:00",
    "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "active": true,
    "created_at": "2026-06-03T08:00:00.000Z"
  }
}

POST /api/reminders/personalized

Request
{
  "lat": -8.6705,
  "lon": 115.2126
}

Response 200
{
  "success": true,
  "data": {
    "reminder_text": "Cuaca panas & lembap memicu minyak berlebih. Gunakan produk berikut: Facial Wash, Oil Control Serum.",
    "products": [
      {
        "id": 2,
        "name": "Facial Wash",
        "category_name": "Sabun Cuci Muka"
      }
    ],
    "ai": {
      "status": "success",
      "prediksi_fungsi_skincare": ["Daily Maintenance"]
    },
    "weather": {
      "humidity": 78,
      "uv_index": 5
    }
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
    "status": "success",
    "input_cuaca": {
      "uv_index": 5.4,
      "humidity": 78
    },
    "prediksi_fungsi_skincare": [
      "Daily Maintenance",
      "Sebum Controller"
    ],
    "rekomendasi_sistem": [
      "Cuaca panas & lembap memicu minyak berlebih. Produk Sebum Controller ini wajib dipakai."
    ],
    "recommended_product": {
      "id": 4,
      "name": "Hydrating Cleanser",
      "usage_time": "morning",
      "description": "Gentle cleanser",
      "ingredients": "glycerin, aloe",
      "category_id": 2,
      "brand_id": 5,
      "created_at": "2026-05-26T13:20:11.000Z",
      "category_name": "Moisturizer"
    }
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
