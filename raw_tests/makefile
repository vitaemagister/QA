.PHONY: help build up down restart logs shell exec clean status open info backup restore

# ============================================
# Output colors / Кольори для виводу
# ============================================
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# ============================================
# Variables / Змінні
# ============================================
CONTAINER_NAME=ubuntu-gui-qa
COMPOSE_FILE=docker-compose.yml
BACKUP_DIR=./backups

# ============================================
# HELP / ДОПОМОГА
# ============================================
help: ## Show this help / Показати цю допомогу
	@echo "$(GREEN)Available commands / Доступні команди:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

# ============================================
# BUILDxx` & RUN / ЗБІРКА ТА ЗАПУСК
# ============================================
build: ## Build image from scratch / Побудувати образ з нуля
	@echo "$(GREEN)Building Docker image... / Будуємо Docker образ...$(NC)"
	docker compose build --no-cache

up: ## Start container / Запустити контейнер
	@echo "$(GREEN)Starting container... / Запускаємо контейнер...$(NC)"
	docker compose up -d
	@echo "$(GREEN)✓ Container started! / Контейнер запущено!$(NC)"
	@echo "$(YELLOW)Open browser: http://localhost:6080 / Відкрийте браузер: http://localhost:6080$(NC)"

down: ## Stop and remove container / Зупинити і видалити контейнер
	@echo "$(RED)Stopping container... / Зупиняємо контейнер...$(NC)"
	docker compose down

restart: ## Restart container / Перезапустити контейнер
	@echo "$(YELLOW)Restarting... / Перезапускаємо...$(NC)"
	@make down
	@make up

rebuild: ## Rebuild and restart from scratch / Перебудувати і запустити заново
	@echo "$(YELLOW)Rebuilding everything... / Перебудовуємо все з нуля...$(NC)"
	@make down
	@make build
	@make up

# ============================================
# LOGS / ЛОГИ
# ============================================
logs: ## Show container logs / Показати логи контейнера
	docker logs $(CONTAINER_NAME)

logs-f: ## Show logs in real-time (Ctrl+C to exit) / Показати логи в реальному часі
	docker logs -f $(CONTAINER_NAME)

# ============================================
# SHELL ACCESS / ДОСТУП ДО ТЕРМІНАЛУ
# ============================================
shell: ## Enter container terminal as qauser / Зайти в термінал як qauser
	@echo "$(GREEN)Entering container as qauser... / Заходимо в контейнер як qauser...$(NC)"
	docker exec -it -u qauser $(CONTAINER_NAME) bash

root-shell: ## Enter container terminal as root / Зайти в термінал як root
	@echo "$(RED)Entering container as root... / Заходимо в контейнер як root...$(NC)"
	docker exec -it $(CONTAINER_NAME) bash

exec: ## Execute command in container (usage: make exec CMD="ls -la") / Виконати команду в контейнері
	docker exec -it $(CONTAINER_NAME) bash -c "$(CMD)"

# ============================================
# STATUS & INFO / СТАТУС ТА ІНФОРМАЦІЯ
# ============================================
status: ## Show container status / Показати статус контейнера
	@echo "$(GREEN)Container status / Статус контейнера:$(NC)"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "Container not found / Контейнер не знайдено"

# ============================================
# CLEANUP / ОЧИСТКА
# ============================================
clean: ## Remove container and images (volumes remain) / Видалити контейнер і образи (volumes залишаться)
	@echo "$(RED)Removing container and images... / Видаляємо контейнер і образи...$(NC)"
	docker compose down --rmi all

clean-all: ## Remove EVERYTHING including volumes (CAUTION!) / Видалити ВСЕ включно з volumes (ОБЕРЕЖНО!)
	@echo "$(RED)⚠️  WARNING! Removing EVERYTHING including data! / УВАГА! Видаляємо ВСЕ включно з даними!$(NC)"
	@read -p "Are you sure? / Впевнені? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v --rmi all; \
		echo "$(RED)✓ Everything removed! / Все видалено!$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled / Скасовано$(NC)"; \
	fi

