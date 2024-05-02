FROM golang:1.22.2-alpine as builder
RUN apk update && apk add git ca-certificates curl gnupg

ENV USER=genos
ENV UID=10001
RUN adduser --disabled-password --home "/nonexistent" --shell "/sbin/nologin" --no-create-home --uid "${UID}" "${USER}"

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o bizmate


##############################################################################


FROM scratch
COPY --from=builder /app/bizmate /bizmate
COPY --from=builder /app/.env /.env
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group
USER genos:genos

ENTRYPOINT ["/bizmate"]
