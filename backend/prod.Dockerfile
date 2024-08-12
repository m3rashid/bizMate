FROM golang:1.22.2-alpine AS builder

RUN go install github.com/cosmtrek/air@latest

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN (rm -rf /app/bin/backend || true) && go build -o /app/bin/backend .


FROM scratch
WORKDIR /app

COPY --from=builder /app/bin/backend /app/bin/backend
COPY --from=builder /app/public /app/public
COPY --from=builder /app/i18n /app/i18n

ENTRYPOINT ["/app/bin/backend"]
EXPOSE 4000
