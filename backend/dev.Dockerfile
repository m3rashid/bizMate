FROM golang:1.23-alpine

RUN go install github.com/air-verse/air@latest

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .
