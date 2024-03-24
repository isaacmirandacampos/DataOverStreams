# DataOverStreams

A manipulate of large data. We can upload a large csv file to s3 and consume the file when the upload is complete.
The aim is to use the Terraform, Localstack and Docker to manage the infrastructure. As well as making a simple code dealing with this file on demand.

## Diagram

![diagram of data over streams](images/flow.png 'Diagram of data over streams')

## Technologies used

- Terraform
- Docker
- Localstack
- Node.js
- Typescript
- AWS S3
- DynamoDB

## Prerequisites

- Docker
- Docker compose
- Terraform cli
- awslocal cli

## How to run?

Create the localstack and api container:

```sh
docker compose up -d --build
```

Create the infrastructure in localstack:

```sh
terraform init
terraform apply -auto-approve
```

You can check that it is working by running the command:

```sh
awslocal s3api list-buckets
```

The output:

```sh
{
    "Buckets": [
        {
            "Name": "credentials",
            "CreationDate": "2024-03-17T12:49:49+00:00"
        }
    ],
    "Owner": {
        ...
    }
}
```

### Use endpoint documentation

You can install the usebruno tool and import the collection.
