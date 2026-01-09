# Boracity API Documentation

Complete documentation for Boracity REST API endpoints.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Endpoints](#endpoints)
  - [Search Families](#search-families)
  - [Register Download](#register-download)
- [Error Codes](#error-codes)
- [Examples](#examples)

---

## 🌐 Overview

The Boracity API provides programmatic access to search and download Revit families. All endpoints return JSON responses and implement rate limiting for security.

**Current Version:** v1  
**Protocol:** REST  
**Format:** JSON  
**Authentication:** None (public endpoints)

---

## 🔗 Base URL

### Development
```
http://localhost:3000/api
```

### Production
```
https://boracity.com/api
```

---

## ⏱️ Rate Limiting

All endpoints are rate-limited to prevent abuse. Rate limits are applied per IP address.

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/search` | 20 requests | 1 minute |
| `/api/download` | 15 requests | 1 minute |
| Other endpoints | 60 requests | 1 minute |

### Rate Limit Headers

Every response includes these headers:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1704822060000
```

### Rate Limit Exceeded Response

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:
```json
{
  "error": "Too many search requests. Please try again in a minute.",
  "retryAfter": 45
}
```

**HTTP Status:** `429 Too Many Requests`  
**Retry-After Header:** Seconds until rate limit resets

---

## 📤 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔍 Endpoints

---

### Search Families

Search for Revit families by name, category, or keywords.

**Endpoint:** `GET /api/search`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (2-100 characters) |

#### Example Request
```bash
GET /api/search?q=chair
```
```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/search?q=chair');
const data = await response.json();
```
```python
# Python
import requests

response = requests.get('http://localhost:3000/api/search', params={'q': 'chair'})
data = response.json()
```

#### Success Response

**HTTP Status:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "fam_001",
      "slug": "bar-chair-modern",
      "name": "ALUNIA Bar Chair - Modern Design",
      "category": "furniture",
      "description": "Modern bar chair with sleek design...",
      "tags": ["bar", "chair", "furniture", "modern"],
      "file": {
        "size": "245 KB",
        "revitVersions": ["2023", "2024"],
        "downloadUrl": "/downloads/bar-chair-modern.rfa"
      },
      "metadata": {
        "author": "Boracity Team",
        "uploadDate": "2024-01-15T00:00:00.000Z",
        "downloads": 1247,
        "views": 3891
      }
    },
    {
      "id": "fam_002",
      "slug": "armchair-ottoman-set",
      "name": "Armchair 78 with Ottoman - Living Room Set",
      "category": "furniture",
      "description": "Elegant armchair with matching ottoman...",
      "tags": ["armchair", "ottoman", "furniture", "living room"],
      "file": {
        "size": "312 KB",
        "revitVersions": ["2023", "2024"],
        "downloadUrl": "/downloads/armchair-ottoman-set.rfa"
      },
      "metadata": {
        "author": "Boracity Team",
        "uploadDate": "2024-02-10T00:00:00.000Z",
        "downloads": 892,
        "views": 2134
      }
    }
  ],
  "count": 2,
  "query": "chair"
}
```

#### Error Responses

**Missing Query Parameter**

**HTTP Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Query parameter \"q\" is required",
  "example": "/api/search?q=chair"
}
```

**Invalid Query**

**HTTP Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Query must be 2-100 characters",
  "hint": "Query must be 2-100 characters"
}
```

**Rate Limit Exceeded**

**HTTP Status:** `429 Too Many Requests`
```json
{
  "error": "Too many search requests. Please try again in a minute.",
  "retryAfter": 45
}
```

---

### Register Download

Register a download for analytics and get the download URL.

**Endpoint:** `POST /api/download`

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `familyId` | string | Yes | ID of the family to download |

#### Example Request
```bash
POST /api/download
Content-Type: application/json

{
  "familyId": "fam_001"
}
```
```javascript
// JavaScript
const response = await fetch('http://localhost:3000/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    familyId: 'fam_001'
  })
});
const data = await response.json();
```
```python
# Python
import requests

