FROM golang:1.22.2-alpine

RUN go install github.com/cosmtrek/air@latest

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .
