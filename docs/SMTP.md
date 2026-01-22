# SMTP Configuration and Email Service

This document explains SMTP (Simple Mail Transfer Protocol) and how it is implemented in the Risk Audit application.

## What is SMTP?

SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending emails across the internet. It defines:

- **How email clients communicate with mail servers** to send outgoing messages
- **How mail servers relay messages** to reach the recipient's mail server
- **Authentication mechanisms** to verify the sender's identity
- **Encryption standards** (TLS/SSL) to secure email transmission

### Key SMTP Components

| Component | Description |
|-----------|-------------|
| **SMTP Server (Host)** | The mail server that accepts and relays emails (e.g., smtp.gmail.com) |
| **Port** | Network port for SMTP communication (25, 465, 587) |
| **Authentication** | Credentials (username/password) or tokens to verify sender identity |
| **TLS/SSL** | Encryption layer to secure the connection |

### Common SMTP Ports

| Port | Protocol | Description |
|------|----------|-------------|
| **25** | SMTP | Legacy port, often blocked by ISPs |
| **465** | SMTPS | SMTP over SSL (deprecated but still used) |
| **587** | Submission | Modern standard with STARTTLS encryption |

---

## SMTP in This Project

The Risk Audit application implements a **multi-tenant SMTP configuration system** that allows each organization to configure their own email settings for sending notifications.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Application                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │  API Routes │───▶│  SMTP Config     │───▶│  Database     │  │
│  │             │    │  Service         │    │  (smtp_configs)│  │
│  └─────────────┘    └──────────────────┘    └───────────────┘  │
│         │                    │                                   │
│         │                    ▼                                   │
│         │           ┌──────────────────┐                        │
│         │           │  Email Service   │                        │
│         │           │  (DynamicSMTP)   │                        │
│         │           └────────┬─────────┘                        │
│         │                    │                                   │
│         │                    ▼                                   │
│         │           ┌──────────────────┐                        │
│         └──────────▶│  Email Templates │                        │
│                     │  (HTML/Text)     │                        │
│                     └──────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  External SMTP   │
                    │  Server          │
                    │  (Gmail, etc.)   │
                    └──────────────────┘
```

### Configuration Types

The application supports two SMTP configuration approaches:

#### 1. Dynamic SMTP (Per-Organization)

Each organization can configure their own SMTP settings stored in the database. This allows:

- **Multi-tenant isolation** - Each organization uses their own email identity
- **Custom branding** - Emails come from the organization's domain
- **Independent management** - Organizations manage their own credentials

#### 2. Static SMTP (System Default)

A fallback configuration defined in environment variables, used when:

- Organization has no custom SMTP configured
- Testing or development environments
- System-wide notifications

---

## Database Schema

SMTP configurations are stored in the `smtp_configs` table:

```sql
CREATE TABLE smtp_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- SMTP Server Settings
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL DEFAULT 587,
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,  -- Encrypted

    -- Email Identity
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),

    -- Security Settings
    encryption VARCHAR(20) DEFAULT 'tls',  -- 'none', 'ssl', 'tls'
    auth_method VARCHAR(20) DEFAULT 'plain',  -- 'plain', 'login', 'cram-md5'

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_verified_at TIMESTAMP WITH TIME ZONE,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),

    UNIQUE(organization_id)
);
```

### Security Considerations

- **Password Encryption**: SMTP passwords are encrypted before storage
- **One Config Per Org**: Each organization can have only one active SMTP configuration
- **Verification Status**: Configurations can be tested before being marked as verified

---

## API Endpoints

The SMTP configuration is managed through REST API endpoints:

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/smtp-config` | Get organization's SMTP configuration |
| `POST` | `/api/v1/smtp-config` | Create SMTP configuration |
| `PUT` | `/api/v1/smtp-config` | Update SMTP configuration |
| `DELETE` | `/api/v1/smtp-config` | Delete SMTP configuration |
| `POST` | `/api/v1/smtp-config/test` | Test SMTP configuration |
| `POST` | `/api/v1/smtp-config/verify` | Verify and activate configuration |

### Example: Creating SMTP Configuration

```json
POST /api/v1/smtp-config
Authorization: Bearer <token>

{
    "host": "smtp.gmail.com",
    "port": 587,
    "username": "notifications@company.com",
    "password": "app-specific-password",
    "from_email": "notifications@company.com",
    "from_name": "Company Notifications",
    "encryption": "tls",
    "auth_method": "plain"
}
```

### Example: Testing Configuration

```json
POST /api/v1/smtp-config/test
Authorization: Bearer <token>

{
    "test_email": "admin@company.com"
}
```

---

## Email Service Implementation

The email service (`DynamicSMTPEmailService`) handles the actual sending of emails:

### Key Features

