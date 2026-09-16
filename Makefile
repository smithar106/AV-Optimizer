.PHONY: help api web test lint build

help:
	@echo "AVantage — common tasks"
	@echo "  make api     Run the FastAPI service (port 8000)"
	@echo "  make web     Run the Next.js app (port 3000)"
	@echo "  make test    Run API tests + web lint/build"
	@echo "  make lint    Lint API (ruff) and web (eslint)"

api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

web:
	cd apps/web && npm run dev

test:
	cd apps/api && python -m pytest -q
	cd apps/web && npm run lint && npm run build

lint:
	cd apps/api && ruff check app || true
	cd apps/web && npm run lint
