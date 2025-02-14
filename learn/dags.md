---
title: "Introduction to Airflow DAGs"
sidebar_label: "DAGs"
description: "How to write your first DAG in Apache Airflow"
id: dags
---

In Airflow, data pipelines are defined in Python code as directed acyclic graphs, also known as DAGs. Within a graph, each node represents a task which completes a unit of work, and each edge represents a dependency between tasks.

In this tutorial, you'll learn DAG basics and about DAG parameters and how to define a DAG in Python.

## Assumed knowledge

To get the most out of this guide, you should have an understanding of:

- Basic Airflow concepts. See [Introduction to Apache Airflow](intro-to-airflow.md).
- Airflow operators. See [Operators 101](what-is-an-operator.md).

## What is a DAG?

In Airflow, a directed acyclic graph (DAG) is a data pipeline defined in Python code. Each DAG represents a collection of tasks you want to run and is organized to show relationships between tasks in the Airflow UI. The mathematical properties of DAGs make them useful for building data pipelines:

- Directed: If multiple tasks exist, then each task must have at least one defined upstream or downstream task.
- Acyclic: Tasks cannot have a dependency to themselves. This avoids infinite loops.
- Graph: All tasks can be visualized in a graph structure, with relationships between tasks defined by nodes and vertices.

Aside from these requirements, DAGs in Airflow can be defined however you need! They can have a single task or thousands of tasks arranged in any number of ways.

An instance of a DAG running on a specific date is called a DAG run. DAG runs can be started by the Airflow scheduler based on the DAG's defined schedule, or they can be started manually.

## Writing a DAG

DAGs in Airflow are defined in a Python script that is placed in an Airflow project's `DAG_FOLDER`. Airflow will execute the code in this folder to load any DAG objects. If you are working with the [Astro CLI](https://docs.astronomer.io/astro/cli/overview), DAG code is placed in the `dags` folder. 

Most DAGs follow this general flow within a Python script:

- Imports: Any needed Python packages are imported at the top of the DAG script. This always includes a `dag` function import (either the `DAG` class or the `dag` decorator). It can also include provider packages or other general Python packages.
- DAG instantiation: A DAG object is created and any DAG-level parameters such as the schedule interval are set.
- Task instantiation: Each task is defined by calling an operator and providing necessary task-level parameters.
- Dependencies: Any dependencies between tasks are set using bitshift operators (`<<` and `>>`), the `set_upstream()` or `set_downstream` functions, or the `chain()` function. Note that if you are using the TaskFlow API, dependencies are inferred based on the task function calls.

The following example DAG loads data from Amazon S3 to Snowflake, runs a Snowflake query, and then sends an email.

```python
from airflow import DAG

from airflow.operators.email_operator import EmailOperator
from airflow.providers.snowflake.operators.snowflake import SnowflakeOperator
from airflow.providers.snowflake.transfers.s3_to_snowflake import S3ToSnowflakeOperator

from datetime import datetime, timedelta

# Instantiate DAG
with DAG(
    's3_to_snowflake',
    start_date=datetime(2020, 6, 1),
    schedule_interval='@daily',
    default_args={
        'retries': 1,
        'retry_delay': timedelta(minutes=5)
    },
    catchup=False
) as dag:

    # Instantiate tasks within the DAG context
    load_file = S3ToSnowflakeOperator(
        task_id='load_file',
        s3_keys=['key_name.csv'],
        stage='snowflake_stage',
        table='my_table',
        schema='my_schema',
        file_format='csv',
        snowflake_conn_id='snowflake_default'
    )

    snowflake_query = SnowflakeOperator(
        task_id="run_query",
        sql='SELECT COUNT(*) FROM my_table'
    )

    send_email = EmailOperator(
        task_id='send_email',
        to='noreply@astronomer.io',
        subject='Snowflake DAG',
        html_content='<p>The Snowflake DAG completed successfully.<p>'
    )

    # Define dependencies
    load_file >> snowflake_query >> send_email

```

