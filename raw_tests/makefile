.PHONY: help build up down restart logs shell exec clean status open info backup restore

# Кольори для виводу
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Змінні
CONTAINER_NAME=ubuntu-gui-qa
COMPOSE_FILE=docker-compose.yml
BACKUP_DIR=./backups

help: ## Показати цю допомогу
	@echo "$(GREEN)Доступні команди:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

build: ## Побудувати образ з нуля
	@echo "$(GREEN)Будуємо Docker образ...$(NC)"
	docker compose build --no-cache

up: ## Запустити контейнер
	@echo "$(GREEN)Запускаємо контейнер...$(NC)"
	docker compose up -d
	@echo "$(GREEN)✓ Контейнер запущено!$(NC)"
	@echo "$(YELLOW)Відкрийте браузер: http://localhost:6080$(NC)"

down: ## Зупинити і видалити контейнер
	@echo "$(RED)Зупиняємо контейнер...$(NC)"
	docker compose down

restart: ## Перезапустити контейнер
	@echo "$(YELLOW)Перезапускаємо...$(NC)"
	@make down
	@make up

rebuild: ## Перебудувати і запустити заново
	@echo "$(YELLOW)Перебудовуємо все з нуля...$(NC)"
	@make down
	@make build
	@make up

logs: ## Показати логи контейнера
	docker logs $(CONTAINER_NAME)

logs-f: ## Показати логи в реальному часі (Ctrl+C для виходу)
	docker logs -f $(CONTAINER_NAME)

shell: ## Зайти в термінал контейнера як qauser
	@echo "$(GREEN)Заходимо в контейнер як qauser...$(NC)"
	docker exec -it -u qauser $(CONTAINER_NAME) bash

root-shell: ## Зайти в термінал контейнера як root
	@echo "$(RED)Заходимо в контейнер як root...$(NC)"
	docker exec -it $(CONTAINER_NAME) bash

exec: ## Виконати команду в контейнері (використання: make exec CMD="ls -la")
	docker exec -it $(CONTAINER_NAME) bash -c "$(CMD)"

status: ## Показати статус контейнера
	@echo "$(GREEN)Статус контейнера:$(NC)"
	@docker ps -a | grep $(CONTAINER_NAME) || echo "Контейнер не знайдено"

clean: ## Видалити контейнер і образи (volumes залишаться)
	@echo "$(RED)Видаляємо контейнер і образи...$(NC)"
	docker compose down --rmi all

clean-all: ## Видалити ВСЕ включно з volumes (ОБЕРЕЖНО!)
	@echo "$(RED)⚠️  УВАГА! Видаляємо ВСЕ включно з даними!$(NC)"
	@read -p "Впевнені? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v --rmi all; \
		echo "$(RED)✓ Все видалено!$(NC)"; \
	else \
		echo "$(YELLOW)Скасовано$(NC)"; \
	fi

open: ## Відкрити в браузері
	@echo "$(GREEN)Відкриваємо http://localhost:6080$(NC)"
	@if command -v xdg-open > /dev/null; then \
		xdg-open http://localhost:6080; \
	elif command -v open > /dev/null; then \
		open http://localhost:6080; \
	else \
		echo "$(YELLOW)Відкрийте вручну: http://localhost:6080$(NC)"; \
	fi

info: ## Показати детальну інформацію про систему
	@echo "$(GREEN)=== Інформація про Docker ===$(NC)"
	@docker --version
	@docker compose version
	@echo "\n$(GREEN)=== Розмір образів ===$(NC)"
	@docker images | grep ubuntu-gui || echo "Образ не знайдено"
	@echo "\n$(GREEN)=== Використання диску ===$(NC)"
	@docker system df
	@echo "\n$(GREEN)=== Volumes ===$(NC)"
	@docker volume ls | grep raw_tests || echo "Volumes не знайдено"

backup: ## Створити backup workspace
	@echo "$(GREEN)Створюємо backup...$(NC)"
	@mkdir -p $(BACKUP_DIR)
	@tar -czf $(BACKUP_DIR)/workspace-backup-$$(date +%Y%m%d-%H%M%S).tar.gz workspace/
	@echo "$(GREEN)✓ Backup створено в $(BACKUP_DIR)$(NC)"

restore: ## Відновити останній backup (використання: make restore BACKUP=filename.tar.gz)
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(RED)Помилка: вкажіть файл backup$(NC)"; \
		echo "Приклад: make restore BACKUP=workspace-backup-20241121-120000.tar.gz"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Відновлюємо backup: $(BACKUP)$(NC)"
	@tar -xzf $(BACKUP_DIR)/$(BACKUP) -C ./
	@echo "$(GREEN)✓ Backup відновлено!$(NC)"

list-backups: ## Показати всі backups
	@echo "$(GREEN)Доступні backups:$(NC)"
	@ls -lh $(BACKUP_DIR)/ 2>/dev/null || echo "Backups не знайдено"

update-deps: ## Оновити всі пакети в контейнері
	@echo "$(GREEN)Оновлюємо пакети...$(NC)"
	@docker exec -it $(CONTAINER_NAME) bash -c "apt-get update && apt-get upgrade -y"

install: ## Встановити програму (використання: make install PKG=chromium)
	@if [ -z "$(PKG)" ]; then \
		echo "$(RED)Помилка: вкажіть пакет$(NC)"; \
		echo "Приклад: make install PKG=chromium"; \
		exit 1; \
	fi
	@echo "$(GREEN)Встановлюємо $(PKG)...$(NC)"
	@docker exec -it $(CONTAINER_NAME) bash -c "apt-get update && apt-get install -y $(PKG)"

stats: ## Показати використання ресурсів контейнера
	@docker stats $(CONTAINER_NAME) --no-stream

ports: ## Показати відкриті порти
	@echo "$(GREEN)Відкриті порти:$(NC)"
	@docker port $(CONTAINER_NAME)