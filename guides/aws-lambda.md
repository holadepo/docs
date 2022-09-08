---
title: "Best Practices Calling AWS Lambda from Airflow"
description: "A few tips, guidelines, and best practices for calling Lambda from Airflow"
id: aws-lambda
sidebar_label: AWS Lambda
---

Follow this guide to learn some best practices for triggering [AWS Lambda](https://goo.gl/zYGM7L) functions directly from Airflow.

## AWS Lambda basics

AWS Lambda lets you run code without provisioning or managing servers. You can use AWS Lambda to execute code in response to triggers such as a change in data or a particular user action.

It can be directly triggered by a variety of services and can be orchestrated in workflows. Naturally, the latter can effectively be done using Airflow.

In general, Astronomer recommends coupling Airflow with a serverless Lambda framework such as [Serverless](https://serverless.com/), as there is a significant amount of boilerplate code involved in writing, deploying, updating, and maintaining both serverless functions and an API Gateway.

## Lambda & Airflow

To call an AWS Lambda function in Airflow, you have a few options:

### Invoke a call in Boto3

The simplest way to call an AWS Lambda function in Airflow is to [invoke](https://boto3.readthedocs.io/en/latest/reference/services/lambda.html#Lambda.Client.invoke) it in [Boto3](https://aws.amazon.com/sdk-for-python/) with the [PythonOperator](https://registry.astronomer.io/providers/apache-airflow/modules/pythonoperator).

The [AwsLambdaHook](https://registry.astronomer.io/providers/amazon/modules/awslambdahook) itself uses the [AwsBaseHook](https://registry.astronomer.io/providers/amazon/modules/awsbasehook). This is is a wrapper around the boto3 library, which is the standard way to interact with AWS using Python. After you configure an Airflow connection to AWS, you can use the hook in one of your operators to trigger a particular Lambda function.

### Use the SimpleHttpOperator

Another option would be to use the [SimpleHttpOperator](https://registry.astronomer.io/providers/http/modules/simplehttpoperator) in Airflow to hit the Lambda function, much like a REST API.

### Trigger AWS Lambda using an AWS API gateway

You can trigger Lambda functions using an [AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html).

You can still use the `SimpleHttpOperator` as a starting point, but you now also have to handle HTTP Authorization.

## Use cases

Users often run Lambda functions in parallel to another process for refreshing tokens.

For example, you could run ELT pipeline with GA, Pardot, HubSpot, and Marketo to serve a Lambda token and refresh it as soon as it expires.

## Considerations

There are a few caveats to invoking Lambda from Airflow:

- Execution time is limited.
- It's relatively difficult to debug.
- Light security concerns.

## Alternatives

If AWS Lambda doesn't fit your needs, you can likely run what you need using [Selenium](https://seleniumhq.github.io/selenium/docs/api/py/).