1. **Dynamic Configuration Loading**
   - Retrieves SMTP settings from database based on organization context
   - Falls back to static configuration if no dynamic config exists

2. **Connection Management**
   - Creates SMTP connections on-demand
   - Handles TLS/SSL negotiation based on configuration
   - Supports multiple authentication methods

3. **Template Rendering**
   - HTML and plain-text email templates
   - Dynamic variable substitution
   - Consistent branding across email types

### Supported Authentication Methods

| Method | Description |
|--------|-------------|
| `plain` | PLAIN authentication (username/password in base64) |
| `login` | LOGIN authentication (legacy, widely supported) |
| `cram-md5` | Challenge-response authentication |

### Code Structure

```
internal/
├── models/
│   └── smtp_config.go          # SMTP configuration model
├── services/
│   └── smtp_config_service.go  # SMTP config business logic
├── handlers/
│   └── smtp_config_handler.go  # HTTP request handlers
├── repository/
│   └── smtp_config_repository.go # Database operations
├── routes/
│   └── routes_smtp_config.go   # API route definitions
└── utils/
    └── email/
        ├── dynamic_smtp_email.go      # Email sending service
        └── finding_action_templates.go # Email templates
```

---

## Email Templates

The application includes pre-built email templates for various notification types:

### Finding Action Workflow Templates

Used for notifying users about findings and required actions:

| Template | Purpose |
|----------|---------|
| **Finding Assignment** | Notify when a finding is assigned to a user |
| **Action Required** | Remind about pending actions |
| **Action Overdue** | Alert when action deadline has passed |
| **Action Completed** | Confirm action completion |
| **Finding Resolved** | Notify when finding is resolved |

### Template Structure

Each template includes:

- **Subject line** with dynamic variables
- **HTML body** with styled content
- **Plain-text fallback** for email clients that don't support HTML

### Example Template Variables

```go
type FindingEmailData struct {
    RecipientName    string
    FindingTitle     string
    FindingID        string
    Severity         string
    DueDate          string
    Description      string
    ActionURL        string
    OrganizationName string
}
```

---

## Notification System Integration

SMTP is integrated with the broader notification system:

### Notification Types

The `notifications` table stores notification records:

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,

    type VARCHAR(50) NOT NULL,      -- 'email', 'in_app', 'sms'
    category VARCHAR(50) NOT NULL,  -- 'finding', 'audit', 'report'

    subject VARCHAR(255),
    message TEXT,

    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'sent', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notification Flow

1. **Event Triggers** - Business events (finding created, action due) trigger notifications
2. **Notification Created** - Record saved to `notifications` table with status `pending`
3. **Email Service Called** - DynamicSMTPEmailService sends the email
4. **Status Updated** - Notification marked as `sent` or `failed`

---

## Configuration Guide

### Setting Up Gmail SMTP

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → App passwords
   - Generate a new password for "Mail"
3. **Configure in Application**:

```json
{
    "host": "smtp.gmail.com",
    "port": 587,
    "username": "your-email@gmail.com",
    "password": "your-app-password",
    "encryption": "tls",
    "auth_method": "plain"
}
```

### Setting Up Microsoft 365 SMTP

```json
{
    "host": "smtp.office365.com",
    "port": 587,
    "username": "your-email@company.com",
    "password": "your-password",
    "encryption": "tls",
    "auth_method": "login"
}
```

### Environment Variables (Static Configuration)

For system-wide default SMTP settings:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=system@example.com
SMTP_PASSWORD=secure-password
SMTP_FROM_EMAIL=noreply@example.com
SMTP_FROM_NAME=Risk Audit System
SMTP_ENCRYPTION=tls
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection timeout | Firewall blocking port | Check firewall rules, try port 587 |
| Authentication failed | Wrong credentials | Verify username/password, check app passwords |
| TLS handshake error | SSL/TLS mismatch | Match encryption setting to server requirements |
| Emails marked as spam | Missing SPF/DKIM | Configure DNS records for email authentication |

### Testing SMTP Connection

Use the test endpoint to verify configuration before sending production emails:

```bash
curl -X POST https://api.example.com/api/v1/smtp-config/test \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"test_email": "test@example.com"}'
```

### Checking Email Logs

Monitor the application logs for email-related errors:

```bash
# Look for email service logs
grep "email" /var/log/risk-audit/app.log

# Check notification status
SELECT * FROM notifications
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Security Best Practices

1. **Use App-Specific Passwords** - Never use main account passwords
2. **Enable TLS** - Always use encryption for SMTP connections
3. **Rotate Credentials** - Periodically update SMTP passwords
4. **Monitor Failed Sends** - Alert on repeated email failures
5. **Validate Email Addresses** - Prevent email injection attacks
6. **Rate Limiting** - Prevent abuse of email sending capabilities
