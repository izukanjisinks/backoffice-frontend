# Golang Backend Implementation Guide

## Enterprise Backoffice API with Workflow Engine

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Models & Entities](#models--entities)
6. [API Endpoints](#api-endpoints)
7. [Services & Business Logic](#services--business-logic)
8. [Workflow Engine](#workflow-engine)
9. [Email Service](#email-service)
10. [Authentication & Authorization](#authentication--authorization)
11. [Middleware](#middleware)
12. [Configuration](#configuration)
13. [Testing Strategy](#testing-strategy)
14. [Deployment](#deployment)
15. [Implementation Roadmap](#implementation-roadmap)

---

## Project Overview

### Purpose

A RESTful API backend built with Golang to power the enterprise backoffice system. Handles company management, subscription tiers, multi-stage workflow approvals, and email notifications.

### Core Services

| Service | Responsibility |
|---------|----------------|
| **Auth Service** | JWT authentication, session management, password hashing |
| **Company Service** | Company CRUD, credential generation, status management |
| **Subscription Service** | Tier management, permission assignment |
| **Workflow Service** | Multi-stage approval engine, state machine |
| **Onboarding Service** | Registration request handling, workflow initiation |
| **Email Service** | SMTP configuration, template rendering, delivery |
| **Dashboard Service** | Analytics aggregation, statistics computation |

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Go 1.22+ | Core language |
| Gin / Chi / Echo | HTTP router (examples use Gin) |
| GORM | ORM for PostgreSQL |
| PostgreSQL 15+ | Primary database |
| Redis | Caching, session storage, rate limiting |
| golang-jwt/jwt/v5 | JWT token handling |
| gomail/v2 | SMTP email sending |
| go-playground/validator/v10 | Request validation |
| viper | Configuration management |
| zap / zerolog | Structured logging |
| testify | Testing framework |
| golang-migrate | Database migrations |
| swaggo/swag | OpenAPI documentation |

---

## Project Structure

```
backoffice-api/
├── cmd/
│   └── server/
│       └── main.go                 # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go               # Configuration loading
│   ├── database/
│   │   ├── database.go             # Database connection
│   │   ├── redis.go                # Redis connection
│   │   └── migrations/             # SQL migration files
│   │       ├── 000001_init.up.sql
│   │       ├── 000001_init.down.sql
│   │       └── ...
│   ├── models/
│   │   ├── user.go
│   │   ├── company.go
│   │   ├── subscription.go
│   │   ├── workflow.go
│   │   ├── onboarding.go
│   │   ├── smtp.go
│   │   └── audit.go
│   ├── repository/
│   │   ├── user_repository.go
│   │   ├── company_repository.go
│   │   ├── subscription_repository.go
│   │   ├── workflow_repository.go
│   │   ├── onboarding_repository.go
│   │   └── smtp_repository.go
│   ├── services/
│   │   ├── auth_service.go
│   │   ├── company_service.go
│   │   ├── subscription_service.go
│   │   ├── workflow_service.go
│   │   ├── onboarding_service.go
│   │   ├── email_service.go
│   │   └── dashboard_service.go
│   ├── handlers/
│   │   ├── auth_handler.go
│   │   ├── company_handler.go
│   │   ├── subscription_handler.go
│   │   ├── workflow_handler.go
│   │   ├── onboarding_handler.go
│   │   ├── smtp_handler.go
│   │   └── dashboard_handler.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── rbac.go
│   │   ├── logging.go
│   │   ├── cors.go
│   │   ├── ratelimit.go
│   │   └── recovery.go
│   ├── dto/
│   │   ├── auth_dto.go
│   │   ├── company_dto.go
│   │   ├── subscription_dto.go
│   │   ├── workflow_dto.go
│   │   ├── onboarding_dto.go
│   │   └── common_dto.go
│   ├── errors/
│   │   └── errors.go               # Custom error types
│   └── utils/
│       ├── password.go
│       ├── jwt.go
│       ├── validation.go
│       ├── pagination.go
│       └── random.go
├── pkg/
│   └── logger/
│       └── logger.go               # Logging package
├── docs/
│   └── swagger/                    # Generated API docs
├── scripts/
│   ├── migrate.sh
│   └── seed.sh
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │   companies     │       │subscription_tiers│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ email           │       │ name            │       │ name            │
│ password_hash   │       │ slug            │       │ description     │
│ role            │◀──────│ created_by (FK) │       │ level           │
│ first_name      │       │ subscription_id │──────▶│ permissions[]   │
│ last_name       │       │ status          │       │ price           │
│ is_active       │       │ admin_user_id   │       │ is_active       │
│ created_at      │       │ created_at      │       │ created_at      │
│ updated_at      │       │ updated_at      │       │ updated_at      │
│ last_login_at   │       └─────────────────┘       └─────────────────┘
└─────────────────┘               │
         │                        │
         │                        ▼
         ▼               ┌─────────────────┐
┌─────────────────┐      │onboarding_reqs  │
│   workflows     │      ├─────────────────┤
├─────────────────┤      │ id (PK)         │
│ id (PK)         │◀─────│ workflow_id(FK) │
│ type            │      │ company_name    │
│ reference_id    │      │ company_data    │
│ current_stage   │      │ status          │
│ status          │      │ submitted_at    │
│ initiated_by(FK)│      │ processed_by(FK)│
│ created_at      │      │ updated_at      │
│ completed_at    │      └─────────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│workflow_actions │      │  smtp_config    │
├─────────────────┤      ├─────────────────┤
│ id (PK)         │      │ id (PK)         │
│ workflow_id(FK) │      │ host            │
│ stage           │      │ port            │
│ action          │      │ username        │
│ user_id (FK)    │      │ password_enc    │
│ comment         │      │ from_email      │
│ created_at      │      │ from_name       │
└─────────────────┘      │ encryption      │
                         │ is_active       │
┌─────────────────┐      │ updated_at      │
│ email_templates │      └─────────────────┘
├─────────────────┤
│ id (PK)         │      ┌─────────────────┐
│ type            │      │  audit_logs     │
│ name            │      ├─────────────────┤
│ subject         │      │ id (PK)         │
│ body_html       │      │ entity_type     │
│ body_text       │      │ entity_id       │
│ variables[]     │      │ action          │
│ is_active       │      │ user_id (FK)    │
│ updated_at      │      │ old_values      │
└─────────────────┘      │ new_values      │
                         │ ip_address      │
                         │ created_at      │
                         └─────────────────┘
```

### Migration Files

```sql
-- migrations/000001_init.up.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'ceo', 'head_commercial', 'company_secretary', 'viewer')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Subscription tiers table
CREATE TABLE subscription_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,
    permissions TEXT[] DEFAULT '{}',
    price DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscription_tiers_level ON subscription_tiers(level);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    tax_id VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    address JSONB,
    subscription_tier_id UUID REFERENCES subscription_tiers(id),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    admin_user_id UUID,
    created_by UUID NOT NULL REFERENCES users(id),
    onboarding_request_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_subscription ON companies(subscription_tier_id);
CREATE INDEX idx_companies_slug ON companies(slug);

-- Workflows table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('onboarding', 'company_update', 'subscription_change')),
    reference_id UUID NOT NULL,
    current_stage INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested', 'cancelled')),
    initiated_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_type ON workflows(type);
CREATE INDEX idx_workflows_current_stage ON workflows(current_stage);

-- Workflow actions table
CREATE TABLE workflow_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    stage INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('approve', 'reject', 'request_changes')),
    user_id UUID NOT NULL REFERENCES users(id),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workflow_actions_workflow ON workflow_actions(workflow_id);

-- Onboarding requests table
CREATE TABLE onboarding_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'incomplete')),
    workflow_id UUID REFERENCES workflows(id),
    processed_by UUID REFERENCES users(id),
    notes TEXT,
    submitted_ip VARCHAR(50),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_onboarding_requests_status ON onboarding_requests(status);

-- SMTP configuration table
CREATE TABLE smtp_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL,
    username VARCHAR(255),
    password_encrypted TEXT,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    encryption VARCHAR(20) DEFAULT 'tls' CHECK (encryption IN ('tls', 'ssl', 'none')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_tiers_updated_at BEFORE UPDATE ON subscription_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_requests_updated_at BEFORE UPDATE ON onboarding_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smtp_configs_updated_at BEFORE UPDATE ON smtp_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Models & Entities

### User Model

```go
// internal/models/user.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/gorm"
)

type UserRole string

const (
    RoleSuperAdmin       UserRole = "super_admin"
    RoleCEO              UserRole = "ceo"
    RoleHeadCommercial   UserRole = "head_commercial"
    RoleCompanySecretary UserRole = "company_secretary"
    RoleViewer           UserRole = "viewer"
)

type User struct {
    ID           uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Email        string         `gorm:"uniqueIndex;not null" json:"email"`
    PasswordHash string         `gorm:"not null" json:"-"`
    Role         UserRole       `gorm:"not null" json:"role"`
    FirstName    string         `gorm:"not null" json:"firstName"`
    LastName     string         `gorm:"not null" json:"lastName"`
    IsActive     bool           `gorm:"default:true" json:"isActive"`
    CreatedAt    time.Time      `gorm:"autoCreateTime" json:"createdAt"`
    UpdatedAt    time.Time      `gorm:"autoUpdateTime" json:"updatedAt"`
    LastLoginAt  *time.Time     `json:"lastLoginAt,omitempty"`
}

func (u *User) FullName() string {
    return u.FirstName + " " + u.LastName
}

func (u *User) HasPermission(permission string) bool {
    if u.Role == RoleSuperAdmin {
        return true
    }
    
    rolePermissions := GetRolePermissions(u.Role)
    for _, p := range rolePermissions {
        if p == permission || p == "*" {
            return true
        }
    }
    return false
}

func GetRolePermissions(role UserRole) []string {
    permissions := map[UserRole][]string{
        RoleSuperAdmin: {"*"},
        RoleCEO: {
            "dashboard:view",
            "companies:view", "companies:create", "companies:update", "companies:delete",
            "subscriptions:view", "subscriptions:create", "subscriptions:update", "subscriptions:delete",
            "workflows:view", "workflows:approve",
            "onboarding:view", "onboarding:process",
            "smtp:view",
        },
        RoleHeadCommercial: {
            "dashboard:view",
            "companies:view", "companies:create", "companies:update",
            "subscriptions:view", "subscriptions:create", "subscriptions:update",
            "workflows:view", "workflows:approve",
            "onboarding:view", "onboarding:process",
        },
        RoleCompanySecretary: {
            "dashboard:view",
            "companies:view",
            "workflows:view", "workflows:approve",
            "onboarding:view", "onboarding:process",
        },
        RoleViewer: {
            "dashboard:view",
            "companies:view",
            "subscriptions:view",
        },
    }
    
    return permissions[role]
}

// RefreshToken model
type RefreshToken struct {
    ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
    UserID    uuid.UUID `gorm:"type:uuid;not null"`
    TokenHash string    `gorm:"not null"`
    ExpiresAt time.Time `gorm:"not null"`
    CreatedAt time.Time `gorm:"autoCreateTime"`
    User      User      `gorm:"foreignKey:UserID"`
}
```

### Company Model

```go
// internal/models/company.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/datatypes"
)

type CompanyStatus string

const (
    CompanyStatusActive    CompanyStatus = "active"
    CompanyStatusInactive  CompanyStatus = "inactive"
    CompanyStatusSuspended CompanyStatus = "suspended"
    CompanyStatusPending   CompanyStatus = "pending"
)

type Address struct {
    Street     string `json:"street"`
    City       string `json:"city"`
    State      string `json:"state"`
    PostalCode string `json:"postalCode"`
    Country    string `json:"country"`
}

type Company struct {
    ID                  uuid.UUID         `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Name                string            `gorm:"not null" json:"name"`
    Slug                string            `gorm:"uniqueIndex;not null" json:"slug"`
    RegistrationNumber  string            `gorm:"uniqueIndex" json:"registrationNumber"`
    TaxID               string            `json:"taxId"`
    Email               string            `gorm:"not null" json:"email"`
    Phone               string            `json:"phone"`
    Website             string            `json:"website"`
    Address             datatypes.JSON    `gorm:"type:jsonb" json:"address"`
    SubscriptionTierID  *uuid.UUID        `gorm:"type:uuid" json:"subscriptionTierId"`
    SubscriptionTier    *SubscriptionTier `gorm:"foreignKey:SubscriptionTierID" json:"subscriptionTier,omitempty"`
    Status              CompanyStatus     `gorm:"default:'pending'" json:"status"`
    AdminUserID         *uuid.UUID        `gorm:"type:uuid" json:"adminUserId"`
    CreatedBy           uuid.UUID         `gorm:"type:uuid;not null" json:"createdBy"`
    Creator             *User             `gorm:"foreignKey:CreatedBy" json:"creator,omitempty"`
    OnboardingRequestID *uuid.UUID        `gorm:"type:uuid" json:"onboardingRequestId"`
    CreatedAt           time.Time         `gorm:"autoCreateTime" json:"createdAt"`
    UpdatedAt           time.Time         `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (c *Company) GetAddress() (*Address, error) {
    var addr Address
    if c.Address == nil {
        return nil, nil
    }
    err := c.Address.UnmarshalJSON(c.Address)
    return &addr, err
}

func (c *Company) BeforeCreate(tx *gorm.DB) error {
    if c.Slug == "" {
        c.Slug = generateSlug(c.Name)
    }
    return nil
}

func generateSlug(name string) string {
    // Implement slug generation logic
    return strings.ToLower(strings.ReplaceAll(name, " ", "-"))
}
```

### Subscription Model

```go
// internal/models/subscription.go
package models

import (
    "time"
    "github.com/google/uuid"
    "github.com/lib/pq"
    "github.com/shopspring/decimal"
)

type SubscriptionTier struct {
    ID          uuid.UUID       `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Name        string          `gorm:"uniqueIndex;not null" json:"name"`
    Description string          `json:"description"`
    Level       int             `gorm:"not null" json:"level"`
    Permissions pq.StringArray  `gorm:"type:text[]" json:"permissions"`
    Price       decimal.Decimal `gorm:"type:decimal(10,2)" json:"price"`
    IsActive    bool            `gorm:"default:true" json:"isActive"`
    CreatedAt   time.Time       `gorm:"autoCreateTime" json:"createdAt"`
    UpdatedAt   time.Time       `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (s *SubscriptionTier) HasPermission(permission string) bool {
    for _, p := range s.Permissions {
        if p == permission {
            return true
        }
    }
    return false
}

// Permission represents a system permission
type Permission struct {
    Code        string `json:"code"`
    Label       string `json:"label"`
    Description string `json:"description"`
    Category    string `json:"category"`
}

// GetAllPermissions returns all available system permissions
func GetAllPermissions() []Permission {
    return []Permission{
        // Companies
        {Code: "company:create", Label: "Create Companies", Description: "Add new companies to the system", Category: "companies"},
        {Code: "company:read", Label: "View Companies", Description: "View company details and list", Category: "companies"},
        {Code: "company:update", Label: "Update Companies", Description: "Modify company information", Category: "companies"},
        {Code: "company:delete", Label: "Delete Companies", Description: "Remove companies from system", Category: "companies"},
        
        // Documents
        {Code: "document:upload", Label: "Upload Documents", Description: "Upload files and documents", Category: "documents"},
        {Code: "document:download", Label: "Download Documents", Description: "Download attached files", Category: "documents"},
        {Code: "document:delete", Label: "Delete Documents", Description: "Remove uploaded documents", Category: "documents"},
        
        // Reports
        {Code: "report:view", Label: "View Reports", Description: "Access system reports", Category: "reports"},
        {Code: "report:export", Label: "Export Reports", Description: "Export reports to PDF/Excel", Category: "reports"},
        {Code: "report:schedule", Label: "Schedule Reports", Description: "Set up automated report delivery", Category: "reports"},
        
        // Users
        {Code: "user:invite", Label: "Invite Users", Description: "Invite new users to the company", Category: "users"},
        {Code: "user:manage", Label: "Manage Users", Description: "Edit user roles and permissions", Category: "users"},
        {Code: "user:remove", Label: "Remove Users", Description: "Remove users from company", Category: "users"},
        
        // Integrations
        {Code: "api:access", Label: "API Access", Description: "Use REST API endpoints", Category: "integrations"},
        {Code: "webhook:manage", Label: "Manage Webhooks", Description: "Configure webhook endpoints", Category: "integrations"},
    }
}
```

### Workflow Model

```go
// internal/models/workflow.go
package models

import (
    "time"
    "github.com/google/uuid"
)

type WorkflowType string
type WorkflowStatus string
type ActionType string

const (
    WorkflowTypeOnboarding       WorkflowType = "onboarding"
    WorkflowTypeCompanyUpdate    WorkflowType = "company_update"
    WorkflowTypeSubscriptionChange WorkflowType = "subscription_change"
)

const (
    WorkflowStatusPending         WorkflowStatus = "pending"
    WorkflowStatusApproved        WorkflowStatus = "approved"
    WorkflowStatusRejected        WorkflowStatus = "rejected"
    WorkflowStatusChangesRequested WorkflowStatus = "changes_requested"
    WorkflowStatusCancelled       WorkflowStatus = "cancelled"
)

const (
    ActionApprove        ActionType = "approve"
    ActionReject         ActionType = "reject"
    ActionRequestChanges ActionType = "request_changes"
)

// WorkflowStage defines a stage in the approval process
type WorkflowStage struct {
    Order       int      `json:"order"`
    Name        string   `json:"name"`
    Role        UserRole `json:"role"`
    Description string   `json:"description"`
}

// GetWorkflowStages returns the configured workflow stages
func GetWorkflowStages() []WorkflowStage {
    return []WorkflowStage{
        {
            Order:       1,
            Name:        "Company Secretary Review",
            Role:        RoleCompanySecretary,
            Description: "Initial document verification and compliance check",
        },
        {
            Order:       2,
            Name:        "Head of Commercial Review",
            Role:        RoleHeadCommercial,
            Description: "Business viability and commercial assessment",
        },
        {
            Order:       3,
            Name:        "CEO Approval",
            Role:        RoleCEO,
            Description: "Final executive approval",
        },
    }
}

type Workflow struct {
    ID           uuid.UUID        `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Type         WorkflowType     `gorm:"not null" json:"type"`
    ReferenceID  uuid.UUID        `gorm:"type:uuid;not null" json:"referenceId"`
    CurrentStage int              `gorm:"default:1" json:"currentStage"`
    Status       WorkflowStatus   `gorm:"default:'pending'" json:"status"`
    InitiatedBy  uuid.UUID        `gorm:"type:uuid;not null" json:"initiatedBy"`
    Initiator    *User            `gorm:"foreignKey:InitiatedBy" json:"initiator,omitempty"`
    Actions      []WorkflowAction `gorm:"foreignKey:WorkflowID" json:"history,omitempty"`
    CreatedAt    time.Time        `gorm:"autoCreateTime" json:"createdAt"`
    CompletedAt  *time.Time       `json:"completedAt,omitempty"`
}

func (w *Workflow) GetCurrentStageInfo() *WorkflowStage {
    stages := GetWorkflowStages()
    for _, stage := range stages {
        if stage.Order == w.CurrentStage {
            return &stage
        }
    }
    return nil
}

func (w *Workflow) CanUserApprove(user *User) bool {
    if user.Role == RoleSuperAdmin {
        return true
    }
    
    currentStage := w.GetCurrentStageInfo()
    if currentStage == nil {
        return false
    }
    
    return currentStage.Role == user.Role
}

func (w *Workflow) IsComplete() bool {
    return w.Status == WorkflowStatusApproved || 
           w.Status == WorkflowStatusRejected || 
           w.Status == WorkflowStatusCancelled
}

type WorkflowAction struct {
    ID         uuid.UUID  `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    WorkflowID uuid.UUID  `gorm:"type:uuid;not null" json:"workflowId"`
    Stage      int        `gorm:"not null" json:"stage"`
    Action     ActionType `gorm:"not null" json:"action"`
    UserID     uuid.UUID  `gorm:"type:uuid;not null" json:"userId"`
    User       *User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    Comment    string     `json:"comment,omitempty"`
    CreatedAt  time.Time  `gorm:"autoCreateTime" json:"timestamp"`
}
```

### Onboarding Model

```go
// internal/models/onboarding.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/datatypes"
)

type OnboardingStatus string

const (
    OnboardingStatusPending    OnboardingStatus = "pending"
    OnboardingStatusInProgress OnboardingStatus = "in_progress"
    OnboardingStatusApproved   OnboardingStatus = "approved"
    OnboardingStatusRejected   OnboardingStatus = "rejected"
    OnboardingStatusIncomplete OnboardingStatus = "incomplete"
)

// OnboardingCompanyData represents the data submitted in the registration form
type OnboardingCompanyData struct {
    // Company Information
    RegistrationNumber string `json:"registrationNumber"`
    TaxID              string `json:"taxId"`
    Industry           string `json:"industry"`
    CompanySize        string `json:"companySize"` // small, medium, large, enterprise
    
    // Address
    Address Address `json:"address"`
    
    // Primary Contact
    PrimaryContact struct {
        FirstName string `json:"firstName"`
        LastName  string `json:"lastName"`
        Email     string `json:"email"`
        Phone     string `json:"phone"`
        Position  string `json:"position"`
    } `json:"primaryContact"`
    
    // Additional Information
    Website               string   `json:"website"`
    Description           string   `json:"description"`
    ExpectedUsers         int      `json:"expectedUsers"`
    PreferredSubscription string   `json:"preferredSubscriptionTier"`
    
    // Attachments
    Attachments []struct {
        ID         string    `json:"id"`
        Name       string    `json:"name"`
        Type       string    `json:"type"`
        URL        string    `json:"url"`
        UploadedAt time.Time `json:"uploadedAt"`
    } `json:"attachments"`
}

type OnboardingRequest struct {
    ID          uuid.UUID         `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    CompanyName string            `gorm:"not null" json:"companyName"`
    CompanyData datatypes.JSON    `gorm:"type:jsonb;not null" json:"companyData"`
    Status      OnboardingStatus  `gorm:"default:'pending'" json:"status"`
    WorkflowID  *uuid.UUID        `gorm:"type:uuid" json:"workflowId"`
    Workflow    *Workflow         `gorm:"foreignKey:WorkflowID" json:"workflow,omitempty"`
    ProcessedBy *uuid.UUID        `gorm:"type:uuid" json:"processedBy"`
    Processor   *User             `gorm:"foreignKey:ProcessedBy" json:"processor,omitempty"`
    Notes       string            `json:"notes,omitempty"`
    SubmittedIP string            `json:"submittedIp,omitempty"`
    SubmittedAt time.Time         `gorm:"autoCreateTime" json:"submittedAt"`
    UpdatedAt   time.Time         `gorm:"autoUpdateTime" json:"updatedAt"`
}

func (o *OnboardingRequest) GetCompanyData() (*OnboardingCompanyData, error) {
    var data OnboardingCompanyData
    err := json.Unmarshal(o.CompanyData, &data)
    return &data, err
}

func (o *OnboardingRequest) SetCompanyData(data *OnboardingCompanyData) error {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return err
    }
    o.CompanyData = jsonData
    return nil
}
```

### SMTP & Email Models

```go
// internal/models/smtp.go
package models

import (
    "time"
    "github.com/google/uuid"
    "github.com/lib/pq"
)

type EncryptionType string

const (
    EncryptionTLS  EncryptionType = "tls"
    EncryptionSSL  EncryptionType = "ssl"
    EncryptionNone EncryptionType = "none"
)

type SmtpConfig struct {
    ID                uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Host              string         `gorm:"not null" json:"host"`
    Port              int            `gorm:"not null" json:"port"`
    Username          string         `json:"username"`
    PasswordEncrypted string         `json:"-"` // Never expose in JSON
    FromEmail         string         `gorm:"not null" json:"fromEmail"`
    FromName          string         `json:"fromName"`
    Encryption        EncryptionType `gorm:"default:'tls'" json:"encryption"`
    IsActive          bool           `gorm:"default:true" json:"isActive"`
    CreatedAt         time.Time      `gorm:"autoCreateTime" json:"createdAt"`
    UpdatedAt         time.Time      `gorm:"autoUpdateTime" json:"updatedAt"`
}

type EmailTemplateType string

const (
    TemplateOnboardingReceived   EmailTemplateType = "onboarding_received"
    TemplateWorkflowNotification EmailTemplateType = "workflow_notification"
    TemplateCompanyApproved      EmailTemplateType = "company_approved"
    TemplateCompanyRejected      EmailTemplateType = "company_rejected"
    TemplatePasswordReset        EmailTemplateType = "password_reset"
    TemplateWelcomeEmail         EmailTemplateType = "welcome_email"
)

type EmailTemplate struct {
    ID        uuid.UUID         `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    Type      EmailTemplateType `gorm:"uniqueIndex;not null" json:"type"`
    Name      string            `gorm:"not null" json:"name"`
    Subject   string            `gorm:"not null" json:"subject"`
    BodyHTML  string            `gorm:"not null" json:"bodyHtml"`
    BodyText  string            `json:"bodyText"`
    Variables pq.StringArray    `gorm:"type:text[]" json:"variables"`
    IsActive  bool              `gorm:"default:true" json:"isActive"`
    CreatedAt time.Time         `gorm:"autoCreateTime" json:"createdAt"`
    UpdatedAt time.Time         `gorm:"autoUpdateTime" json:"updatedAt"`
}

// GetTemplateVariables returns available variables for each template type
func GetTemplateVariables(templateType EmailTemplateType) []string {
    variables := map[EmailTemplateType][]string{
        TemplateOnboardingReceived: {
            "{{company_name}}",
            "{{contact_name}}",
            "{{contact_email}}",
            "{{submitted_date}}",
            "{{request_link}}",
        },
        TemplateWorkflowNotification: {
            "{{workflow_type}}",
            "{{company_name}}",
            "{{current_stage}}",
            "{{action_required}}",
            "{{approver_name}}",
            "{{workflow_link}}",
        },
        TemplateCompanyApproved: {
            "{{company_name}}",
            "{{contact_name}}",
            "{{login_url}}",
            "{{username}}",
            "{{temporary_password}}",
            "{{subscription_tier}}",
        },
        TemplateCompanyRejected: {
            "{{company_name}}",
            "{{contact_name}}",
            "{{rejection_reason}}",
            "{{contact_email}}",
        },
        TemplatePasswordReset: {
            "{{user_name}}",
            "{{reset_link}}",
            "{{expiry_time}}",
        },
        TemplateWelcomeEmail: {
            "{{user_name}}",
            "{{company_name}}",
            "{{login_url}}",
        },
    }
    
    return variables[templateType]
}
```

### Audit Log Model

```go
// internal/models/audit.go
package models

import (
    "time"
    "github.com/google/uuid"
    "gorm.io/datatypes"
)

type AuditLog struct {
    ID         uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()" json:"id"`
    EntityType string         `gorm:"not null" json:"entityType"`
    EntityID   uuid.UUID      `gorm:"type:uuid;not null" json:"entityId"`
    Action     string         `gorm:"not null" json:"action"` // create, update, delete
    UserID     *uuid.UUID     `gorm:"type:uuid" json:"userId"`
    User       *User          `gorm:"foreignKey:UserID" json:"user,omitempty"`
    OldValues  datatypes.JSON `gorm:"type:jsonb" json:"oldValues,omitempty"`
    NewValues  datatypes.JSON `gorm:"type:jsonb" json:"newValues,omitempty"`
    IPAddress  string         `json:"ipAddress,omitempty"`
    CreatedAt  time.Time      `gorm:"autoCreateTime" json:"createdAt"`
}
```

---

## API Endpoints

### Authentication Endpoints

```go
// POST /api/v1/auth/login
// POST /api/v1/auth/refresh
// POST /api/v1/auth/logout
// GET  /api/v1/auth/me
```

### Companies Endpoints

```go
// GET    /api/v1/companies          - List companies (paginated, filtered)
// GET    /api/v1/companies/:id      - Get company by ID
// POST   /api/v1/companies          - Create company
// PUT    /api/v1/companies/:id      - Update company
// DELETE /api/v1/companies/:id      - Delete company
// POST   /api/v1/companies/:id/generate-credentials - Generate admin credentials
// PUT    /api/v1/companies/:id/status - Update company status
```

### Subscriptions Endpoints

```go
// GET    /api/v1/subscriptions/tiers       - List all tiers
// GET    /api/v1/subscriptions/tiers/:id   - Get tier by ID
// POST   /api/v1/subscriptions/tiers       - Create tier
// PUT    /api/v1/subscriptions/tiers/:id   - Update tier
// DELETE /api/v1/subscriptions/tiers/:id   - Delete tier
// GET    /api/v1/subscriptions/permissions - Get available permissions
```

### Workflows Endpoints

```go
// GET    /api/v1/workflows          - List workflows (paginated, filtered)
// GET    /api/v1/workflows/:id      - Get workflow by ID
// POST   /api/v1/workflows/:id/approve        - Approve current stage
// POST   /api/v1/workflows/:id/reject         - Reject workflow
// POST   /api/v1/workflows/:id/request-changes - Request changes
// GET    /api/v1/workflows/stages   - Get workflow stage configuration
```

### Onboarding Endpoints

```go
// GET    /api/v1/onboarding/requests          - List requests (paginated)
// GET    /api/v1/onboarding/requests/:id      - Get request by ID
// POST   /api/v1/onboarding/requests/:id/initiate-workflow - Start approval
// PUT    /api/v1/onboarding/requests/:id/status - Update status
// POST   /api/v1/public/register              - Public registration endpoint
```

### SMTP Endpoints

```go
// GET    /api/v1/smtp/config           - Get SMTP configuration
// PUT    /api/v1/smtp/config           - Save SMTP configuration
// POST   /api/v1/smtp/test-connection  - Test SMTP connection
// POST   /api/v1/smtp/send-test        - Send test email
// GET    /api/v1/smtp/templates        - List email templates
// PUT    /api/v1/smtp/templates/:id    - Update template
```

### Dashboard Endpoints

```go
// GET    /api/v1/dashboard/stats         - Get dashboard statistics
// GET    /api/v1/dashboard/activity      - Get recent activity
// GET    /api/v1/dashboard/company-growth - Get company growth data
```

---

## Services & Business Logic

### Company Service

```go
// internal/services/company_service.go
package services

import (
    "context"
    "errors"
    "github.com/google/uuid"
    "backoffice-api/internal/models"
    "backoffice-api/internal/repository"
    "backoffice-api/internal/dto"
    "backoffice-api/internal/utils"
)

type CompanyService struct {
    companyRepo      *repository.CompanyRepository
    subscriptionRepo *repository.SubscriptionRepository
    emailService     *EmailService
    auditService     *AuditService
}

func NewCompanyService(
    companyRepo *repository.CompanyRepository,
    subscriptionRepo *repository.SubscriptionRepository,
    emailService *EmailService,
    auditService *AuditService,
) *CompanyService {
    return &CompanyService{
        companyRepo:      companyRepo,
        subscriptionRepo: subscriptionRepo,
        emailService:     emailService,
        auditService:     auditService,
    }
}

func (s *CompanyService) GetAll(ctx context.Context, filters dto.CompanyFilters) (*dto.PaginatedResponse[models.Company], error) {
    companies, total, err := s.companyRepo.FindAll(ctx, filters)
    if err != nil {
        return nil, err
    }
    
    return &dto.PaginatedResponse[models.Company]{
        Data:  companies,
        Total: total,
        Page:  filters.Page,
        Limit: filters.Limit,
    }, nil
}

func (s *CompanyService) GetByID(ctx context.Context, id uuid.UUID) (*models.Company, error) {
    return s.companyRepo.FindByID(ctx, id)
}

func (s *CompanyService) Create(ctx context.Context, data dto.CreateCompanyRequest, createdBy uuid.UUID) (*models.Company, error) {
    // Validate subscription tier if provided
    if data.SubscriptionTierID != nil {
        tier, err := s.subscriptionRepo.FindByID(ctx, *data.SubscriptionTierID)
        if err != nil {
            return nil, errors.New("invalid subscription tier")
        }
        if !tier.IsActive {
            return nil, errors.New("subscription tier is inactive")
        }
    }
    
    // Check for duplicate registration number
    existing, _ := s.companyRepo.FindByRegistrationNumber(ctx, data.RegistrationNumber)
    if existing != nil {
        return nil, errors.New("company with this registration number already exists")
    }
    
    company := &models.Company{
        Name:               data.Name,
        RegistrationNumber: data.RegistrationNumber,
        TaxID:              data.TaxID,
        Email:              data.Email,
        Phone:              data.Phone,
        Website:            data.Website,
        Address:            data.Address.ToJSON(),
        SubscriptionTierID: data.SubscriptionTierID,
        Status:             models.CompanyStatusPending,
        CreatedBy:          createdBy,
    }
    
    if err := s.companyRepo.Create(ctx, company); err != nil {
        return nil, err
    }
    
    // Audit log
    s.auditService.Log(ctx, "company", company.ID, "create", nil, company)
    
    return company, nil
}

func (s *CompanyService) Update(ctx context.Context, id uuid.UUID, data dto.UpdateCompanyRequest) (*models.Company, error) {
    company, err := s.companyRepo.FindByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    oldValues := *company
    
    // Update fields
    if data.Name != "" {
        company.Name = data.Name
    }
    if data.Email != "" {
        company.Email = data.Email
    }
    if data.Phone != nil {
        company.Phone = *data.Phone
    }
    if data.Website != nil {
        company.Website = *data.Website
    }
    if data.Address != nil {
        company.Address = data.Address.ToJSON()
    }
    if data.SubscriptionTierID != nil {
        company.SubscriptionTierID = data.SubscriptionTierID
    }
    
    if err := s.companyRepo.Update(ctx, company); err != nil {
        return nil, err
    }
    
    // Audit log
    s.auditService.Log(ctx, "company", company.ID, "update", &oldValues, company)
    
    return company, nil
}

func (s *CompanyService) Delete(ctx context.Context, id uuid.UUID) error {
    company, err := s.companyRepo.FindByID(ctx, id)
    if err != nil {
        return err
    }
    
    if err := s.companyRepo.Delete(ctx, id); err != nil {
        return err
    }
    
    // Audit log
    s.auditService.Log(ctx, "company", id, "delete", company, nil)
    
    return nil
}

func (s *CompanyService) GenerateCredentials(ctx context.Context, companyID uuid.UUID) (*dto.CompanyCredentials, error) {
    company, err := s.companyRepo.FindByID(ctx, companyID)
    if err != nil {
        return nil, err
    }
    
    if company.Status != models.CompanyStatusApproved && company.Status != models.CompanyStatusActive {
        return nil, errors.New("company must be approved before generating credentials")
    }
    
    // Generate temporary password
    tempPassword := utils.GenerateSecurePassword(12)
    
    // Create admin user for the company
    adminUser := &models.User{
        Email:        company.Email,
        PasswordHash: utils.HashPassword(tempPassword),
        Role:         models.RoleViewer, // Default role for company admins
        FirstName:    "Admin",
        LastName:     company.Name,
        IsActive:     true,
    }
    
    // Save admin user and update company
    // ... (implementation details)
    
    // Send email with credentials
    s.emailService.SendCompanyApprovedEmail(ctx, company, tempPassword)
    
    return &dto.CompanyCredentials{
        AdminEmail:        company.Email,
        TemporaryPassword: tempPassword,
    }, nil
}

func (s *CompanyService) UpdateStatus(ctx context.Context, id uuid.UUID, status models.CompanyStatus) (*models.Company, error) {
    company, err := s.companyRepo.FindByID(ctx, id)
    if err != nil {
        return nil, err
    }
    
    oldStatus := company.Status
    company.Status = status
    
    if err := s.companyRepo.Update(ctx, company); err != nil {
        return nil, err
    }
    
    // Audit log
    s.auditService.Log(ctx, "company", id, "status_change", 
        map[string]interface{}{"status": oldStatus},
        map[string]interface{}{"status": status})
    
    return company, nil
}
```

---

## Workflow Engine

```go
// internal/services/workflow_service.go
package services

import (
    "context"
    "errors"
    "time"
    "github.com/google/uuid"
    "backoffice-api/internal/models"
    "backoffice-api/internal/repository"
    "backoffice-api/internal/dto"
)

var (
    ErrWorkflowNotFound    = errors.New("workflow not found")
    ErrWorkflowCompleted   = errors.New("workflow is already completed")
    ErrUnauthorizedApproval = errors.New("user not authorized to approve this stage")
    ErrInvalidAction       = errors.New("invalid workflow action")
)

type WorkflowService struct {
    workflowRepo    *repository.WorkflowRepository
    onboardingRepo  *repository.OnboardingRepository
    companyService  *CompanyService
    emailService    *EmailService
    auditService    *AuditService
}

func NewWorkflowService(
    workflowRepo *repository.WorkflowRepository,
    onboardingRepo *repository.OnboardingRepository,
    companyService *CompanyService,
    emailService *EmailService,
    auditService *AuditService,
) *WorkflowService {
    return &WorkflowService{
        workflowRepo:   workflowRepo,
        onboardingRepo: onboardingRepo,
        companyService: companyService,
        emailService:   emailService,
        auditService:   auditService,
    }
}

func (s *WorkflowService) GetAll(ctx context.Context, filters dto.WorkflowFilters) (*dto.PaginatedResponse[models.Workflow], error) {
    workflows, total, err := s.workflowRepo.FindAll(ctx, filters)
    if err != nil {
        return nil, err
    }
    
    return &dto.PaginatedResponse[models.Workflow]{
        Data:  workflows,
        Total: total,
        Page:  filters.Page,
        Limit: filters.Limit,
    }, nil
}

func (s *WorkflowService) GetByID(ctx context.Context, id uuid.UUID) (*models.Workflow, error) {
    return s.workflowRepo.FindByID(ctx, id)
}

func (s *WorkflowService) InitiateWorkflow(ctx context.Context, workflowType models.WorkflowType, referenceID uuid.UUID, initiatedBy uuid.UUID) (*models.Workflow, error) {
    workflow := &models.Workflow{
        Type:         workflowType,
        ReferenceID:  referenceID,
        CurrentStage: 1,
        Status:       models.WorkflowStatusPending,
        InitiatedBy:  initiatedBy,
    }
    
    if err := s.workflowRepo.Create(ctx, workflow); err != nil {
        return nil, err
    }
    
    // Notify first stage approvers
    s.notifyStageApprovers(ctx, workflow)
    
    // Audit log
    s.auditService.Log(ctx, "workflow", workflow.ID, "create", nil, workflow)
    
    return workflow, nil
}

func (s *WorkflowService) ProcessApproval(ctx context.Context, workflowID uuid.UUID, user *models.User, action dto.ApprovalActionRequest) (*models.Workflow, error) {
    workflow, err := s.workflowRepo.FindByID(ctx, workflowID)
    if err != nil {
        return nil, ErrWorkflowNotFound
    }
    
    // Check if workflow is already completed
    if workflow.IsComplete() {
        return nil, ErrWorkflowCompleted
    }
    
    // Check if user can approve current stage
    if !workflow.CanUserApprove(user) {
        return nil, ErrUnauthorizedApproval
    }
    
    // Create action record
    workflowAction := &models.WorkflowAction{
        WorkflowID: workflowID,
        Stage:      workflow.CurrentStage,
        Action:     models.ActionType(action.Action),
        UserID:     user.ID,
        Comment:    action.Comment,
    }
    
    if err := s.workflowRepo.CreateAction(ctx, workflowAction); err != nil {
        return nil, err
    }
    
    // Process based on action type
    switch models.ActionType(action.Action) {
    case models.ActionApprove:
        return s.handleApproval(ctx, workflow, user)
    case models.ActionReject:
        return s.handleRejection(ctx, workflow, user, action.Comment)
    case models.ActionRequestChanges:
        return s.handleChangesRequest(ctx, workflow, user, action.Comment)
    default:
        return nil, ErrInvalidAction
    }
}

func (s *WorkflowService) handleApproval(ctx context.Context, workflow *models.Workflow, user *models.User) (*models.Workflow, error) {
    stages := models.GetWorkflowStages()
    totalStages := len(stages)
    
    if workflow.CurrentStage >= totalStages {
        // Final approval - complete the workflow
        workflow.Status = models.WorkflowStatusApproved
        now := time.Now()
        workflow.CompletedAt = &now
        
        // Handle post-approval actions based on workflow type
        if err := s.handleWorkflowCompletion(ctx, workflow); err != nil {
            return nil, err
        }
    } else {
        // Move to next stage
        workflow.CurrentStage++
        
        // Notify next stage approvers
        s.notifyStageApprovers(ctx, workflow)
    }
    
    if err := s.workflowRepo.Update(ctx, workflow); err != nil {
        return nil, err
    }
    
    // Audit log
    s.auditService.Log(ctx, "workflow", workflow.ID, "approve", nil, 
        map[string]interface{}{"stage": workflow.CurrentStage, "status": workflow.Status})
    
    return workflow, nil
}

func (s *WorkflowService) handleRejection(ctx context.Context, workflow *models.Workflow, user *models.User, reason string) (*models.Workflow, error) {
    workflow.Status = models.WorkflowStatusRejected
    now := time.Now()
    workflow.CompletedAt = &now
    
    if err := s.workflowRepo.Update(ctx, workflow); err != nil {
        return nil, err
    }
    
    // Handle rejection based on workflow type
    if workflow.Type == models.WorkflowTypeOnboarding {
        s.handleOnboardingRejection(ctx, workflow.ReferenceID, reason)
    }
    
    // Audit log
    s.auditService.Log(ctx, "workflow", workflow.ID, "reject", nil,
        map[string]interface{}{"reason": reason})
    
    return workflow, nil
}

func (s *WorkflowService) handleChangesRequest(ctx context.Context, workflow *models.Workflow, user *models.User, feedback string) (*models.Workflow, error) {
    workflow.Status = models.WorkflowStatusChangesRequested
    
    if err := s.workflowRepo.Update(ctx, workflow); err != nil {
        return nil, err
    }
    
    // Notify initiator about required changes
    s.emailService.SendChangesRequestedEmail(ctx, workflow, feedback)
    
    // Audit log
    s.auditService.Log(ctx, "workflow", workflow.ID, "request_changes", nil,
        map[string]interface{}{"feedback": feedback})
    
    return workflow, nil
}

func (s *WorkflowService) handleWorkflowCompletion(ctx context.Context, workflow *models.Workflow) error {
    switch workflow.Type {
    case models.WorkflowTypeOnboarding:
        return s.completeOnboardingWorkflow(ctx, workflow.ReferenceID)
    case models.WorkflowTypeCompanyUpdate:
        // Handle company update completion
        return nil
    default:
        return nil
    }
}

func (s *WorkflowService) completeOnboardingWorkflow(ctx context.Context, onboardingID uuid.UUID) error {
    // Get onboarding request
    request, err := s.onboardingRepo.FindByID(ctx, onboardingID)
    if err != nil {
        return err
    }
    
    // Update onboarding status
    request.Status = models.OnboardingStatusApproved
    if err := s.onboardingRepo.Update(ctx, request); err != nil {
        return err
    }
    
    // Create company from onboarding data
    companyData, err := request.GetCompanyData()
    if err != nil {
        return err
    }
    
    createReq := dto.CreateCompanyRequest{
        Name:               request.CompanyName,
        RegistrationNumber: companyData.RegistrationNumber,
        TaxID:              companyData.TaxID,
        Email:              companyData.PrimaryContact.Email,
        Phone:              companyData.PrimaryContact.Phone,
        Website:            companyData.Website,
        Address:            &companyData.Address,
    }
    
    company, err := s.companyService.Create(ctx, createReq, *request.ProcessedBy)
    if err != nil {
        return err
    }
    
    // Update company with onboarding reference
    company.OnboardingRequestID = &request.ID
    company.Status = models.CompanyStatusActive
    
    // Generate credentials and send email
    _, err = s.companyService.GenerateCredentials(ctx, company.ID)
    
    return err
}

func (s *WorkflowService) handleOnboardingRejection(ctx context.Context, onboardingID uuid.UUID, reason string) error {
    request, err := s.onboardingRepo.FindByID(ctx, onboardingID)
    if err != nil {
        return err
    }
    
    request.Status = models.OnboardingStatusRejected
    request.Notes = reason
    
    if err := s.onboardingRepo.Update(ctx, request); err != nil {
        return err
    }
    
    // Send rejection email
    s.emailService.SendOnboardingRejectedEmail(ctx, request, reason)
    
    return nil
}

func (s *WorkflowService) notifyStageApprovers(ctx context.Context, workflow *models.Workflow) {
    stageInfo := workflow.GetCurrentStageInfo()
    if stageInfo == nil {
        return
    }
    
    // Get users with the required role
    // Send notification emails
    s.emailService.SendWorkflowNotificationEmail(ctx, workflow, stageInfo)
}

func (s *WorkflowService) GetStages() []models.WorkflowStage {
    return models.GetWorkflowStages()
}
```

---

## Email Service

```go
// internal/services/email_service.go
package services

import (
    "bytes"
    "context"
    "crypto/tls"
    "html/template"
    "strings"
    "gopkg.in/gomail.v2"
    "backoffice-api/internal/models"
    "backoffice-api/internal/repository"
)

type EmailService struct {
    smtpRepo     *repository.SmtpRepository
    templateRepo *repository.EmailTemplateRepository
    config       *models.SmtpConfig
}

func NewEmailService(smtpRepo *repository.SmtpRepository, templateRepo *repository.EmailTemplateRepository) *EmailService {
    return &EmailService{
        smtpRepo:     smtpRepo,
        templateRepo: templateRepo,
    }
}

func (s *EmailService) LoadConfig(ctx context.Context) error {
    config, err := s.smtpRepo.GetActive(ctx)
    if err != nil {
        return err
    }
    s.config = config
    return nil
}

func (s *EmailService) SendEmail(ctx context.Context, to string, subject string, htmlBody string, textBody string) error {
    if s.config == nil {
        if err := s.LoadConfig(ctx); err != nil {
            return err
        }
    }
    
    m := gomail.NewMessage()
    m.SetHeader("From", m.FormatAddress(s.config.FromEmail, s.config.FromName))
    m.SetHeader("To", to)
    m.SetHeader("Subject", subject)
    m.SetBody("text/plain", textBody)
    m.AddAlternative("text/html", htmlBody)
    
    d := gomail.NewDialer(s.config.Host, s.config.Port, s.config.Username, s.decryptPassword())
    
    if s.config.Encryption == models.EncryptionTLS {
        d.TLSConfig = &tls.Config{InsecureSkipVerify: false}
    }
    
    return d.DialAndSend(m)
}

func (s *EmailService) SendTemplatedEmail(ctx context.Context, to string, templateType models.EmailTemplateType, data map[string]interface{}) error {
    tmpl, err := s.templateRepo.FindByType(ctx, templateType)
    if err != nil {
        return err
    }
    
    if !tmpl.IsActive {
        return errors.New("email template is inactive")
    }
    
    // Render subject
    subject := s.renderTemplate(tmpl.Subject, data)
    
    // Render HTML body
    htmlBody := s.renderTemplate(tmpl.BodyHTML, data)
    
    // Render text body
    textBody := s.renderTemplate(tmpl.BodyText, data)
    
    return s.SendEmail(ctx, to, subject, htmlBody, textBody)
}

func (s *EmailService) renderTemplate(templateStr string, data map[string]interface{}) string {
    result := templateStr
    for key, value := range data {
        placeholder := "{{" + key + "}}"
        result = strings.ReplaceAll(result, placeholder, fmt.Sprintf("%v", value))
    }
    return result
}

func (s *EmailService) SendOnboardingReceivedEmail(ctx context.Context, request *models.OnboardingRequest) error {
    companyData, _ := request.GetCompanyData()
    
    data := map[string]interface{}{
        "company_name":   request.CompanyName,
        "contact_name":   companyData.PrimaryContact.FirstName + " " + companyData.PrimaryContact.LastName,
        "contact_email":  companyData.PrimaryContact.Email,
        "submitted_date": request.SubmittedAt.Format("January 2, 2006"),
        "request_link":   fmt.Sprintf("%s/onboarding/%s", os.Getenv("FRONTEND_URL"), request.ID),
    }
    
    // Get all users who should be notified (company secretaries)
    users, _ := s.userRepo.FindByRole(ctx, models.RoleCompanySecretary)
    
    for _, user := range users {
        s.SendTemplatedEmail(ctx, user.Email, models.TemplateOnboardingReceived, data)
    }
    
    return nil
}

func (s *EmailService) SendCompanyApprovedEmail(ctx context.Context, company *models.Company, tempPassword string) error {
    data := map[string]interface{}{
        "company_name":       company.Name,
        "contact_name":       "Admin",
        "login_url":          os.Getenv("FRONTEND_URL") + "/login",
        "username":           company.Email,
        "temporary_password": tempPassword,
        "subscription_tier":  company.SubscriptionTier.Name,
    }
    
    return s.SendTemplatedEmail(ctx, company.Email, models.TemplateCompanyApproved, data)
}

func (s *EmailService) SendWorkflowNotificationEmail(ctx context.Context, workflow *models.Workflow, stage *models.WorkflowStage) error {
    // Get reference entity details
    var companyName string
    if workflow.Type == models.WorkflowTypeOnboarding {
        request, _ := s.onboardingRepo.FindByID(ctx, workflow.ReferenceID)
        if request != nil {
            companyName = request.CompanyName
        }
    }
    
    data := map[string]interface{}{
        "workflow_type":   string(workflow.Type),
        "company_name":    companyName,
        "current_stage":   stage.Name,
        "action_required": "Review and approve/reject",
        "workflow_link":   fmt.Sprintf("%s/workflows/%s", os.Getenv("FRONTEND_URL"), workflow.ID),
    }
    
    // Get users with the required role
    users, _ := s.userRepo.FindByRole(ctx, stage.Role)
    
    for _, user := range users {
        data["approver_name"] = user.FullName()
        s.SendTemplatedEmail(ctx, user.Email, models.TemplateWorkflowNotification, data)
    }
    
    return nil
}

func (s *EmailService) TestConnection(ctx context.Context, config *models.SmtpConfig) error {
    d := gomail.NewDialer(config.Host, config.Port, config.Username, config.Password)
    
    if config.Encryption == models.EncryptionTLS {
        d.TLSConfig = &tls.Config{InsecureSkipVerify: false}
    }
    
    closer, err := d.Dial()
    if err != nil {
        return err
    }
    defer closer.Close()
    
    return nil
}

func (s *EmailService) SendTestEmail(ctx context.Context, to string) error {
    subject := "Test Email from Backoffice System"
    htmlBody := `
        <h1>Test Email</h1>
        <p>This is a test email from the Backoffice system.</p>
        <p>If you received this email, your SMTP configuration is working correctly.</p>
    `
    textBody := "Test Email\n\nThis is a test email from the Backoffice system.\nIf you received this email, your SMTP configuration is working correctly."
    
    return s.SendEmail(ctx, to, subject, htmlBody, textBody)
}

func (s *EmailService) decryptPassword() string {
    // Implement password decryption
    // This should use a secure encryption method
    return s.config.PasswordEncrypted // Placeholder
}
```

---

## Authentication & Authorization

### JWT Utilities

```go
// internal/utils/jwt.go
package utils

import (
    "errors"
    "time"
    "github.com/golang-jwt/jwt/v5"
    "github.com/google/uuid"
    "backoffice-api/internal/models"
)

var (
    ErrInvalidToken = errors.New("invalid token")
    ErrExpiredToken = errors.New("token has expired")
)

type JWTClaims struct {
    UserID      uuid.UUID        `json:"sub"`
    Email       string           `json:"email"`
    Role        models.UserRole  `json:"role"`
    Permissions []string         `json:"permissions"`
    jwt.RegisteredClaims
}

type JWTService struct {
    secretKey     []byte
    accessExpiry  time.Duration
    refreshExpiry time.Duration
}

func NewJWTService(secret string, accessExpiry, refreshExpiry time.Duration) *JWTService {
    return &JWTService{
        secretKey:     []byte(secret),
        accessExpiry:  accessExpiry,
        refreshExpiry: refreshExpiry,
    }
}

func (s *JWTService) GenerateAccessToken(user *models.User) (string, error) {
    claims := &JWTClaims{
        UserID:      user.ID,
        Email:       user.Email,
        Role:        user.Role,
        Permissions: models.GetRolePermissions(user.Role),
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessExpiry)),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
            Issuer:    "backoffice-api",
        },
    }
    
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(s.secretKey)
}

func (s *JWTService) GenerateRefreshToken() (string, time.Time, error) {
    token := uuid.New().String()
    expiry := time.Now().Add(s.refreshExpiry)
    return token, expiry, nil
}

func (s *JWTService) ValidateAccessToken(tokenString string) (*JWTClaims, error) {
    token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, ErrInvalidToken
        }
        return s.secretKey, nil
    })
    
    if err != nil {
        if errors.Is(err, jwt.ErrTokenExpired) {
            return nil, ErrExpiredToken
        }
        return nil, ErrInvalidToken
    }
    
    claims, ok := token.Claims.(*JWTClaims)
    if !ok || !token.Valid {
        return nil, ErrInvalidToken
    }
    
    return claims, nil
}
```

### Auth Middleware

```go
// internal/middleware/auth.go
package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "backoffice-api/internal/utils"
)

type AuthMiddleware struct {
    jwtService *utils.JWTService
}

func NewAuthMiddleware(jwtService *utils.JWTService) *AuthMiddleware {
    return &AuthMiddleware{jwtService: jwtService}
}

func (m *AuthMiddleware) Authenticate() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
            return
        }
        
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
            return
        }
        
        claims, err := m.jwtService.ValidateAccessToken(parts[1])
        if err != nil {
            if err == utils.ErrExpiredToken {
                c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token expired"})
                return
            }
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }
        
        // Store claims in context
        c.Set("userID", claims.UserID)
        c.Set("userEmail", claims.Email)
        c.Set("userRole", claims.Role)
        c.Set("userPermissions", claims.Permissions)
        
        c.Next()
    }
}
```

### RBAC Middleware

```go
// internal/middleware/rbac.go
package middleware

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "backoffice-api/internal/models"
)

