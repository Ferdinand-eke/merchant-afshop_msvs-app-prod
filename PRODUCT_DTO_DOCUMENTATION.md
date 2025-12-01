# Product DTO Documentation

## Overview
This document describes the complete Data Transfer Object (DTO) structure for the Product entity sent from the frontend to the backend API. This is a comprehensive reference for API developers to update their DTOs accordingly.

---

## Product DTO Structure

### Complete Product Object

```typescript
interface ProductDTO {
  // ========================================
  // BASIC INFORMATION FIELDS
  // ========================================
  name: string;                    // Product name (required, min 5 characters)
  shortDescription?: string;       // Brief product summary
  description?: string;            // Detailed product description
  category: string | number;       // Product category ID
  tradehub: string | number;       // Trade hub ID

  // ========================================
  // PRODUCT IMAGES FIELDS
  // ========================================
  images?: Array<{
    id: string;
    url: string;
    type: string;
    public_id?: string;
  }>;
  imageLinks?: Array<{
    url: string;
    public_id: string;
  }>;
  featuredImageId?: string;        // ID of the featured/main image
  dbImages?: string;               // Database stored images reference

  // ========================================
  // PRICING FIELDS
  // ========================================
  price: number;                   // Base retail price (required)
  listprice?: number;              // Compare at price / original price (before discount)
  costprice?: number;              // Cost price for internal calculations
  priceTiers?: Array<{             // Bulk pricing tiers
    minQuantity: number;           // Minimum quantity for this tier
    maxQuantity: number;           // Maximum quantity for this tier
    price: number;                 // Price per unit for this tier
  }>;

  // ========================================
  // INVENTORY FIELDS
  // ========================================
  quantityInStock: number;         // Current stock quantity (required)
  quantityunitweight?: string | number;  // Unit of measurement ID (kg, liters, pieces, etc.)

  // ========================================
  // SHIPPING & LOGISTICS FIELDS (NEWLY ADDED)
  // ========================================

  // Package Dimensions (in centimeters)
  length?: number;                 // Package length in cm
  breadth?: number;                // Package width/breadth in cm
  height?: number;                 // Package height in cm

  // Weight Information
  productWeight?: number;          // Product weight in the specified unit
  perUnitShippingWeight?: string | number;  // Weight unit ID (kg, g, lbs, etc.)

  // Shipping Options
  processingTime?: string;         // Processing time before shipping
                                   // Options: "same-day", "1-2-days", "3-5-days",
                                   //          "1-week", "2-weeks"
  freeShipping?: boolean;          // Whether free shipping is offered
  fragileItem?: boolean;           // Whether item requires special handling

  // ========================================
  // ADDITIONAL METADATA (from spread operator)
  // ========================================
  slug?: string;                   // Product URL slug
  createdAt?: string;              // Creation timestamp
  updatedAt?: string;              // Last update timestamp
  merchantId?: string | number;    // Merchant/shop owner ID
  isActive?: boolean;              // Product active status
  [key: string]: any;              // Other fields passed through spread operator
}
```

---

## Field Details and Validation Rules

### Basic Information Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | `string` | Yes | Min 5 chars | Product name/title |
| `shortDescription` | `string` | No | - | Brief product summary (1-2 sentences) |
| `description` | `string` | No | - | Detailed product description |
| `category` | `string \| number` | Yes | Must be valid category ID | Product category reference |
| `tradehub` | `string \| number` | No | Must be valid hub ID | Trade hub location |

### Product Images Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | `Array<ImageObject>` | No | Array of product images (base64 or URLs) |
| `imageLinks` | `Array<ImageLinkObject>` | No | Links to images stored externally |
| `featuredImageId` | `string` | No | ID of the primary/featured image |
| `dbImages` | `string` | No | Database reference for stored images |

**Image Object Structure:**
```typescript
{
  id: string;           // Unique image identifier
  url: string;          // Image URL or base64 data
  type: string;         // MIME type (e.g., "image/jpeg")
  public_id?: string;   // Public identifier (for Cloudinary, etc.)
}
```

### Pricing Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `price` | `number` | Yes | - | Base retail price (single unit) |
| `listprice` | `number` | No | 0 | Original price before discount |
| `costprice` | `number` | No | 0 | Cost price (internal use) |
| `priceTiers` | `Array<PriceTier>` | No | [] | Bulk pricing configuration |

