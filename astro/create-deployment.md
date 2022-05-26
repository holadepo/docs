---
sidebar_label: 'Create a Deployment'
title: 'Create a Deployment'
id: create-deployment
description: Learn how to create an Astro Deployment.
---

## Overview

A Deployment on Astro is an instance of Astro Runtime that is powered by the core components of Apache Airflow including a metadata database, a Webserver, one or more Schedulers, and one or more Workers. Every Deployment is hosted on a single Astro Cluster, has an isolated set of resources, and operates with a dedicated Postgres metadata database.

## Step 1: Select a Workspace

Within a Workspace, you can create Deployments and push DAGs to any Deployment from the Astro CLI or from a continuous integration and continuous delivery (CI/CD) process. You can also invite other users to the Workspace and create Deployments.

Log in to the [Cloud UI](https://cloud.astronomer.io). Your assigned Workspaces are listed below **Your Workspaces**.

## Step 2: Create a Deployment

If you prefer, you can run the `astrocloud deployment create` command in the Astro CLI to create a Deployment. See [CLI Command Reference](cli-reference/astrocloud-deployment-create.md).

1. Log in to the [Cloud UI](https://cloud.astronomer.io) and select a Workspace.
2. Click **Deployment**.
3. Complete the following fields:
    - **Name**: Enter a name for your Deployment.
    - **Astro Runtime**: Select the Astro Runtime version. The latest version of Astro Runtime is selected by default.
    - **Description**: Optional. Enter a description for your Deployment. 
    - **Cluster**: Select the Astro Cluster in which you want to create this Deployment.
4. Optional. Edit the Deployment resource settings. See [Configure Deployment Resources](configure-deployment-resources.md). 
5. Click **Create Deployment** and within a short period the following screen appears:

    ![Cloud UI Deployment Configuration](/img/docs/deployment-configuration.png)

    The initial status of all new Deployments is `UNHEALTHY`. This indicates that the Deployment's Webserver and Scheduler are still spinning up in your cloud. In a few minutes the status changes to `HEALTHY` and you can move to step 5.

## Step 3: Access the Airflow UI

1. Log in to the [Cloud UI](https://cloud.astronomer.io) and select a Workspace.
2. Select a Deployment.
3. Click **Open Airflow** to access the Airflow UI.

## Next Steps

[Configure Deployment Resources](configure-deployment-resources.md).

[Set Environment Variables on Astro](environment-variables.md).

[Manage Deployment API Keys](api-keys.md).
