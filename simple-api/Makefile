# Makefile для simple-api
# Використання: make <команда>

# Змінні (можна змінювати)
COMPOSE = docker compose
CONTAINER_API = simple-api
CONTAINER_DB = pg
DB_USER = appuser
DB_NAME = appdb

# ============================================
# ОСНОВНІ КОМАНДИ
# ============================================

# Запустити все (build + up)
up:
	$(COMPOSE) up -d

# Запустити з перебудовою
up-build:
	$(COMPOSE) up -d --build

# Зупинити все
down:
	$(COMPOSE) down

# Перезапустити
restart: down up

# ============================================
# ЛОГИ
# ============================================

# Логи всіх сервісів
logs:
	$(COMPOSE) logs -f

# Логи тільки API
logs-api:
	$(COMPOSE) logs -f api

# Логи тільки БД
logs-db:
	$(COMPOSE) logs -f db

# ============================================
# БАЗА ДАНИХ
# ============================================

# Підключитись до PostgreSQL
db:
	docker exec -it $(CONTAINER_DB) psql -U $(DB_USER) -d $(DB_NAME)

# Показати всіх користувачів
db-users:
	docker exec -it $(CONTAINER_DB) psql -U $(DB_USER) -d $(DB_NAME) -c "SELECT * FROM users;"

# Скинути базу даних (видалити volume)
db-reset: down
	docker volume rm simple-api_pgdata || true
	$(COMPOSE) up -d

# ============================================
# СТАТУС І ДІАГНОСТИКА
# ============================================

# Статус контейнерів
status:
	$(COMPOSE) ps

# Перевірити чи API працює
health:
	curl -s http://localhost:3000/users | head -c 100 || echo "API not responding"

# ============================================
# ОЧИСТКА
# ============================================

# Зупинити і видалити все (включно з volumes)
clean: down
	docker volume rm simple-api_pgdata || true
	docker rmi simple-api-api || true

# ============================================
# ДОПОМОГА
# ============================================

# Показати доступні команди
help:
	@echo "Доступні команди:"
	@echo ""
	@echo "  make up         - Запустити сервіси"
	@echo "  make up-build   - Запустити з перебудовою"
	@echo "  make down       - Зупинити сервіси"
	@echo "  make restart    - Перезапустити"
	@echo ""
	@echo "  make logs       - Логи всіх сервісів"
	@echo "  make logs-api   - Логи API"
	@echo "  make logs-db    - Логи БД"
	@echo ""
	@echo "  make db         - Підключитись до PostgreSQL"
	@echo "  make db-users   - Показати всіх користувачів"
	@echo "  make db-reset   - Скинути базу даних"
	@echo ""
	@echo "  make status     - Статус контейнерів"
	@echo "  make health     - Перевірити API"
	@echo "  make clean      - Видалити все"
	@echo ""
	@echo "  make help       - Ця довідка"

# За замовчуванням показати help
.DEFAULT_GOAL := help

# Ці команди не є файлами
.PHONY: up up-build down restart logs logs-api logs-db db db-users db-reset status health clean help
