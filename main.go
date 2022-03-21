package main

import (
	"app/api"
	"app/service"
	"context"
	"embed"
	"io/fs"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const path = "web/build"

//go:embed web/build
//go:embed web/build/_next
//go:embed web/build/_next/static/chunks/pages/*.js
//go:embed web/build/_next/static/*/*.js
var nextFS embed.FS

func init() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

func main() {
	build, err := fs.Sub(nextFS, path)

	if err != nil {
		log.Panic().Err(err).Msg("Static")
	}

	port := 8080                        // Should be a flag
	profile := os.Getenv("AWS_PROFILE") // Should be a flag
	region := "us-east-1"               // Should be a flag

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithDefaultRegion(region), config.WithSharedConfigProfile(profile))

	if err != nil {
		log.Panic().Err(err).Msg("AWS.Config")
	}

	router := mux.NewRouter()
	client := s3.NewFromConfig(cfg)

	svc := service.New(client)
	a := api.New(router, build, svc)
	a.Start(port)
}
