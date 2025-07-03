# File Organization Summary

This document summarizes the file reorganization performed to clean up the
project structure.

## 📁 **SQL Files** → `sql/` directory

All database-related SQL scripts have been moved to the `sql/` folder:

### Database Setup & Migration

-  `database_migration.sql` - Main database schema and tables
-  `add_default_location.sql` - Creates default clinic location
-  `add_default_providers.sql` - Creates default doctors/providers
-  `cleanup_and_add_providers.sql` - Cleanup and re-creation of providers

### User & Role Management

-  `update_admin_user.sql` - Sets up admin users
-  `update_roles.sql` - Role management and permissions
-  `fix_permissions.sql` - Fixes user permissions
-  `force_fix_profile.sql` - Forces profile creation/updates

### Debugging & Troubleshooting

-  `debug_profile.sql` - Profile debugging queries
-  `debug_authentication.sql` - Authentication debugging
-  `targeted_permission_test.sql` - Permission testing
-  `create_permission_test_function.sql` - Permission test functions
-  `test_appointments.sql` - Appointment testing queries

### Security & Access

-  `fix_appointments_rls.sql` - Fixes Row Level Security for appointments

## 📚 **Documentation Files** → `Docs/` directory

All documentation and guides have been organized in the `Docs/` folder:

### Backend & Database

-  `SUPABASE_BACKEND_DOCUMENTATION.md` - Complete backend documentation
-  `SUPABASE_MIGRATION_SCRIPTS.md` - Migration script documentation
-  `IMPLEMENTATION_GUIDE.md` - Implementation guidelines
-  `SETUP_GUIDE.md` - Setup instructions
-  `PERMISSION_TROUBLESHOOTING.md` - Permission troubleshooting guide

### Feature Documentation

-  `BUNDLE_OPTIMIZATION.md` - Bundle optimization strategies
-  `BUNDLE_OPTIMIZATION_IMPLEMENTATION.md` - Implementation details
-  `DELETE_VISIT_ENHANCEMENTS.md` - Delete visit feature documentation
-  `MULTI_STEP_FORM_ENHANCEMENTS.md` - Multi-step form documentation

## 📄 **Root Directory**

Only essential project files remain in the root:

-  `README.md` - Main project README (kept in root)
-  All other configuration files (package.json, vite.config.js, etc.)

## 🎯 **Benefits of This Organization**

1. **Clear Separation**: Database scripts separated from application code
2. **Easy Navigation**: All documentation in one place
3. **Better Maintenance**: Easier to find and manage specific types of files
4. **Professional Structure**: Follows common project organization patterns
5. **Reduced Clutter**: Clean root directory with only essential files

## 🚀 **Usage**

-  **SQL Scripts**: Run scripts from `sql/` directory in Supabase SQL Editor
-  **Documentation**: Reference guides in `Docs/` directory for implementation
   help
-  **Development**: Main application code remains in `src/` directory
