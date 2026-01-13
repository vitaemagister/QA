# QA Tools & Utilities

A collection of useful things for **Manual QA Engineers**.  
Everything you need to quickly set up a testing environment, run API tools, or automate your workflow.

---

## 📂 Project Structure

```
QA/
├── simple-api/          # REST API + Web UI + PostgreSQL
├── email_server/        # MailHog for local email testing
├── files/              # Test files (images, videos, docs, etc.)
├── site/               # Practice website with bugs
├── scripts/            # Automated tool installation
├── Kiwi_testcase_management/  # Test case management system
├── AI/                 # AI prompts for testing
├── misc/               # Useful QA resources and links
└── raw_tests/          # Additional test utilities
```

---

## 📋 Components Overview

### 🤖 **simple-api/** - REST API with Web Interface
Full-stack user management system for practicing CRUD operations.
- **Tech:** Express.js + PostgreSQL + Docker
- **Includes:** REST API, Web UI, Postman collection
- **Use for:** API testing, SQL practice, authentication flows
- **Access:** http://localhost:3000 (after `docker compose up -d`)

### 📧 **email_server/** - Local Email Testing (MailHog)
Catch and inspect emails without sending to real addresses.
- **Tech:** MailHog + Docker
- **Includes:** SMTP server (port 1025), Web UI (port 8025)
- **Use for:** Email registration flows, template testing, spam checking
- **Access:** http://localhost:8025 (after `docker compose up -d`)

### 🗂️ **files/** - Test File Repository
Ready-to-use test files for various testing scenarios.
- **Categories:** images, videos, audio (silent/with sound), docs, PDFs, text, archives
- **Special files:** Empty files, 0-10000 symbol files
- **Use for:** File upload testing, format validation, boundary testing

### 🧪 **site/** - Practice Testing Website
Simple frontend with intentional bugs for testing practice.
- **Features:** Buggy forms, multi-language support (UA/EN)
- **Use for:** Finding UI bugs, manual testing practice, bug reporting
- **Access:** Open `site/index.html` in browser

### 🧰 **scripts/** - Automated Tool Installation
Quick setup of QA tools on Linux systems.
- **Tools:** Postman, Insomnia, Bruno, Chrome, Firefox, Brave
- **Usage:** `cd scripts && ./install-tools.sh`
- **Platform:** Ubuntu/Debian Linux

### 📝 **Kiwi_testcase_management/** - Test Case Management
Self-hosted test management system (Kiwi TCMS).
- **Features:** Test case management, test plans, execution tracking
- **Installation:** Run `./kiwi_install.sh`
- **Docs:** https://kiwitcms.org/

### 🤖 **AI/** - AI Prompts for QA
Ready-to-use prompts for AI-assisted testing.
- **Languages:** Ukrainian and English
- **Use for:** Generate test cases, get test data, learn QA practices

### 🔗 **misc/** - Useful Resources
Curated list of 15+ essential QA tools and websites.
- **Includes:** Test data generators, temp emails, performance tools, regex testers
- **File:** `useful_resources_links.txt`

---

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/vitaemagister/QA.git
cd QA
```

---

### 2. Simple API (Recommended for beginners)

**What:** REST API + Web UI for user management

```bash
cd simple-api
docker compose up -d
```

Then open: **http://localhost:3000**

**What you can do:**
- View/Create/Update/Delete users via Web UI
- Test API endpoints with Postman collection
- Practice SQL queries: `docker exec -it pg psql -U appuser -d appdb`

📖 [Full API documentation](simple-api/API.md)

---

### 3. Email Server (MailHog)

**What:** Local email testing server

```bash
cd email_server
docker compose up -d
```

Then open: **http://localhost:8025**

**SMTP config for your apps:**
- Host: `localhost`
- Port: `1025`
- No authentication needed

---

### 4. Kiwi Test Management

**What:** Test case management system

```bash
cd Kiwi_testcase_managment
chmod +x kiwi_install.sh
./kiwi_install.sh
```

📖 [Kiwi TCMS Documentation](https://kiwitcms.org/)  
📖 [Installation Guide](https://kiwitcms.readthedocs.io/en/latest/installing_docker.html)

---

### 5. Install QA Tools (Linux)

**What:** Automated installation of browsers and API testing tools

```bash
cd scripts
chmod +x install-tools.sh
./install-tools.sh
```

**Available tools:** Postman, Insomnia, Bruno, Chrome, Firefox, Brave

---

## 🎯 Quick Start by Use Case

| I want to... | Command | Access |
|-------------|---------|--------|
| Practice API testing | `cd simple-api && docker compose up -d` | http://localhost:3000 |
| Test emails | `cd email_server && docker compose up -d` | http://localhost:8025 |
| Find UI bugs | Open `site/index.html` in browser | - |
| Use test files | Navigate to `files/` folder | - |
| Install QA tools | `cd scripts && ./install-tools.sh` | - |
| Manage test cases | `cd Kiwi_testcase_management && ./kiwi_install.sh` | Follow script output |

---

## 📚 Additional Resources

- **Test files:** Check `files/` for images, videos, docs, PDFs
- **Useful links:** See `misc/useful_resources_links.txt` for 15+ QA tools
- **AI prompts:** Check `AI/` folder for testing prompts

---

## 🛑 Stop Services

```bash
# Stop Simple API
cd simple-api && docker compose down

# Stop Email Server
cd email_server && docker compose down
```

---
## Glory to Ukraine
![Project Preview](/files/ua_flag.webp)
