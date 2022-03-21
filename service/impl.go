package service

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/rs/zerolog/log"
)

type serviceImpl struct {
	client *s3.Client
}

func New(client *s3.Client) serviceImpl {
	return serviceImpl{client}
}

func (svc serviceImpl) Buckets(ctx context.Context) BucketsResponse {
	output, err := svc.client.ListBuckets(ctx, nil)

	if err != nil {
		log.Error().Err(err).Msg("Service.ListBuckets")
		return BucketsResponse{}
	}

	var buckets []Bucket
	total := len(output.Buckets)

	for _, bucket := range output.Buckets {
		buckets = append(buckets, Bucket{*bucket.Name, *bucket.CreationDate})
	}

	return BucketsResponse{buckets, total}
}

func (svc serviceImpl) Navigate(ctx context.Context, request NavigateRequest) NavigateResponse {

	return NavigateResponse{}
}
