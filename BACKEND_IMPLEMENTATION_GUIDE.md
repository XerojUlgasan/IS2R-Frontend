# Backend Implementation Guide: Custom Date Range for Calendar Detail Endpoint

## Overview
This guide explains how to implement custom date range functionality for the `/api/businesses/{businessId}/calendar/detail` endpoint to support querying calendar data with `from` and `to` date parameters.

## Current Implementation
The existing endpoint supports:
- Single date queries with `type` and `date` parameters
- Example: `/api/businesses/3525754e-78b6-43d0-8453-eaa052641f0c/calendar/detail?type=day&date=2026-08-20`

## Required Changes

### 1. Update Endpoint Signature
Modify the calendar detail endpoint to accept optional `from` and `to` query parameters:

**Current:**
```
GET /api/businesses/{businessId}/calendar/detail?type={type}&date={date}
```

**New:**
```
GET /api/businesses/{businessId}/calendar/detail?from={fromDate}&to={toDate}
GET /api/businesses/{businessId}/calendar/detail?type={type}&date={date} (existing behavior maintained)
```

### 2. Parameter Handling Logic
The endpoint should handle the following scenarios:

#### Scenario A: Existing Single Date Query (backward compatibility)
- **Parameters:** `type=day|month`, `date=YYYY-MM-DD` or `date=YYYY-MM`
- **Behavior:** Return data for the specific day or month (existing functionality)
- **Priority:** Process this when `from` and `to` are not provided

#### Scenario B: Custom Date Range Query (new functionality)
- **Parameters:** `from=YYYY-MM-DD`, `to=YYYY-MM-DD`
- **Behavior:** Return aggregated data for the date range
- **Priority:** Process this when `from` and `to` are provided

### 3. Data Aggregation for Date Range
When processing a custom date range query:

#### Time Scope Determination
- **fromDate:** Inclusive start date (YYYY-MM-DD format)
- **toDate:** Inclusive end date (YYYY-MM-DD format)
- **Validation:** Ensure `fromDate <= toDate`, return 400 error if invalid

#### Data Collection
Aggregate data across all dates in the range:

1. **Sales by Material:**
   - Sum `paid` quantities across the range
   - Sum `pending` quantities across the range
   - Sum `qtyConsumed` across the range
   - Sum `salesAmount` across the range
   - Group by material ID/name

2. **Stock Consumption:**
   - Sum `stockAdded` across the range
   - Sum `totalConsumed` across the range
   - Calculate `remainingStock` as: (initial stock + added - consumed) for the range end
   - Group by material ID/name

3. **Expenses:**
   - Collect all individual expense records within the date range
   - Do not aggregate - show individual expense entries
   - Filter by `expenseDate` between `fromDate` and `toDate` (inclusive)

4. **Summary Metrics:**
   - `totalRevenue`: Sum of all sales amounts in range
   - `totalSalesCount`: Sum of all paid sales counts in range
   - `pendingSalesCount`: Sum of all pending sales counts in range
   - `totalExpenses`: Sum of all expense amounts in range

### 4. Response Format
Maintain the same response structure as the existing endpoint:

```json
{
  "totalRevenue": 15000.00,
  "totalSalesCount": 45,
  "pendingSalesCount": 5,
  "totalExpenses": 3200.50,
  "salesByMaterial": [
    {
      "name": "Material A",
      "paid": 25,
      "pending": 2,
      "qtyConsumed": 27,
      "salesAmount": 8500.00
    }
  ],
  "stockConsumption": [
    {
      "name": "Material A",
      "stockAdded": 50,
      "totalConsumed": 27,
      "remainingStock": 23
    }
  ],
  "expenses": [
    {
      "title": "Office Supplies",
      "category": "Operating",
      "amount": 150.00,
      "remarks": "Monthly supplies",
      "linkedMaterial": null
    }
  ]
}
```

### 5. Implementation Steps

