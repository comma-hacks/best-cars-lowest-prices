
FROM golang:1.19.5-bullseye

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download