response = requests.post(
  'http://localhost:3000/api/download',
  json={'familyId': 'fam_001'}
)
data = response.json()
```

#### Success Response

**HTTP Status:** `200 OK`
```json
{
  "success": true,
  "downloadUrl": "/downloads/bar-chair-modern.rfa",
  "family": {
    "id": "fam_001",
    "name": "ALUNIA Bar Chair - Modern Design",
    "category": "furniture",
    "size": "245 KB",
    "versions": ["2023", "2024"]
  },
  "message": "Download ready"
}
```

#### Error Responses

**Missing familyId**

**HTTP Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "familyId is required in request body",
  "example": {
    "familyId": "modern-office-chair"
  }
}
```

**Invalid familyId**

**HTTP Status:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Invalid familyId format"
}
```

**Family Not Found**

**HTTP Status:** `404 Not Found`
```json
{
  "success": false,
  "error": "Family not found"
}
```

**Rate Limit Exceeded**

**HTTP Status:** `429 Too Many Requests`
```json
{
  "error": "Download limit reached. Please try again in a minute.",
  "retryAfter": 52
}
```

---

## ⚠️ Error Codes

| HTTP Status | Meaning | Common Causes |
|-------------|---------|---------------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Missing or invalid parameters |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error (contact support) |

---

## 💡 Examples

### Complete Search Workflow
```javascript
// 1. Search for families
async function searchFamilies(query) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        const error = await response.json();
        console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
        return null;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.count} families`);
    return data.data;
    
  } catch (error) {
    console.error('Search failed:', error);
    return null;
  }
}

// Usage
const families = await searchFamilies('chair');
```

### Complete Download Workflow
```javascript
// 2. Register download and get URL
async function downloadFamily(familyId) {
  try {
    const response = await fetch('http://localhost:3000/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ familyId })
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        const error = await response.json();
        console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
        return null;
      }
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Download ready: ${data.downloadUrl}`);
    
    // 3. Trigger browser download
    window.location.href = data.downloadUrl;
    
    return data;
    
  } catch (error) {
    console.error('Download failed:', error);
    return null;
  }
}

// Usage
await downloadFamily('fam_001');
```

### Handle Rate Limiting with Retry
```javascript
async function searchWithRetry(query, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(
      `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
    );
    
    if (response.status === 429) {
      const error = await response.json();
      const retryAfter = error.retryAfter || 60;
      
      console.log(`Rate limited. Waiting ${retryAfter} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      
      continue; // Retry
    }
    
    if (response.ok) {
      return await response.json();
    }
    
    throw new Error(`HTTP ${response.status}`);
  }
  
  throw new Error('Max retries exceeded');
}

// Usage
const data = await searchWithRetry('chair');
```

### Batch Operations with Rate Limiting
```javascript
async function batchSearch(queries) {
  const results = [];
  const RATE_LIMIT = 20; // 20 requests per minute
  const BATCH_SIZE = 5;  // Process 5 at a time
  
  for (let i = 0; i < queries.length; i += BATCH_SIZE) {
    const batch = queries.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(
      batch.map(query => searchFamilies(query))
    );
    
    results.push(...batchResults);
    
    // Wait if we're approaching rate limit
    if (i + BATCH_SIZE < queries.length) {
      console.log('Waiting to avoid rate limit...');
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds
    }
  }
  
  return results;
}

// Usage
const queries = ['chair', 'table', 'lamp', 'sofa', 'desk'];
const allResults = await batchSearch(queries);
```

---

## 🔒 Security Notes

- All endpoints implement rate limiting per IP address
- Input validation is enforced on all parameters
- SQL injection protection is built-in (parameterized queries)
- XSS protection via Content-Security-Policy headers
- HTTPS is enforced in production

---

## 📞 Support

For API support or questions:
- Email: support@boracity.com
- GitHub Issues: [github.com/boracity/issues](https://github.com/boracity/issues)
- Documentation: [docs.boracity.com](https://docs.boracity.com)

---

## 📝 Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- `/api/search` endpoint
- `/api/download` endpoint
- Rate limiting implementation
- Security headers

---

**Last Updated:** January 9, 2026  
**Version:** 1.0.0