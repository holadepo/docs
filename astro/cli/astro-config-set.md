---
sidebar_label: "astro config set"
title: "astro config set"
id: astro-config-set
description: Reference documentation for astro config set.
---

Update any part of the current configuration of your Astro project as defined in the `.astro/config.yaml` file. The configuration in this file contains details about how your project runs in a local Airflow environment, including your Postgres username and password, your Webserver port, and your project name.

## Usage

Within your Astro project directory, run:

```sh
astro config set <option> <value>
```

## Options

| Option              | Description | Possible Values |
| ------------------- | ----------- | --------------- |
| `cloud.api.protocol`  | The type of protocol to use when calling the Airflow API in a local Airflow environment         | `http`, `https`             |
| `cloud.api.port`      | The port to use when calling the Airflow API in a local environment           | Any available port             |
| `cloud.api.ws_protocol`      | The WebSocket protocol to use when calling the Airflow API in a local environment           | `wss`             |
| `cloud.api.token`      | The API token to use when calling the Airflow API in a local environment           | Any available token             |
| `context`           | The context for your Astro project          | Any available [context](cli/astro-context-list.md)             |
| `contexts`           | The contexts for your Astro project          | Any available [context](cli/astro-context-list.md)             |
| `local.astrohub`           | The location of your local Astro container running Airflow          | `http://localhost:8871/v1`             |
| `local.public_astrohub`           | The location of your local, public Astro container running Airflow          | `http://localhost:8871/graphql`             |
| `local.registry`     | The location of your local Docker container running Airflow             | Any available port             |
| `local.houston`     | The location of your local Houston container running Airflow             | Any available port             |
| `local.platform`     | The location of your local platform container running Airflow             | Any available port             |
| `postgres.user`      | Your username for the Postgres metadata database            | Any string             |
| `postgres.password`  | Your password for the Postgres metadata database            | Any string             |
| `postgres.host`      | Your hostname for the Postgres metadata database            | Any string             |
| `postgres.port`      | Your port for the Postgres metadata database            | Any available port             |
| `project.deployment`      | The name of your Astro project            | Any string             |
| `project.name`       | The name of your Astro project         | Any string             |
| `project.workspace`       | The name of your Astro workspace         | Any string             |
| `webserver.port`     | The port for the webserver in your local Airflow environment          | Any available port             |
| `show_warnings`      | Determines whether warning messages appear when starting up a local Airflow environment         | `true`, `false`             |
| `verbosity`      | Determines the verbosity of the warning messages that appear when starting up a local Airflow environment         | `warning`             |
| `houston.dial_timeout`      | Determines the length of time to wait for a response from the local Houston container before timing out         | Any string             |
| `houston.skip_verify_tls`      |Returns a confirmation that the Houston TLS communication layer is working         | `true`, `false`             |
| `skip_parse`      | Determines whether parsing is skipped         | `true`, `false`             |
| `interactive`      | Enables interactive mode         | `true`, `false`             |
| `page_size`      | Determines the page size         | Any string             |

:::info

Some possible configurations are not documented here because they are used only on Astronomer Software.

:::

## Examples

```sh
## Set your webserver port to 8081
$ astro config set webserver.port 8081
```

## Related Commands

- [astro config get](cli/astro-config-get.md)