func RequirePermission(permission string) gin.HandlerFunc {
    return func(c *gin.Context) {
        role, exists := c.Get("userRole")
        if !exists {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        
        userRole := role.(models.UserRole)
        
        // Super admin has all permissions
        if userRole == models.RoleSuperAdmin {
            c.Next()
            return
        }
        
        permissions, exists := c.Get("userPermissions")
        if !exists {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
            return
        }
        
        userPermissions := permissions.([]string)
        
        for _, p := range userPermissions {
            if p == permission || p == "*" {
                c.Next()
                return
            }
        }
        
        c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
    }
}

func RequireRole(roles ...models.UserRole) gin.HandlerFunc {
    return func(c *gin.Context) {
        role, exists := c.Get("userRole")
        if !exists {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        
        userRole := role.(models.UserRole)
        
        for _, r := range roles {
            if userRole == r {
                c.Next()
                return
            }
        }
        
        c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Insufficient role"})
    }
}
```

---

## Configuration

```go
// internal/config/config.go
package config

import (
    "time"
    "github.com/spf13/viper"
)

type Config struct {
    Server   ServerConfig
    Database DatabaseConfig
    Redis    RedisConfig
    JWT      JWTConfig
    CORS     CORSConfig
}

type ServerConfig struct {
    Port         string
    Environment  string
    FrontendURL  string
}

type DatabaseConfig struct {
    Host     string
    Port     int
    User     string
    Password string
    Name     string
    SSLMode  string
}

type RedisConfig struct {
    Host     string
    Port     int
    Password string
    DB       int
}

type JWTConfig struct {
    Secret        string
    AccessExpiry  time.Duration
    RefreshExpiry time.Duration
}

type CORSConfig struct {
    AllowedOrigins []string
    AllowedMethods []string
    AllowedHeaders []string
}

func Load() (*Config, error) {
    viper.SetConfigName("config")
    viper.SetConfigType("yaml")
    viper.AddConfigPath(".")
    viper.AddConfigPath("./config")
    
    viper.AutomaticEnv()
    
    // Set defaults
    viper.SetDefault("server.port", "8080")
    viper.SetDefault("server.environment", "development")
    viper.SetDefault("jwt.accessExpiry", "15m")
    viper.SetDefault("jwt.refreshExpiry", "7d")
    
    if err := viper.ReadInConfig(); err != nil {
        if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
            return nil, err
        }
    }
    
    var config Config
    if err := viper.Unmarshal(&config); err != nil {
        return nil, err
    }
    
    return &config, nil
}

func (c *DatabaseConfig) DSN() string {
    return fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
        c.Host, c.Port, c.User, c.Password, c.Name, c.SSLMode,
    )
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [ ] Project setup with Go modules
- [ ] Database setup with migrations
- [ ] Basic CRUD for users
- [ ] JWT authentication system
- [ ] Role-based access control middleware
- [ ] Logging and error handling

### Phase 2: Core Modules (Week 3-4)

- [ ] Subscription tiers CRUD
- [ ] Companies CRUD
- [ ] Dashboard statistics endpoints
- [ ] Audit logging

### Phase 3: Workflow Engine (Week 5-6)

- [ ] Workflow model and repository
- [ ] Multi-stage approval engine
- [ ] Onboarding request handling
- [ ] Workflow state machine

### Phase 4: Email Integration (Week 7-8)

- [ ] SMTP configuration management
- [ ] Email template system
- [ ] Template rendering with variables
- [ ] Notification triggers

### Phase 5: Testing & Deployment (Week 9-10)

- [ ] Unit tests for services
- [ ] Integration tests for handlers
- [ ] Load testing
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API documentation (Swagger)
- [ ] Production deployment

---

## Best Practices

### Error Handling

```go
// Use custom error types for domain errors
type DomainError struct {
    Code    string
    Message string
    Err     error
}

func (e *DomainError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %v", e.Message, e.Err)
    }
    return e.Message
}

// Wrap errors with context
func (s *CompanyService) GetByID(ctx context.Context, id uuid.UUID) (*models.Company, error) {
    company, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return nil, &DomainError{
            Code:    "COMPANY_NOT_FOUND",
            Message: "Company not found",
            Err:     err,
        }
    }
    return company, nil
}
```

### Repository Pattern

```go
// Define interfaces for testing
type CompanyRepository interface {
    FindAll(ctx context.Context, filters dto.CompanyFilters) ([]models.Company, int64, error)
    FindByID(ctx context.Context, id uuid.UUID) (*models.Company, error)
    Create(ctx context.Context, company *models.Company) error
    Update(ctx context.Context, company *models.Company) error
    Delete(ctx context.Context, id uuid.UUID) error
}

// Implementation with GORM
type companyRepository struct {
    db *gorm.DB
}

func NewCompanyRepository(db *gorm.DB) CompanyRepository {
    return &companyRepository{db: db}
}
```

### Transaction Management

```go
func (s *WorkflowService) CompleteWorkflow(ctx context.Context, workflowID uuid.UUID) error {
    return s.db.Transaction(func(tx *gorm.DB) error {
        // All operations within transaction
        workflow, err := s.workflowRepo.WithTx(tx).FindByID(ctx, workflowID)
        if err != nil {
            return err
        }
        
        workflow.Status = models.WorkflowStatusApproved
        if err := s.workflowRepo.WithTx(tx).Update(ctx, workflow); err != nil {
            return err
        }
        
        // Create company...
        if err := s.companyRepo.WithTx(tx).Create(ctx, company); err != nil {
            return err
        }
        
        return nil
    })
}
```

### Graceful Shutdown

```go
func main() {
    // ... setup code ...
    
    srv := &http.Server{
        Addr:    ":" + config.Server.Port,
        Handler: router,
    }
    
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()
    
    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    log.Println("Shutting down server...")
    
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
    
    log.Println("Server exiting")
}
```

---

## Deployment

### Dockerfile

```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

# Run stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/internal/database/migrations ./migrations

EXPOSE 8080

CMD ["./main"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_HOST=postgres
      - DATABASE_PORT=5432
      - DATABASE_USER=backoffice
      - DATABASE_PASSWORD=secret
      - DATABASE_NAME=backoffice
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=your-secret-key
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=backoffice
      - POSTGRES_PASSWORD=secret
      - POSTGRES_DB=backoffice
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

This backend guide provides a comprehensive foundation for building the Golang API. The architecture follows clean code principles with clear separation between handlers, services, and repositories, making it testable and maintainable.
