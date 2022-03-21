run-web:
	cd web && npm run dev

run-server:
	cd web && npm run build
	go run main.go

build:
	cd web && npm run export
	go build -o app
