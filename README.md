# QA Tools & Utilities

A collection of usefull things for **Manual QA Engineers**.  
Everything you need to quickly set up a testing environment, run API tools, or automate your workflow.

## Project Structure

QA

1. AI/ — ai prompts in progress
2. files/ — Useful test files such as images, videos, docs etc.
3. scripts/ — Bash utilities for useful QA applications setup (in progress)
4. email-server/ — Mailhog for local emails (to review)
5. simple-api/ — DB + server API for it + JSON API collection
6. site/ — Simple frontend for test scenarios (to delete / to rework)
7. misc/ — AI prompts, useful links
8. Kiwi_testcase_managment/ - test management system all info / credits - https://kiwitcms.org/

###### README.md

## Quick Start

### 1. Clone the repository

```
git clone https://github.com/vitaemagister/QA.git
cd QA
```

### 2. For Kiwi install script

To install Kiwi test managment system open terminal in kiwi folder and execute commands. 
Additional info https://kiwitcms.org/ 
https://kiwitcms.readthedocs.io/en/latest/installing_docker.html

```
cd QA/Kiwi_testcase_managment
chmod +x kiwi.install.sh
./kiwi.install.sh
```
### 3. For simple-api install

simple-api and postman collection for it with PostgreSQL
All components run using Docker Compose.

```
To run, navigate to QA/simple-api and execute:
docker compose up -d

For DB access
docker exec -it pg psql -U appuser -d appdb 

Import the Postman collection from QA/simple-api/postman_collection.json into Postman


```
## Glory to Ukraine
![Project Preview](/files/ua_flag.webp)
