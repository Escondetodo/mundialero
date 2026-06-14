# api-proxy Specification

## Purpose

A Vercel serverless function that forwards GET requests to the worldcup26.ir API, adding CORS headers so the browser app can consume responses without a CORS error.

## Requirements

### Requirement: Forward GET requests

The proxy MUST accept a `?path=` query parameter and forward a GET request to `https://worldcup26.ir/{path}`.

#### Scenario: Successful forward

- GIVEN the proxy is deployed on Vercel
- WHEN a client requests `/api/proxy.js?path=get/games`
- THEN the proxy forwards `GET https://worldcup26.ir/get/games`
- AND returns the upstream JSON response with `Access-Control-Allow-Origin: *`

#### Scenario: Missing path parameter

- GIVEN a request arrives at the proxy without a `?path=` parameter
- WHEN the handler executes
- THEN it MUST return a `400` status with JSON body `{ "error": "Missing 'path' query parameter" }`

### Requirement: Add CORS headers

The proxy MUST include `Access-Control-Allow-Origin: *` on every response. It SHOULD also include `Access-Control-Allow-Methods: GET, OPTIONS` and `Access-Control-Allow-Headers: *`.

#### Scenario: Preflight OPTIONS request

- GIVEN a browser sends an OPTIONS request to the proxy
- WHEN the handler responds
- THEN it MUST return `200` with CORS headers and no body

### Requirement: Handle upstream errors gracefully

If the upstream request fails or returns a non-2xx status, the proxy MUST return a JSON error, never HTML.

#### Scenario: Upstream returns 500

- GIVEN the worldcup26.ir API returns a 500 for `/get/groups`
- WHEN the proxy receives the response
- THEN it MUST return `{ "error": "Upstream request failed", "status": 500 }` with the same status code

#### Scenario: Network failure

- GIVEN the worldcup26.ir API is unreachable
- WHEN the proxy tries to forward the request
- THEN it MUST return `502` with JSON body `{ "error": "Upstream unreachable" }`
