FROM golang:1.22.2-alpine AS builder
WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN (rm -rf /app/bin/backend || true) && go build -o /app/bin/backend .


FROM caddy:latest
WORKDIR /app

COPY --from=builder /app/bin/backend /app/bin/backend
COPY --from=builder /app/public /app/public
COPY --from=builder /app/i18n /app/i18n

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