# ============================================
# BROWSER / БРАУЗЕР
# ============================================
open: ## Open in browser / Відкрити в браузері
	@echo "$(GREEN)Opening http://localhost:6080 / Відкриваємо http://localhost:6080$(NC)"
	@if command -v xdg-open > /dev/null; then \
		xdg-open http://localhost:6080; \
	elif command -v open > /dev/null; then \
		open http://localhost:6080; \
	else \
		echo "$(YELLOW)Open manually: http://localhost:6080 / Відкрийте вручну: http://localhost:6080$(NC)"; \
	fi

# ============================================
# SYSTEM INFO / СИСТЕМНА ІНФОРМАЦІЯ
# ============================================
info: ## Show detailed system info / Показати детальну інформацію про систему
	@echo "$(GREEN)=== Docker Info / Інформація про Docker ===$(NC)"
	@docker --version
	@docker compose version
	@echo "\n$(GREEN)=== Image size / Розмір образів ===$(NC)"
	@docker images | grep ubuntu-gui || echo "Image not found / Образ не знайдено"
	@echo "\n$(GREEN)=== Disk usage / Використання диску ===$(NC)"
	@docker system df
	@echo "\n$(GREEN)=== Volumes ===$(NC)"
	@docker volume ls | grep raw_tests || echo "Volumes not found / Volumes не знайдено"

# ============================================
# BACKUP & RESTORE / РЕЗЕРВНІ КОПІЇ
# ============================================
backup: ## Create workspace backup / Створити backup workspace
	@echo "$(GREEN)Creating backup... / Створюємо backup...$(NC)"
	@mkdir -p $(BACKUP_DIR)
	@tar -czf $(BACKUP_DIR)/workspace-backup-$$(date +%Y%m%d-%H%M%S).tar.gz workspace/
	@echo "$(GREEN)✓ Backup created in $(BACKUP_DIR) / Backup створено в $(BACKUP_DIR)$(NC)"

restore: ## Restore last backup (usage: make restore BACKUP=filename.tar.gz) / Відновити останній backup
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(RED)Error: specify backup file / Помилка: вкажіть файл backup$(NC)"; \
		echo "Example / Приклад: make restore BACKUP=workspace-backup-20241121-120000.tar.gz"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring backup: $(BACKUP) / Відновлюємо backup: $(BACKUP)$(NC)"
	@tar -xzf $(BACKUP_DIR)/$(BACKUP) -C ./
	@echo "$(GREEN)✓ Backup restored! / Backup відновлено!$(NC)"

list-backups: ## List all backups / Показати всі backups
	@echo "$(GREEN)Available backups / Доступні backups:$(NC)"
	@ls -lh $(BACKUP_DIR)/ 2>/dev/null || echo "No backups found / Backups не знайдено"

# ============================================
# PACKAGE MANAGEMENT / УПРАВЛІННЯ ПАКЕТАМИ
# ============================================
update-deps: ## Update all packages in container / Оновити всі пакети в контейнері
	@echo "$(GREEN)Updating packages... / Оновлюємо пакети...$(NC)"
	@docker exec -it $(CONTAINER_NAME) bash -c "apt-get update && apt-get upgrade -y"

install: ## Install package (usage: make install PKG=chromium) / Встановити програму
	@if [ -z "$(PKG)" ]; then \
		echo "$(RED)Error: specify package / Помилка: вкажіть пакет$(NC)"; \
		echo "Example / Приклад: make install PKG=chromium"; \
		exit 1; \
	fi
	@echo "$(GREEN)Installing $(PKG)... / Встановлюємо $(PKG)...$(NC)"
	@docker exec -it $(CONTAINER_NAME) bash -c "apt-get update && apt-get install -y $(PKG)"

# ============================================
# MONITORING / МОНІТОРИНГ
# ============================================
stats: ## Show container resource usage / Показати використання ресурсів контейнера
	@docker stats $(CONTAINER_NAME) --no-stream

ports: ## Show open ports / Показати відкриті порти
	@echo "$(GREEN)Open ports / Відкриті порти:$(NC)"
	@docker port $(CONTAINER_NAME)