**Price Tier Object Structure:**
```typescript
{
  minQuantity: number;   // e.g., 10 (buy 10-49 units)
  maxQuantity: number;   // e.g., 49
  price: number;         // e.g., 45.00 (discounted price per unit)
}
```

**Example Price Tiers:**
```json
[
  {
    "minQuantity": 1,
    "maxQuantity": 9,
    "price": 50.00
  },
  {
    "minQuantity": 10,
    "maxQuantity": 49,
    "price": 45.00
  },
  {
    "minQuantity": 50,
    "maxQuantity": 99,
    "price": 40.00
  }
]
```

### Inventory Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `quantityInStock` | `number` | Yes | - | Current stock quantity |
| `quantityunitweight` | `string \| number` | No | - | Unit of measurement ID |

**Common Unit Types:**
- Pieces (pcs)
- Kilograms (kg)
- Grams (g)
- Liters (L)
- Milliliters (mL)
- Meters (m)
- Boxes
- Cartons
- Dozens

### Shipping & Logistics Fields (NEW)

#### Package Dimensions

| Field | Type | Required | Default | Unit | Description |
|-------|------|----------|---------|------|-------------|
| `length` | `number` | No | 0 | cm | Package length (longest side) |
| `breadth` | `number` | No | 0 | cm | Package width (widest side) |
| `height` | `number` | No | 0 | cm | Package height (tallest side) |

**Note:** All dimensions are in centimeters (cm). These are used to calculate:
- **Package Volume:** `(length × breadth × height) / 1,000,000` cubic meters
- **Dimensional Weight:** `(length × breadth × height) / 5000` kg

#### Weight Information

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `productWeight` | `number` | No | 0 | Actual product weight |
| `perUnitShippingWeight` | `string \| number` | No | - | Weight unit ID (references weight unit table) |

**Note:** Carriers typically charge based on the greater of actual weight vs dimensional weight.

#### Shipping Options

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `processingTime` | `string` | No | - | Time needed to prepare order before shipping |
| `freeShipping` | `boolean` | No | false | Whether merchant offers free shipping |
| `fragileItem` | `boolean` | No | false | Whether item requires special handling |

**Processing Time Options:**
- `"same-day"` - Same Day (0-1 business days)
- `"1-2-days"` - 1-2 Business Days
- `"3-5-days"` - 3-5 Business Days
- `"1-week"` - 1 Week (5-7 business days)
- `"2-weeks"` - 2 Weeks (10-14 business days)

---

## Example API Payloads

### Example 1: Creating a New Product (Full Payload)

```json
{
  "name": "Premium Wireless Headphones",
  "shortDescription": "High-quality wireless headphones with noise cancellation",
  "description": "Experience premium sound quality with our wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers and professionals.",
  "category": "electronics-123",
  "tradehub": "hub-456",

  "images": [
    {
      "id": "img-001",
      "url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "type": "image/jpeg"
    }
  ],
  "featuredImageId": "img-001",

  "price": 15000,
  "listprice": 20000,
  "costprice": 10000,
  "priceTiers": [
    {
      "minQuantity": 1,
      "maxQuantity": 9,
      "price": 15000
    },
    {
      "minQuantity": 10,
      "maxQuantity": 49,
      "price": 14000
    },
    {
      "minQuantity": 50,
      "maxQuantity": 99,
      "price": 13000
    }
  ],

  "quantityInStock": 100,
  "quantityunitweight": "unit-pcs-01",

  "length": 25,
  "breadth": 20,
  "height": 10,
  "productWeight": 250,
  "perUnitShippingWeight": "unit-kg-01",
  "processingTime": "1-2-days",
  "freeShipping": false,
  "fragileItem": true
}
```

### Example 2: Updating an Existing Product

```json
{
  "name": "Premium Wireless Headphones - Updated",
  "price": 14500,
  "quantityInStock": 150,
  "length": 25,
  "breadth": 20,
  "height": 10,
  "productWeight": 250,
  "perUnitShippingWeight": "unit-kg-01",
  "processingTime": "same-day",
  "freeShipping": true,
  "fragileItem": true
}
```

### Example 3: Simple Product (Minimal Required Fields)

```json
{
  "name": "Simple T-Shirt",
  "category": "clothing-789",
  "price": 2500,
  "quantityInStock": 50
}
```

---

## Backend Implementation Notes

### Recommended Database Schema Updates

Add the following columns to your `products` table:

