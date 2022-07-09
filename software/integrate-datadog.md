---
sidebar_label: 'Integrate with Datadog'
title: 'Integrate an Astronomer Software Deployment with Datadog'
id: integrate-datadog
description: Integrate an Astronomer Software Deployment with Datadog.
---
Integrate an Astronomer Software Deployment with your Datadog account to view Airflow metrics in Datadog. These metrics can include running DAG processes, task data, pool data, and executor data. To view a complete list of the Airflow metrics collected by the Datadog Agent, see [Data Collected](https://docs.datadoghq.com/integrations/airflow/?tabs=host#data-collected). 

1. Install the Datadog Agent on your Kubernetes cluster. See [Install the Datadog Agent on Kubernetes](https://docs.datadoghq.com/containers/kubernetes/installation/?tabs=operator).
2. Open the [Datadog `values.yaml` configuration file](https://github.com/DataDog/helm-charts/blob/main/charts/datadog/values.yaml) and add a new configuration under `datadog.confd.openmetrics.instances` for each Deployment you want to integrate with Datadog:
    ```yaml
    datadog:  
      confd:
        openmetrics.yaml: |-
          instances:
            # The airflow statsd endpoint to query from
            - prometheus_url: http://<deployment-release-name>-statsd.<platform-namespace>.svc:9102/metrics
              namespace: "<platform-namespace>"
              metrics:
                - "*"
    ```
    You can find the Deployment release name in Astronomer Software by selecting a Deployment and then copying the value displayed in the **Release Name** field.   

3. Optional. Add additional entries for your other Airflow instances. For example:
    ```yaml
    datadog:  
      confd:
    openmetrics.yaml: |-
      instances:
        # The airflow statsd endpoint to query from
        - prometheus_url: http://<first-deployment-release-name>-statsd.<platform-namespace>.svc:9102/metrics
          namespace: "<platform-namespace>"
          metrics:
            - "*"
        - prometheus_url: http://<second-deployment-release-name>-statsd.<platform-namespace>.svc:9102/metrics
          namespace: "<platform-namespace>"
          metrics:  
            - "*"
    ```
4. Save your changes to the `values.yaml` file and then run the following command to update your Datadog configuration:

    ```shell
    helm upgrade datadog -f datadog-values.yaml --set datadog.site='datadoghq.com' --set datadog.apiKey=<my-api-key> datadog/datadog -n datadog
    ```

    :::tip

    The changes can be validated with the following optional commands:

    Run the following command to identify the Datadog Agent pod:

    ```bash
    kubectl get pods -n datadog
    ```

    Confirm your configuration changes were implemented with the following command:

    ```bash
    kubectl exec -it <datadog pod name> -n astronomer -- bash -c 'agent status'
    ```

    :::

5. Open your Datadog **Metrics Summary** dashboard and confirm that Airflow metrics are displayed.
