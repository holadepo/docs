---
sidebar_label: 'Integrate with Datadog'
title: 'Integrate Datadog with Astronomer Software'
id: integrate-datadog
description: Integrate your Datadog instance with Astronomer Software.
---
Integrate your Datadog instance with Astronomer Software to view Airflow metrics in Datadog. These metrics can include running DAG processes, task data, pool data, and executor data. To view a complete list of the Airflow metrics collected by the Datadog Agent, see [Data Collected](https://docs.datadoghq.com/integrations/airflow/?tabs=host#data-collected). 

1. Install the Datadog Agent on your Kubernetes cluster. See [Install the Datadog Agent on Kubernetes](https://docs.datadoghq.com/containers/kubernetes/installation/?tabs=operator).
2. Open the `values.yaml` file and add this entry:
    ```yaml
    datadog:  
      confd:
        openmetrics.yaml: |-
          instances:
            # The airflow statsd endpoint to query from
            - prometheus_url: http://<airflow-release-name>-statsd.<airflow-release-namespace>.svc:9102/metrics
              namespace: "<airflow-release-namespace>"
              metrics:
                - "*"
   ```
3. Optional. Add additional entries for your other Airflow instances. For example:
    ```yaml
    datadog:  
      confd:
    openmetrics.yaml: |-
      instances:
        # The airflow statsd endpoint to query from
        - prometheus_url: http://<airflow-release-name>-statsd.<airflow-release-namespace>.svc:9102/metrics
          namespace: "<airflow-release-namespace>"
          metrics:
            - "*"
        - prometheus_url: http://<airflow-release-name>-statsd.<airflow-release-namespace>.svc:9102/metrics
          namespace: "<airflow-release-namespace>"
          metrics:  
            - "*"
    ```
4. Save your changes to the `values.yaml` file and then run the following command to update your Datadog configuration:

    ```shell
    helm upgrade datadog -f datadog-values.yaml --set datadog.site='datadoghq.com' --set datadog.apiKey=<my-api-key> datadog/datadog -n datadog
    ```
5. Optional. Run the following command to confirm your confuguration changes were implemented:

    ```bash
    kubectl exec -it dd-test-datadog-f4vhx -n astronomer -- bash -c 'agent status' Defaulting container name to agent.
    ```
6. Open your Datadog **Metrics Summary** dashboard and confirm that Airflow metrics are displayed.