#### Step 1: Update Route Handler
```javascript
// Example in your route handler
router.get('/businesses/:businessId/calendar/detail', async (req, res) => {
  const { businessId } = req.params;
  const { type, date, from, to } = req.query;

  try {
    let result;
    
    if (from && to) {
      // Custom date range query
      result = await getCalendarDetailRange(businessId, from, to);
    } else if (type && date) {
      // Existing single date query
      result = await getCalendarDetail(businessId, type, date);
    } else {
      return res.status(400).json({ 
        error: 'Either (type and date) or (from and to) parameters required' 
      });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Step 2: Implement Date Range Query Function
```javascript
async function getCalendarDetailRange(businessId, fromDate, toDate) {
  // Validate date format and range
  if (!isValidDate(fromDate) || !isValidDate(toDate)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  
  if (new Date(fromDate) > new Date(toDate)) {
    throw new Error('fromDate must be before or equal to toDate');
  }

  // Query sales data for the date range
  const salesData = await aggregateSalesByDateRange(businessId, fromDate, toDate);
  
  // Query stock consumption for the date range
  const stockData = await aggregateStockConsumptionByDateRange(businessId, fromDate, toDate);
  
  // Query expenses for the date range
  const expensesData = await getExpensesByDateRange(businessId, fromDate, toDate);
  
  // Calculate summary metrics
  const summary = calculateSummaryMetrics(salesData, expensesData);
  
  return {
    ...summary,
    salesByMaterial: salesData,
    stockConsumption: stockData,
    expenses: expensesData
  };
}
```

#### Step 3: Database Query Examples
```sql
-- Sales aggregation by material for date range
SELECT 
  m.name,
  SUM(s.paid_qty) as paid,
  SUM(s.pending_qty) as pending,
  SUM(s.qty_consumed) as qtyConsumed,
  SUM(s.amount) as salesAmount
FROM sales s
JOIN materials m ON s.material_id = m.id
WHERE s.business_id = :businessId
  AND s.sale_date BETWEEN :fromDate AND :toDate
GROUP BY m.id, m.name;

-- Stock consumption for date range
SELECT 
  m.name,
  SUM(CASE WHEN se.type = 'added' THEN se.quantity ELSE 0 END) as stockAdded,
  SUM(CASE WHEN se.type = 'consumed' THEN se.quantity ELSE 0 END) as totalConsumed,
  -- Calculate remaining stock at end of range
  (SELECT m.current_stock - SUM(CASE WHEN se.type = 'consumed' AND se.date <= :toDate THEN se.quantity ELSE 0 END)
   FROM stock_entries se2 
   WHERE se2.material_id = m.id) as remainingStock
FROM materials m
JOIN stock_entries se ON se.material_id = m.id
WHERE se.business_id = :businessId
  AND se.date BETWEEN :fromDate AND :toDate
GROUP BY m.id, m.name;

-- Expenses for date range
SELECT 
  title,
  category,
  amount,
  remarks,
  linked_material_id
FROM expenses
WHERE business_id = :businessId
  AND expense_date BETWEEN :fromDate AND :toDate
ORDER BY expense_date;
```

### 6. Error Handling
Implement proper error handling for:
- Invalid date formats
- `fromDate` > `toDate`
- Missing required parameters
- Database query failures
- Business ID validation

### 7. Testing
Test the following scenarios:
1. **Valid date range:** `from=2026-08-01&to=2026-08-20`
2. **Single day range:** `from=2026-08-20&to=2026-08-20`
3. **Invalid date format:** `from=2026/08/01&to=2026-08-20` (should return 400)
4. **Invalid range:** `from=2026-08-20&to=2026-08-01` (should return 400)
5. **Backward compatibility:** `type=day&date=2026-08-20` (should work as before)
6. **Missing parameters:** No parameters (should return 400)

### 8. Performance Considerations
- Add database indexes on date columns for efficient range queries
- Consider caching for frequently accessed date ranges
- Implement pagination for expenses if the range is large
- Add query timeout limits to prevent long-running queries

### 9. Frontend Integration
The frontend is already implemented and will call:
```
GET /api/businesses/{businessId}/calendar/detail?from={fromDate}&to={toDate}
```

Example request:
```
GET /api/businesses/3525754e-78b6-43d0-8453-eaa052641f0c/calendar/detail?from=2026-08-01&to=2026-08-20
```

## Summary
This implementation maintains backward compatibility while adding the requested custom date range functionality. The key changes are:
1. Accept optional `from` and `to` query parameters
2. Aggregate data across the specified date range
3. Maintain the same response structure for consistency
4. Implement proper validation and error handling