---
title: "Upgrade to Airflow 2"
sidebar_label: "Upgrade to Airflow 2"
id: upgrade-to-airflow-2
description: "Upgrade an open source Airflow project from 1.10.15 to 2.3 and migrate it to Astro."
---

Airflow 2.3 provides numerous advantages over Airflow 1.10.15 including dynamic task mapping and a grid view in the Airflow UI. Use the information provided here to upgrade an open source Airflow project from 1.10.15 to 2.3 and then migrate it to Astro.

## The benefits of Airflow 2.0+

Airflow 2.0+ provides the following benefits over previous versions:

- [Refactored Airflow Scheduler](https://airflow.apache.org/docs/apache-airflow/stable/scheduler.html#running-more-than-one-scheduler) for enhanced performance and high-availability.
- [Full REST API](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html) that enables more opportunities for automation.
- [Smart Sensors](https://airflow.apache.org/docs/apache-airflow/stable/smart-sensor.html) that execute as single, long-running tasks.
- [TaskFlow API](https://airflow.apache.org/docs/apache-airflow/stable/concepts.html#taskflow-api) for a simpler way to pass information between tasks.
- [Independent Providers](https://github.com/apache/airflow/tree/master/airflow/providers) for improved usability and a more agile release cadence.
- Simplified KubernetesExecutor for ultimate flexibility in configuration.
- [UI/UX Improvements](https://github.com/apache/airflow/pull/11195) including a new Airflow UI and auto-refresh button in the **Graph** view.

Airflow 2.3 introduced several new features, including [dynamic task mapping](https://airflow.apache.org/docs/apache-airflow/2.3.0/concepts/dynamic-task-mapping.html). For more information about Airflow 2.3, see ["Apache Airflow 2.3.0 is here"](https://airflow.apache.org/blog/airflow-2.3.0/) and the [Airflow 2.3.0 changelog](https://airflow.apache.org/docs/apache-airflow/2.3.0/release_notes.html#airflow-2-3-0-2022-04-30).

## Prerequisites

- The latest version of the [Astro CLI](configure-cli.md).
- An Airflow project running Airflow 1.10.15.

## Step 1: Migrate your Airflow code to an Astro project

An Astro project structure is required to deploy code to Astro.

1. [Create an Astro project](create-project.md) using the Astro CLI.
2. Delete the example DAGs included in the project.
3. Move the DAGs from your open source project to the `dags` folder in your Astro project.
4. In the Astro project `Dockerfile`, replace the `FROM` line with:

    ```dockerfile
    FROM quay.io/astronomer/ap-airflow:1.10.15-buster-onbuild
    ```

    This Astronomer-distributed version of Airflow 1.10.15 serves as a bridge release between your open source Airflow project and Airflow 2.3.

5. Move OS-level dependencies from your open source project to the `packages.txt` file in your Astro project.
6. Move OS-level dependencies from your open source project to the `requirements.txt` file in your Astro project.
7. Open your Astro project and run `astro dev start` to your code in a local Airflow environment.

## Step 2: Run the Airflow upgrade check script

Not all Airflow 1.10.15 DAGs work in Airflow 2.0,. The Airflow 2.0 upgrade check script can check for compatibility issues in your DAG code.

To run the Airflow 2.0 upgrade check script and install the latest version of the `apache-airflow-upgrade-check` package at runtime, open your Astro project and run the following command:

```shell
astro dev upgrade-check
```

This command outputs the results of tests which check the compatibility of your DAGs with Airflow 2.0.

In the upgrade check output, you can ignore the following entries:

- `Fernet is enabled by default`
- `Check versions of PostgreSQL, MySQL, and SQLite to ease upgrade to Airflow 2.0`
- `Users must set a kubernetes.pod_template_file value`

For more information about upgrade check functionality, see [Upgrade Check Script](https://airflow.apache.org/docs/apache-airflow/2.1.3/upgrade-check.html) in Apache Airflow documentation.

## Step 3: Prepare Airflow 2.0 DAGs

Review the results from the Airflow upgrade check script and then update your import statements, DAGs, and configurations if necessary.

### a. Import operators from backport providers

All Airflow 2 providers supported a backported package version for Airflow 1.10.15. You can use backported provider packages to test your DAGs with Airflow 2's functionality in a 1.10.15 environment.

1. Add all necessary backported providers to the `requirements.txt` file of the Astro project.
2. Modify the import statements of your DAGs to reference the backported provider packages.
3. Run your DAGs to test their compatibility with Airflow 2 providers.

For more information, see [1.10.15 Backport Providers](https://airflow.apache.org/docs/apache-airflow/1.10.15/backport-providers.html) in Apache Airflow documentation, or see the collection of [Backport Providers in PyPi](https://pypi.org/search/?q=apache-airflow-backport-providers&o=).

### b. Modify Airflow DAGs

Depending on your DAGs, you might need to make the following changes to make sure your code is compatible with Airflow 2.0:

- Changes to undefined variable handling in templates.
- Changes to the KubernetesPodOperator.
- Changing the default value for `dag_run_conf_overrides_params`.

For other compatibility considerations, see [Step 5: Upgrade Airflow DAGs](http://apache-airflow-docs.s3-website.eu-central-1.amazonaws.com/docs/apache-airflow/latest/upgrading-to-2.html#step-5-upgrade-airflow-dags) in Apache Airflow documentation.

## Step 4: Upgrade to Airflow 2.3

If the upgrade check script didn't identify any issues with your existing DAGs and configurations, you're ready to upgrade to Airflow 2.3.0.

To upgrade to Airflow 2.3.0:

1. Replace the `FROM` line in your Astro project's `Dockerfile` with the following:

    ```dockerfile
    FROM quay.io/astronomer/astro-runtime:5.0.4
    ```

2. Modify all backport providers and replace them with the supported [provider packages](https://airflow.apache.org/docs/apache-airflow-providers/index.html). For example, if you were using the [Mongo backport provider](https://pypi.org/project/apache-airflow-backport-providers-mongo/), replace `apache-airflow-backport-providers-mongo` with `apache-airflow-providers-mongo` in your `requirements.txt` file. For more information, see [Airflow documentation on provider packages](https://airflow.apache.org/docs/apache-airflow-providers/index.html).
3. Restart your local environment and open the Airflow UI to confirm that your upgrade was successful.

### Upgrade considerations

Airflow 2.3 includes changes to the schema of the Airflow metadata database. When you first upgrade to Runtime 2.3, consider the following:

- Upgrading to Airflow 2.3 can take 10 to 30 minutes or more depending on the number of task instances that have been recorded in the metadata database throughout the lifetime of your Deployment. During the upgrade, scheduled tasks will continue to execute but new tasks will not be scheduled.
- Once you upgrade successfully to Airflow 2.3, you might see errors in the Airflow UI that warn you of incompatible data in certain tables of the database. For example:

    ```
    Airflow found incompatible data in the `dangling_rendered_task_instance_fields` table in your metadata database, and moved...
    ```

    These warnings have no impact on your tasks or DAGs and can be ignored. If you want to remove these warning messages from the Airflow UI, contact [Astronomer Support](https://support.astronomer.io). If necessary, Astronomer can remove incompatible tables from your metadata database.