The example DAG makes use of the [Snowflake provider package](https://registry.astronomer.io/providers/snowflake). Providers are Python packages separate from core Airflow that contain hooks, operators, and sensors to integrate Airflow with third party services. The [Astronomer Registry](https://registry.astronomer.io/) is the best place to go to learn about available Airflow providers.

Astronomer recommends creating one Python file for each DAG. Some advanced use cases might require dynamically generating DAG files, which can also be accomplished using Python.

### Writing DAGs with the TaskFlow API

In Airflow 2.0 and later, you can use the TaskFlow API as an alternative to the operators shown in the previous example DAG. With the TaskFlow API, you can define your DAG and any PythonOperator tasks using decorators. The purpose of decorators in Airflow is to simplify the DAG authoring experience by eliminating boilerplate code. How you author your DAGs is a matter of preference and style. 

For example, the following DAG is generated when you initialize an Astro project with the Astro CLI:

```python
import json
from datetime import datetime, timedelta

from airflow.decorators import dag, task

@dag(
    schedule_interval="@daily",
    start_date=datetime(2021, 1, 1),
    catchup=False,
    default_args={
        "retries": 2
    },
    tags=['example'])
def example_dag_basic():
    """
    ### Basic ETL Dag
    This is a simple ETL data pipeline example that demonstrates the use of
    the TaskFlow API using three simple tasks for extract, transform, and load.
    For more information on Airflow's TaskFlow API, reference documentation here:
    https://airflow.apache.org/docs/apache-airflow/stable/tutorial_taskflow_api.html
    """

    @task()
    def extract():
        """
        #### Extract task
        A simple "extract" task to get data ready for the rest of the
        pipeline. In this case, getting data is simulated by reading from a
        hardcoded JSON string.
        """
        data_string = '{"1001": 301.27, "1002": 433.21, "1003": 502.22}'

        order_data_dict = json.loads(data_string)
        return order_data_dict

    @task(multiple_outputs=True) # multiple_outputs=True unrolls dictionaries into separate XCom values
    def transform(order_data_dict: dict):
        """
        #### Transform task
        A simple "transform" task which takes in the collection of order data and
        computes the total order value.
        """
        total_order_value = 0

        for value in order_data_dict.values():
            total_order_value += value

        return {"total_order_value": total_order_value}

    @task()
    def load(total_order_value: float):
        """
        #### Load task
        A simple "load" task that takes in the result of the "transform" task and prints it out,
        instead of saving it to end user review
        """

        print(f"Total order value is: {total_order_value:.2f}")

    # Call the task functions to instantiate them and infer dependencies
    order_data = extract()
    order_summary = transform(order_data)
    load(order_summary["total_order_value"])

# Call the dag function to register the DAG
example_dag_basic = example_dag_basic()
```

In this example DAG, tasks are instantiated using the `@task` decorator, and the DAG is instantiated using the `@dag` decorator. When using decorators, you must call the DAG and task functions in the DAG script for Airflow to register them.

## DAG parameters

In Airflow, you can configure when and how your DAG runs by setting parameters in the DAG object. DAG-level parameters affect how the entire DAG behaves, as opposed to task-level parameters which only affect a single task.

In the previous example, DAG parameters were set within the `@dag()` function call:

```python
@dag(
    'example_dag',
    schedule_interval="@daily",
    start_date=datetime(2021, 1, 1),
    catchup=False,
    default_args={
        "retries": 2
    },
    tags=['example'])
```

These parameters define:

- How the DAG is identified: `example_dag` (provided in this case as a positional argument without the `dag_id` parameter name) and `tags`
- When the DAG will run: `schedule_interval`
- What periods the DAG runs for: `start_date` and `catchup`
- How failures are handled for all tasks in the DAG: `retries`

Every DAG requires a `dag_id` and a `schedule_interval`. All other parameters are optional. The following parameters are relevant for most use cases:

- `dag_id`: The name of the DAG. This must be unique for each DAG in the Airflow environment. This parameter is required.
- `schedule_interval`: A timedelta expression defining how often a DAG runs. This parameter is required. If the DAG should only be run on demand, `None` can be provided. Alternatively the schedule interval can be provided as a CRON expression or as a macro like `@daily`.
- `start_date`: The date for which the first DAG run should occur. If a DAG is added after the `start_date`, the scheduler will attempt to backfill all missed DAG runs provided `catchup` (see below) is not set to `False`.
- `end_date`: The date beyond which no further DAG runs will be scheduled. Defaults to `None`.
- `catchup`: Whether the scheduler should backfill all missed DAG runs between the current date and the start date when the DAG is added. Defaults to `True`.
- `default_args`: A dictionary of parameters that will be applied to all tasks in the DAG. These parameters will be passed directly to each operator, so they must be parameters that are part of the [`BaseOperator`](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/baseoperator/index.html).
- `max_active_tasks`: The number of task instances allowed to run concurrently.
- `max_active_runs`: The number of active DAG runs allowed to run concurrently.
- `default_view`: The default view of the DAG in the Airflow UI (grid, graph, duration, gantt, or landing_times). 
- `tags`: A list of tags shown in the Airflow UI to help with filtering DAGs.

For a list of all DAG parameters, see the [Airflow documentation](https://airflow.apache.org/docs/apache-airflow/stable/_api/airflow/models/dag/index.html).
