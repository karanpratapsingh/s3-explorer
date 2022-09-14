package main

import (
	"context"
	"embed"
	"flag"
	"io/fs"
	"os"
	"s3explorer/api"
	"s3explorer/service"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gorilla/mux"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

const path = "web/build"

//go:embed web/build
//go:embed web/build/_next
//go:embed web/build/_next/static/css/*.css
//go:embed web/build/_next/static/chunks/pages/*.js
//go:embed web/build/_next/static/*/*.js
var nextFS embed.FS

func init() {
	if os.Getenv("ENVIRONMENT") == "development" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	}
}

func main() {
	port := 8080
	region := flag.String("region", "", "AWS region")
	profile := flag.String("profile", "", "AWS profile")

	flag.Parse()

	build, err := fs.Sub(nextFS, path)

	if err != nil {
		log.Panic().Err(err).Msg("Static.Error")
	}

	cfg, err := prepareConfig(region, profile)

	if err != nil {
		log.Panic().Err(err).Msg("AWS.Config.Error")
	}

	log.Trace().Str("region", *region).Msg("AWS.Config")

	router := mux.NewRouter()
	client := s3.NewFromConfig(cfg)

	svc := service.New(client)
	a := api.New(router, build, svc)
	a.Start(port)
}

func prepareConfig(region, profile *string) (aws.Config, error) {
	var options []func(*config.LoadOptions) error

	if *region == "" { // Region is required
		flag.Usage()
		panic("AWS Region is required")
	}

	if *profile != "" {
		options = append(options, config.WithSharedConfigProfile(*profile))
	}

	options = append(options, config.WithDefaultRegion(*region))

	return config.LoadDefaultConfig(context.TODO(), options...)
}
