---
sidebar_label: "astro dev upgrade-check"
title: "astro dev upgrade-check"
id: astro-dev-upgrade-check
description: Reference documentation for astro dev upgrade-check.
---

Run the [Airflow 2 upgrade check script](https://airflow.apache.org/docs/apache-airflow/stable/upgrading-from-1-10/upgrade-check.html), which parses the DAGs in your Astro project and tells you whether the code is compatible with Airflow 2.

## Usage

Use this command only if the DAGs in your Astro project were imported from another Airflow project on version 1.14-1.15. The command is compatible with all supported versions of [Astro Runtime](runtime-image-architecture.md).

```sh
astro dev upgrade-check
```