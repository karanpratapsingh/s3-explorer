package service

import (
	"context"
	"s3explorer/utils"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/rs/zerolog/log"
)

type serviceImpl struct {
	client *s3.Client
}

func New(client *s3.Client) serviceImpl {
	return serviceImpl{client}
}

func (svc serviceImpl) Buckets(ctx context.Context) (BucketsResponse, error) {
	output, err := svc.client.ListBuckets(ctx, nil)

	if err != nil {
		log.Error().Err(err).Msg("Service.Buckets")
		return BucketsResponse{}, err
	}

	var buckets []Bucket
	total := len(output.Buckets)

	for _, bucket := range output.Buckets {
		buckets = append(buckets, Bucket{*bucket.Name, *bucket.CreationDate})
	}

	return BucketsResponse{buckets, total}, nil
}

func (svc serviceImpl) Navigate(ctx context.Context, request NavigateRequest) (NavigateResponse, error) {
	var data []S3Object = make([]S3Object, 0)

	delimiter := "/"

	params := s3.ListObjectsV2Input{
		Bucket:    &request.Bucket,
		Prefix:    &request.Prefix,
		Delimiter: &delimiter,
	}

	output, err := svc.client.ListObjectsV2(ctx, &params)

	if err != nil {
		log.Error().Err(err).Msg("Service.Navigate.Error")
		return NavigateResponse{data}, err
	}

	var files = make([]S3Object, 0)
	var folders = make([]S3Object, 0)

	if output.Contents != nil {
		for _, content := range output.Contents {
			key := *content.Key
			name := utils.Trim(key, request.Prefix, delimiter)

			if *content.Key != request.Prefix {
				files = append(files, S3Object{name, key, &content.Size, S3ObjectTypeFile})
			}
		}
	}

	if output.CommonPrefixes != nil {
		for _, common := range output.CommonPrefixes {
			key := *common.Prefix
			name := utils.Trim(key, request.Prefix, delimiter)

			folders = append(folders, S3Object{name, key, nil, S3ObjectTypeFolder})
		}
	}

	data = utils.Concat(files, folders)

	log.Debug().
		Str("bucket", request.Bucket).
		Str("prefix", request.Prefix).
		Int("total", len(data)).
		Msg("Service.Navigate")

	return NavigateResponse{data}, nil
}

func (svc serviceImpl) Presign(ctx context.Context, request PresignRequest) (PresignResponse, error) {
	expires, err := time.ParseDuration(request.Duration)

	if err != nil {
		log.Error().Err(err).Msg("Service.Parse.Error")
		return PresignResponse{}, err
	}

	params := s3.GetObjectInput{
		Bucket: &request.Bucket,
		Key:    &request.Key,
	}

	client := s3.NewPresignClient(svc.client, s3.WithPresignExpires(expires))
	output, err := client.PresignGetObject(ctx, &params)

	if err != nil {
		log.Error().Err(err).Msg("Service.Presign.Error")
		return PresignResponse{}, err
	}

	return PresignResponse{output.URL}, nil
}
