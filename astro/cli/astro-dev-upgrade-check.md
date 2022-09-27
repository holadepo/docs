---
sidebar_label: "astro dev upgrade-check"
title: "astro dev upgrade-check"
id: astro-dev-upgrade-check
description: Reference documentation for astro dev upgrade-check.
---

Run the [Airflow 2 upgrade check script](https://airflow.apache.org/docs/apache-airflow/stable/upgrading-from-1-10/upgrade-check.html), which parses the DAGs in your Astro project and tells you whether the code is compatible with Airflow 2.

## Usage

Use this command only if the DAGs in your Astro project are imported from another open source or commercial Airflow project on version 1.14-1.15.

After starting your project with [`astro dev start`](cli/astro-dev-start.md), run:

```sh
astro dev upgrade-check
```

If the upgrade check was successful, the CLI does not return a response. If your DAGs are incompatible with Airflow 2.0, the CLI produces a list of compatibility issues and steps for how to fix them. 