```sql
-- Shipping & Logistics columns
ALTER TABLE products ADD COLUMN length INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN breadth INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN height INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN product_weight INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN per_unit_shipping_weight VARCHAR(255);
ALTER TABLE products ADD COLUMN processing_time VARCHAR(50);
ALTER TABLE products ADD COLUMN free_shipping BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN fragile_item BOOLEAN DEFAULT FALSE;

-- Bulk pricing (if not using separate table)
ALTER TABLE products ADD COLUMN price_tiers JSONB;
```

### Foreign Key Relationships

- `category` → `categories.id`
- `tradehub` → `tradehubs.id`
- `quantityunitweight` → `product_units.id`
- `perUnitShippingWeight` → `shipping_weight_units.id`

### Calculated Fields (Frontend Only - Not Sent to API)

These are calculated on the frontend for display purposes only:

```typescript
// Dimensional Weight (kg) = (L × W × H) / 5000
const dimensionalWeight = (length * breadth * height) / 5000;

// Package Volume (m³) = (L × W × H) / 1,000,000
const packageVolume = (length * breadth * height) / 1000000;

// Earnings per unit = price - (price × commissionRate)
const earnings = price - (price * (commissionRate / 100));
```

---

## API Endpoints

### Create Product
```
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

Body: ProductDTO (see examples above)
```

### Update Product
```
PUT /api/products/:id
Content-Type: application/json
Authorization: Bearer <token>

Body: ProductDTO (partial or full)
```

### Get Single Product
```
GET /api/products/:id
Authorization: Bearer <token>

Response: ProductDTO with all fields
```

---

## Validation Rules Summary

### Required Fields (Create)
- `name` (min 5 characters)
- `price` (must be > 0)
- `quantityInStock` (must be >= 0)
- `category`

### Optional but Recommended
- `shortDescription`
- `description`
- `images` (at least one image)
- Shipping dimensions (`length`, `breadth`, `height`)
- `productWeight`
- `processingTime`

### Data Type Conversions

The frontend performs these conversions before sending to API:

```javascript
// Numeric fields converted to integers
price: parseInt(formData.price) || 0
listprice: parseInt(formData.listprice) || 0
costprice: parseInt(formData.costprice) || 0
quantityInStock: parseInt(formData.quantityInStock) || 0
length: parseInt(formData.length) || 0
breadth: parseInt(formData.breadth) || 0
height: parseInt(formData.height) || 0
productWeight: parseInt(formData.productWeight) || 0

// Boolean fields with default values
freeShipping: formData.freeShipping || false
fragileItem: formData.fragileItem || false

// Arrays with default empty values
priceTiers: formData.priceTiers || []
images: formData.images || []
```

---

## Migration Guide for Backend Developers

### Step 1: Update Database Schema
Add the new shipping fields to your products table (see SQL above).

### Step 2: Update DTO/Model
Add the new fields to your Product model/DTO class:

```typescript
// Example for NestJS/TypeScript
export class CreateProductDto {
  // ... existing fields ...

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  breadth?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  productWeight?: number;

  @IsOptional()
  @IsString()
  perUnitShippingWeight?: string;

  @IsOptional()
  @IsIn(['same-day', '1-2-days', '3-5-days', '1-week', '2-weeks'])
  processingTime?: string;

  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @IsOptional()
  @IsBoolean()
  fragileItem?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PriceTierDto)
  priceTiers?: PriceTierDto[];
}
```

### Step 3: Update API Response
Ensure GET endpoints return all new fields in the response.

### Step 4: Test
Use the example payloads above to test your endpoints.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-20 | Initial documentation with shipping fields |

---

## Contact

For questions about this DTO structure, please contact the frontend development team.

**Frontend Source Files:**
- Main Form: `src/app/main/vendors-shop/products/product/ShopProduct.jsx`
- Form Handler: `src/app/main/vendors-shop/products/product/ShopProductHeader.jsx`
- Shipping Tab: `src/app/main/vendors-shop/products/product/tabs/ShippingTab.jsx`
- Basic Info Tab: `src/app/main/vendors-shop/products/product/tabs/BasicInfoTab.jsx`
- Pricing Tab: `src/app/main/vendors-shop/products/product/tabs/PricingTab.jsx`
- Inventory Tab: `src/app/main/vendors-shop/products/product/tabs/InventoryTab.jsx`
- Images Tab: `src/app/main/vendors-shop/products/product/tabs/ProductImagesTab.jsx`
