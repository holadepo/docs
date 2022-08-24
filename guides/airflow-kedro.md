---
title: "Deploy Kedro Pipelines to Apache Airflow"
sidebar_label: "Deploy Kedro Pipelines to Apache Airflow"
description: "Use the kedro-airflow plugin to change your Kedro pipelines into Apache Airflow DAGs and deploy them to a production environment."
id: airflow-kedro
tags: ["Plugins", "Integrations"]
---

[Kedro](https://github.com/quantumblacklabs/kedro) is an open-source Python framework for creating reproducible, maintainable, and modular data science code. It borrows concepts from software engineering and applies them to machine learning code.

While Kedro is an excellent option for data engineers and data scientists looking to author their data pipelines and projects with software engineering practices, it can extend even further to integrate with [Apache Airflow](https://airflow.apache.org) for distributed scheduling and execution of the resultant pipelines.

## The plugin

In close partnership with the team at Kedro, Astronomer recently extended the [`kedro-airflow`](https://github.com/quantumblacklabs/kedro-airflow) plugin to accommodate a significantly improved developer experience. With this plugin, you can translate your Kedro pipeline into a clean, legible, and well-structured Apache Airflow DAG with one simple command:

```bash
kedro airflow create
```

This makes for a clean experience for anyone looking to deploy their Kedro pipelines to a distributed scheduler for workflow orchestration.

### Prerequisites

To use the plugin, you'll need the following running on your machine or a fresh virtual environment:

- [The Astro CLI](https://docs.astronomer.io/astro/install-cli)
- [Kedro](https://github.com/quantumblacklabs/kedro)
- [The `kedro-airflow` Plugin](https://github.com/quantumblacklabs/kedro-airflow)
- [Docker](https://docs.docker.com/docker-for-mac/install/)

## Try it out

Astronomer added some functionality to the plugin that makes for a great integration with Astro. To give it a try, you'll use the `astro-airflow-iris` starter that's included in the Kedro project. You'll spin up a fresh Kedro project and run your pipelines as DAGs in a local Airflow environment.

### Create an Astro-Kedro project

1. Run `kedro new --starter astro-airflow-iris` to build your starter directory.
2. Run `cd <kedro-project-directory>`.
3. Run `kedro install`.
4. Run `kedro package`.
   
### Prepare and run the project in Astro

1. Run `cp src/dist/*.whl ./`.
2. Run `kedro catalog create --pipeline=__default__`.
3. Edit your `conf/base/catalog/__default__.yml` and configure datasets to be persisted. For example:

    ```yaml
    example_train_x:
        type: pickle.PickleDataSet
        filepath: data/05_model_input/example_train_x.pkl
    example_train_y:
        type: pickle.PickleDataSet
        filepath: data/05_model_input/example_train_y.pkl
    example_test_x:
        type: pickle.PickleDataSet
        filepath: data/05_model_input/example_test_x.pkl
    example_test_y:
        type: pickle.PickleDataSet
        filepath: data/05_model_input/example_test_y.pkl
    example_model:
        type: pickle.PickleDataSet
        filepath: data/06_models/example_model.pkl
    example_predictions:
        type: pickle.PickleDataSet
        filepath: data/07_model_output/example_predictions.pkl`
    ```

4. Make sure you have the `kedro-airflow` plugin installed, then run `pip install kedro-airflow`.
5. Run `kedro airflow create -t dags/`.
6. Make sure you have the Astro CLI installed and have Docker running on your machine, then run `astro dev start` to fire up a local Airflow instance and visualize your DAGs.

Astronomer is proud to partner with Kedro to bring this plugin experience into the world and look forward to extending it to improve the developer experience even more. [Get in touch](https://astronomer.io/contact) if you'd like to talk to us about how you use Kedro and Airflow together!
