# Medcosta Soft Delete Migration

This directory contains the SQL migration script to implement the centralized
soft delete functionality for the Medcosta medical dashboard.

## Migration Overview

The migration script (`migrate_soft_deletes.sql`) will:

1. **Modify the `deleted_visits` table** to add columns for tracking deleted
   records from all tables
2. **Migrate existing soft-deleted records** from all tables into
   `deleted_visits` with proper `dataSource` tracking
3. **Set up automatic triggers** to handle future soft deletes

## Tables Covered

-  `locations`
-  `insurance_companies`
-  `providers`
-  `diagnosis_codes`
-  `procedures`
-  `modifiers`

## How to Run the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Log into your Supabase dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `migrate_soft_deletes.sql`
4. Paste into a new query
5. Click **Run** to execute

### Option 2: psql Command Line

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the migration script
\i migrate_soft_deletes.sql
```

### Option 3: Using a Database Client

Import and run the `migrate_soft_deletes.sql` file using your preferred database
client (pgAdmin, DBeaver, etc.).

## What the Migration Does

### 1. Table Structure Updates

-  Adds `dataSource`, `original_id`, `record_name`, etc. to `deleted_visits`
-  Updates existing records to have `dataSource = 'visits'`

### 2. Data Migration

-  Finds all records where `is_active = false` in each table
-  Creates corresponding entries in `deleted_visits` with appropriate field
   mappings
-  Preserves all original data while centralizing deleted record tracking

### 3. Automation Setup

-  Creates `add_to_deleted_visits()` function
-  Sets up triggers on all tables to automatically track future soft deletes
-  Ensures consistent behavior across all data tables

## Field Mappings

Each table's fields are mapped to the common `deleted_visits` schema:

| Source Table        | record_name    | CaseNumber     | speciality       | record_description             |
| ------------------- | -------------- | -------------- | ---------------- | ------------------------------ |
| locations           | location_name  | npi            | 'Administration' | "Name - City, State"           |
| insurance_companies | name           | insured_id     | 'Insurance'      | "Name - City, State"           |
| providers           | name           | npi            | specialty        | "Name - Specialty (NPI: npi)"  |
| diagnosis_codes     | diagnosis_code | diagnosis_code | category         | "Code - Description"           |
| procedures          | procedure_code | procedure_code | specialty        | "Code - Description ($amount)" |
| modifiers           | modifier_code  | modifier_code  | specialty        | "Code - Name: Description"     |

## Verification Queries

After running the migration, you can verify it worked with these queries:

```sql
-- Check total deleted records by source
SELECT dataSource, COUNT(*) as count
FROM deleted_visits
GROUP BY dataSource
ORDER BY count DESC;

-- Check specific table's deleted records
SELECT * FROM deleted_visits
WHERE dataSource = 'providers'
ORDER BY EventDate DESC
LIMIT 10;

-- Verify triggers are installed
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%soft_delete_trigger%';
```

## Post-Migration

After running this migration:

1. ✅ The DeleteTable.jsx page will show all deleted records from any table
2. ✅ Users can filter by table type using the dropdown
3. ✅ Restore functionality will work correctly
4. ✅ Permanent delete will remove from both tables
5. ✅ Future soft deletes will be automatically tracked

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Drop the triggers
DROP TRIGGER IF EXISTS locations_soft_delete_trigger ON locations;
DROP TRIGGER IF EXISTS insurance_companies_soft_delete_trigger ON insurance_companies;
DROP TRIGGER IF EXISTS providers_soft_delete_trigger ON providers;
DROP TRIGGER IF EXISTS diagnosis_codes_soft_delete_trigger ON diagnosis_codes;
DROP TRIGGER IF EXISTS procedures_soft_delete_trigger ON procedures;
DROP TRIGGER IF EXISTS modifiers_soft_delete_trigger ON modifiers;

-- Drop the function
DROP FUNCTION IF EXISTS add_to_deleted_visits();

-- Remove the added columns (optional - this will lose the migrated data)
-- ALTER TABLE deleted_visits DROP COLUMN IF EXISTS dataSource;
-- ALTER TABLE deleted_visits DROP COLUMN IF EXISTS original_id;
-- etc.
```

## Support

If you encounter any issues with the migration:

1. Check the Supabase logs for any error messages
2. Verify your database has the required tables
3. Ensure you have the necessary permissions to modify the schema
4. Contact your database administrator if needed

---

**⚠️ Important**: Always backup your database before running any migration
script!
