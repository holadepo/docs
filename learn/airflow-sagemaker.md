---
title: "Orchestrate SageMaker with Airflow"
sidebar_label: "Amazon SageMaker"
description: "Orchestrate SageMaker machine learning pipelines with your Airflow DAGs."
id: airflow-sagemaker
---

[Amazon SageMaker](https://aws.amazon.com/sagemaker/) is a comprehensive AWS machine learning (ML) service that is frequently used by data scientists to develop and deploy ML models at scale. By nature, working with ML models in production requires automation and orchestration for repeated model training, testing, evaluation, and integration with other services to acquire and prepare data. 

Airflow is the perfect orchestrator to pair with SageMaker. With Airflow, you can orchestrate every step of your SageMaker pipeline, integrate with services that clean your data, and store and publish your results using only Python code.

In this tutorial, you'll learn about the SageMaker modules that are available in the [AWS Airflow provider package](https://registry.astronomer.io/providers/amazon). You'll also complete sample implementations that use Airflow to get inferences from an existing SageMaker model and orchestrate a full ML pipeline including creating, training, and testing a new SageMaker model. 

All code used in this tutorial is located in the [Astronomer Registry](https://registry.astronomer.io/dags/sagemaker-run-model).

## Assumed knowledge

To get the most out of this tutorial, make sure you have an understanding of:

- The basics of [Amazon S3](https://aws.amazon.com/s3/getting-started/) and [Amazon SageMaker](https://aws.amazon.com/sagemaker/getting-started/).
- Airflow fundamentals, such as writing DAGs and defining tasks. See [Get started with Apache Airflow](get-started-with-airflow.md).
- Airflow operators. See [Operators 101](what-is-an-operator.md).
- Airflow connections. See [Managing your Connections in Apache Airflow](connections.md).

## SageMaker modules

There are multiple SageMaker operators and sensors available within the [AWS provider](https://registry.astronomer.io/providers/amazon) that cover a wide range of SageMaker features. All of these are built on the [SageMakerBaseOperator](https://registry.astronomer.io/providers/amazon/modules/sagemakerbaseoperator), which uses the SageMaker API. If you're new to working with SageMaker, you should review the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_Operations_Amazon_SageMaker_Service.html) before you configure operators and sensors.

Each operator initiates a specific SageMaker job and each sensor waits for a specific job to complete. Specifically:

- [`SageMakerEndpointOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointoperator): Creates a SageMaker endpoint.
- [`SageMakerEndpointConfigOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointconfigoperator): Creates a SageMaker endpoint config.
- [`SageMakerModelOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakermodeloperator): Creates a SageMaker model.
- [`SageMakerProcessingOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakerprocessingoperator): Initiates a SageMaker processing job.
- [`SageMakerTrainingOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertrainingoperator): Initiates a SageMaker training job.
- [`SageMakerTransformOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertransformoperator): Initiates a SageMaker transform job.
- [`SageMakerTuningOperator`](https://registry.astronomer.io/providers/amazon/modules/sagemakertuningoperator): Initiates a SageMaker hyperparameter tuning job.
- [`SageMakerEndpointSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakerendpointsensor): Waits until the endpoint state is terminated.
- [`SageMakerTransformSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertransformsensor): Waits until the transform state is terminated.
- [`SageMakerTuningSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertuningsensor): Waits until the tuning state is terminated.
- [`SageMakerTrainingSensor`](https://registry.astronomer.io/providers/amazon/modules/sagemakertrainingsensor): Waits until the training state is terminated.

The following use cases demonstrate how to use some of these operators, but they generally all have similar requirements, such as an input configuration for the job being executed. Documentation on what should be included in each configuration can be found in the Actions section of the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_Operations.html).

## Use case 1: Orchestrate an existing SageMaker model

In this example, you'll use a DAG to acquire data, make predictions on the data with a SageMaker model, and then store the results in your data warehouse. This use case is relevant if you need to use your model to make predictions (run inferences) on a scheduled or ad-hoc basis. You can run the DAG on a schedule if you know new data is going to be available consistently, or use a sensor to trigger the DAG whenever new data becomes available.

This use case assumes that the SageMaker model already exists and is not being managed by Airflow. For example, you might use a SageMaker notebook to do exploratory data analysis and develop and deploy your model, and then use Airflow to execute that model as needed. This example uses the [SageMaker notebooks tutorial](https://docs.aws.amazon.com/sagemaker/latest/dg/gs-console.html), which creates an XGBoost model from a census dataset.

For your pipeline, you take data from a local CSV file and upload it to Amazon S3. Then you make predictions on the data with the SageMaker model by submitting a [SageMaker batch transform job](https://docs.aws.amazon.com/sagemaker/latest/dg/how-it-works-batch.html). Batch transforms are useful when you need to run inferences on large datasets and don't have a persistent endpoint hosted for your model. They require input data to be provided in Amazon S3, and save output results to the provided Amazon S3 path. For the last step in your pipeline, you'll load the results CSV into Redshift.

To implement the complete pipeline, you have to implement the following steps:

1. Load the data from local storage (`include/`) into Amazon S3 using the `PythonOperator` with `S3Hook`. 
2. Submit a SageMaker transform job to get inferences on the data using the `SageMakerTransformOperator`. The operator requires a transform job configuration, which in this case is provided in the `transform_config` dictionary at the top of the DAG file. At a minimum, the transform job configuration requires:

    - A unique name
    - Input data source in S3
    - Output data S3 path
    - Transform resources (i.e. the machine you want to run your transform job on)
    - Model name

    For more on what parameters can be passed in the config, check out the [Create Transform Job API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTransformJob.html).

3. Upload the inference results to Redshift using the `S3toRedshiftOperator`.

    `SageMakerTransformOperator` requires XCom pickling to work successfully because it returns a `datetime` object that is not JSON serializable. To turn on XCom pickling, set `AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True` in your Airflow environment. To use the operator without pickling, consider implementing a [custom XCom backend](custom-xcom-backends.md).

The full DAG code looks like this:

```python
from airflow import DAG
from airflow.decorators import task
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.operators.sagemaker_transform import SageMakerTransformOperator
from airflow.providers.amazon.aws.transfers.s3_to_redshift import S3ToRedshiftOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook

from datetime import datetime, timedelta

"""
This DAG shows an example implementation of executing predictions from a machine learning model using AWS SageMaker.
The DAG assumes that a SageMaker model has already been created, and runs the one-time batch inference job
using SageMaker batch transform. This method is useful if you don't have a hosted model endpoint and want
to run ad-hoc predictions when data becomes available.

The DAG uploads a local dataset from the /include directory to S3, then submits a Batch Transform job to SageMaker
to get model inference on that data. The inference results are saved to the S3 Output Path given in the config.
Finally, the inference results are uploaded to a table in Redshift using the S3 to Redshift transfer operator.
"""

# Define variables used in config and Python function
date = '{{ ds_nodash }}'                                                     # Date for transform job name
s3_bucket = 'sagemaker-us-east-2-559345414282'                               # S3 Bucket used with SageMaker 
test_s3_key = 'demo-sagemaker-xgboost-adult-income-prediction/test/test.csv' # Test data S3 key
output_s3_key = 'demo-sagemaker-xgboost-adult-income-prediction/output/'     # Model output data S3 key
sagemaker_model_name = "sagemaker-xgboost-2021-08-03-23-25-30-873"           # SageMaker model name

# Define transform config for the SageMakerTransformOperator
transform_config = {
        "TransformJobName": "test-sagemaker-job-{0}".format(date),
        "TransformInput": { 
            "DataSource": { 
                "S3DataSource": {
                    "S3DataType":"S3Prefix", 
                    "S3Uri": "s3://{0}/{1}".format(s3_bucket, test_s3_key)
                }
            },
            "SplitType": "Line",
            "ContentType": "text/csv",
        },
        "TransformOutput": { 
            "S3OutputPath": "s3://{0}/{1}".format(s3_bucket, output_s3_key)
        },
        "TransformResources": { 
            "InstanceCount": 1,
            "InstanceType": "ml.m5.large"
        },
        "ModelName": sagemaker_model_name
    }

# Default settings applied to all tasks
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=1)
}

with DAG('sagemaker_model',
         start_date=datetime(2021, 7, 31),
         max_active_runs=1,
         schedule_interval='@daily',
         default_args=default_args,
         catchup=False
         ) as dag:

    @task
    def upload_data_to_s3(s3_bucket, test_s3_key):
        """
        Uploads validation data to S3 from /include/data 
        """
        s3_hook = S3Hook(aws_conn_id='aws-sagemaker')

        # Take string, upload to S3 using predefined method
        s3_hook.load_file(filename='include/data/test.csv', 
                        key=test_s3_key, 
                        bucket_name=s3_bucket, 
                        replace=True)

    upload_data = upload_data_to_s3(s3_bucket, test_s3_key)

    predict = SageMakerTransformOperator(
        task_id='predict',
        config=transform_config,
        aws_conn_id='aws-sagemaker'
    )

    results_to_redshift = S3ToRedshiftOperator(
            task_id='save_results',
            aws_conn_id='aws-sagemaker',
            s3_bucket=s3_bucket,
            s3_key=output_s3_key,
            schema="PUBLIC",
            table="results",
            copy_options=['csv'],
        )

    upload_data >> predict >> results_to_redshift
```

Every operator in this DAG utilizes an `aws_conn_id`. This example creates an IAM user who can access all relevant resources and an Airflow connection with an access key and token as the log in and password. If you're using this methodology, the SageMaker operators require a region to be specified as an extra. The connection should appear similar to the following:

![SageMaker Connection](/img/guides/sagemaker_connection.png)

Depending on your Airflow environment, you could also have your Airflow deployment assume an IAM role that has access to the resources.

Now, if you run this DAG and open your SageMaker dashboard, you should see the job show up below **Batch transform jobs**.

![Transform Job](/img/guides/sagemaker_transform_job.png)

The output of the transform job is uploaded to Redshift, where you can access the results. This is a simple use case, but you can easily extend this DAG to acquire data from an external system, clean or pre-process data, and complete the additional tasks necessary to publish the results after saving them to Redshift.

## Use case 2: Orchestrate a full ML pipeline

In this example, you'll use Airflow to acquire and pre-process data, train a model, create a model from the training results, and then evaluate the model on test data using a batch transform job. This use case is relevant if you want to automate the model training, testing, and deployment components of your ML pipeline.

For this example, you'll use the [Iris dataset](https://archive.ics.uci.edu/ml/datasets/iris), and train a built-in SageMaker K-Nearest Neighbors (KNN) model. The general steps in the DAG are:

1. Using a `PythonOperator` to pull the data from the API, complete some pre-processing so the data is compliant with KNN requirements, split into train and test sets, and save them to S3 using the `S3Hook`.
2. Train the KNN algorithm on the data using the `SageMakerTrainingOperator`. The configuration for this operator requires: 

    - Information about the algorithm being used
    - Any required hyper parameters
    - The input data configuration
    - The output data configuration
    - Resource specifications for the machine running the training job 
    - The Role ARN for execution

    For more information about submitting a training job, check out the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTrainingJob.html).

3. Create a SageMaker model based on the training results using the `SageMakerModelOperator`. This step creates a model artifact in SageMaker that can be called on demand to provide inferences. The configuration for this operator requires:

    - A name for the model
    - The Role ARN for execution
    - The image containing the algorithm (in this case the pre-built SageMaker image for KNN)
    - The S3 path to the model training artifact 
    
    For more information on creating a model, check out the API documentation [here](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateModel.html).
4. Evaluate the model on the test data created in Step 1 using the `SageMakerTransformOperator`. This step runs a batch transform to get inferences on the test data from the model created in Step 3. The configuration for this operator requires:

    - Information about the input data source
    - The output results path
    - Resource specifications for the machine running the training job
    - The name of the model 
    
    For more information on submitting a batch transform job, check out the [API documentation](https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_CreateTransformJob.html).

The DAG code looks like this:

```python
from airflow import DAG
from airflow.decorators import task
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.operators.sagemaker_training import SageMakerTrainingOperator
from airflow.providers.amazon.aws.operators.sagemaker_model import SageMakerModelOperator
from airflow.providers.amazon.aws.operators.sagemaker_transform import SageMakerTransformOperator
from airflow.providers.amazon.aws.hooks.s3 import S3Hook

from datetime import datetime, timedelta
import requests
import io
import pandas as pd
import numpy as np

"""
This DAG shows an example implementation of machine learning model orchestration using Airflow
and AWS SageMaker. Using the AWS provider's SageMaker operators, Airflow orchestrates getting data
from an API endpoint and pre-processing it (PythonOperator), training the model (SageMakerTrainingOperator),
creating the model with the training results (SageMakerModelOperator), and testing the model using
a batch transform job (SageMakerTransformOperator).

The example use case shown here is using a built-in SageMaker K-nearest neighbors algorithm to make
predictions on the Iris dataset. To use the DAG, fill in the information directly below with the target
AWS S3 locations, execution role ARN, and model and training job names.
"""

# Define variables used in configs
data_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data"   # URL for Iris data API
date = '{{ ds_nodash }}'                                                                # Date for transform job name
s3_bucket = 'sagemaker-us-east-2-559345414282'                                          # S3 Bucket used with SageMaker instance
input_s3_key = 'iris/processed-input-data'                                              # Train and test data S3 path
output_s3_key = 'iris/results'                                                          # S3 path for output data
role = 'your-role-arn'                                                                  # Role ARN to execute SageMaker jobs
model_name = "Iris-KNN"                                                                # Name of model to create
training_job_name = 'train-iris'                                                        # Name of training job

# Define configs for training, model creation, and batch transform jobs
training_config = {
   "AlgorithmSpecification": { 
      "TrainingImage": "404615174143.dkr.ecr.us-east-2.amazonaws.com/knn",
      "TrainingInputMode": "File"
   },
    "HyperParameters": { 
      "predictor_type": "classifier",
      "feature_dim": "4",
      "k": "3",
      "sample_size": "150"
   },
   "InputDataConfig": [ 
      {"ChannelName": "train",
        "DataSource": { 
            "S3DataSource": { 
               "S3DataType": "S3Prefix",
               "S3Uri": "s3://{0}/{1}/train.csv".format(s3_bucket, input_s3_key)
            }
         },
         "ContentType": "text/csv",
         "InputMode": "File"
      }
   ],
   "OutputDataConfig": { 
      "S3OutputPath": "s3://{0}/{1}/results.csv".format(s3_bucket, output_s3_key)
   },
   "ResourceConfig": { 
      "InstanceCount": 1,
      "InstanceType": "ml.m5.large",
      "VolumeSizeInGB": 1
   },
   "RoleArn": role,
   "StoppingCondition": { 
      "MaxRuntimeInSeconds": 6000
   },
   "TrainingJobName": training_job_name
}

model_config = {
   "ExecutionRoleArn": role,
   "ModelName": model_name,
   "PrimaryContainer": { 
      "Mode": "SingleModel",
      "Image": "404615174143.dkr.ecr.us-east-2.amazonaws.com/knn",
      "ModelDataUrl": "s3://{0}/{1}/{2}/output/model.tar.gz".format(s3_bucket, output_s3_key, training_job_name),
   },
}

transform_config = {
    "TransformJobName": "test-knn-{0}".format(date),
    "TransformInput": { 
        "DataSource": { 
            "S3DataSource": {
                "S3DataType":"S3Prefix", 
                "S3Uri": "s3://{0}/{1}/test.csv".format(s3_bucket, input_s3_key)
            }
        },
        "SplitType": "Line",
        "ContentType": "text/csv",
    },
    "TransformOutput": { 
        "S3OutputPath": "s3://{0}/{1}".format(s3_bucket, output_s3_key)
    },
    "TransformResources": { 
        "InstanceCount": 1,
        "InstanceType": "ml.m5.large"
    },
    "ModelName": model_name
    }

# Default settings applied to all tasks
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0,
    'retry_delay': timedelta(minutes=1)
}

with DAG('sagemaker_pipeline',
         start_date=datetime(2021, 7, 31),
         max_active_runs=1,
         schedule_interval='@daily',
         default_args=default_args,
         catchup=False
         ) as dag:

    @task
    def data_prep(data_url, s3_bucket, input_s3_key):
        """
        Grabs the Iris dataset from API, splits into train/test splits, and saves CSV's to S3 using S3 Hook
        """
        # Get data from API
        iris_response = requests.get(data_url).content
        columns = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']
        iris = pd.read_csv(io.StringIO(iris_response.decode('utf-8')), names=columns)

        # Process data
        iris['species'] = iris['species'].replace({'Iris-virginica': 0, 'Iris-versicolor': 1, 'Iris-setosa': 2})
        iris = iris[['species', 'sepal_length', 'sepal_width', 'petal_length', 'petal_width']]
        
        # Split into test and train data
        iris_train, iris_test = np.split(iris.sample(frac=1, random_state=np.random.RandomState()), [int(0.7 * len(iris))])
        iris_test.drop(['species'], axis=1, inplace=True)

        # Save files to S3
        iris_train.to_csv('iris_train.csv', index=False, header=False)
        iris_test.to_csv('iris_test.csv', index=False, header=False)
        s3_hook = S3Hook(aws_conn_id='aws-sagemaker')
        s3_hook.load_file('iris_train.csv', '{0}/train.csv'.format(input_s3_key), bucket_name=s3_bucket, replace=True)
        s3_hook.load_file('iris_test.csv', '{0}/test.csv'.format(input_s3_key), bucket_name=s3_bucket, replace=True)

    data_prep = data_prep(data_url, s3_bucket, input_s3_key)

    train_model = SageMakerTrainingOperator(
        task_id='train_model',
        config=training_config,
        aws_conn_id='aws-sagemaker',
        wait_for_completion=True
    )

    create_model = SageMakerModelOperator(
        task_id='create_model',
        config=model_config,
        aws_conn_id='aws-sagemaker'
    )

    test_model = SageMakerTransformOperator(
        task_id='test_model',
        config=transform_config,
        aws_conn_id='aws-sagemaker'
    )

    data_prep >> train_model >> create_model >> test_model
```

The graph view of the DAG looks similar to this:

![SageMaker Pipeline](/img/guides/sagemaker_pipeline.png)

When using this DAG, there are a couple of other things to be aware of for your Airflow environment:

- All of the tasks in this DAG make use of a `aws-sagemaker` connection ID to connect to the AWS environment.
- Some SageMaker operators may require the `AWS_DEFAULT_REGION` to be set in your Airflow environment in addition to a region being specified in the AWS connection. If you're using Astro, you can set this variable in the Cloud UI or in your Dockerfile (`ENV AWS_DEFAULT_REGION=us-east-2`).
- Many of the SageMaker operators require a Role ARN to be provided in the configuration. If you don't want to store this directly in your DAG file, consider storing it as an Airflow variable.
-Some SageMaker operators require XCom pickling to be turned on in order to work because they return objects that are not JSON serializable. To enable XCom pickling, set `AIRFLOW__CORE__ENABLE_XCOM_PICKLING=True`

You've learned how you can use Airflow with SageMaker to automate an end-to-end ML pipeline. A natural next step would be to deploy this model to a SageMaker endpoint using the `SageMakerEndpointConfigOperator` and `SageMakerEndpointOperator`, which provisions resources to host the model. In general, the SageMaker modules in the AWS provider allow for many possibilities when using Airflow to orchestrate ML pipelines.
