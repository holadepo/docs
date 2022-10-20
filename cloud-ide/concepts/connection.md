---
sidebar_label: Connection
title: Connection
id: connection
---

import Image from '@site/src/components/Image';

A **connection** is a set of credentials that can be used to connect to a data source. Connections are created and managed at the project level. Connections map to Airflow [connections](https://airflow.apache.org/docs/apache-airflow/stable/howto/connection/index.html) and are used to configure SQL cells in the Cloud IDE. The Cloud IDE currently supports the following connections:

- Snowflake
- Postgres
- Google BigQuery
- Amazon Redshift
- Amazon S3

## Create a connection

You can create connections in two places: the **Connections** tab in a project and the **Connection** tab in the pipeline editor sidebar.

To create a connection, click on the **+ Connection** button in the top right corner of the **Connections** page.

### Select connection type

You'll first be prompted to select a connection type. Select the type of connection you want to create, and you'll be taken to the next step of the connection creation process.

![Select Connection Type](/img/cloud-ide/select-connection-type.png)

### Enter connection details

After you select your connection type, you must configure it. You'll be prompted to enter a name and an optional description for your connection. You'll also be prompted to enter connection-specific information.

![Configure Connection](/img/cloud-ide/configure-connection.png)

### Test connection (optional)

After you enter your connection details, you can test the connection. Click on the **Test Connection** button to test the connection. If the connection fails, you'll see a message indicating that the connection failed. If the connection succeeds, you'll see a message indicating that the connection succeeded. Note that not all connection types support testing. You can create connections without testing them.

![Unsuccessful Connection Test](/img/cloud-ide/test-connection-fail.png)
![Successful connection](/img/cloud-ide/test-connection-success.png)

## Using a connection

Connections can be used in SQL cells. You can use a connection in a SQL cell by selecting it from the **Connection** dropdown in the top right of the cell. You can also create new SQL cells with a given connection using the **Connection** tab in the pipeline editor sidebar.

![Connection Quick Add](/img/cloud-ide/connection-quick-add.png)

<Image
src="/img/cloud-ide/cells/sql-select-connection.png"
alt="Select connection"
caption="Connection dropdown in a SQL cell"
style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
/>

## Edit or delete a connection

You can edit a connection by clicking on the **Edit** button in the connection list or the **pencil icon** in the pipeline editor sidebar. You'll be able to edit all fields except for the connection name and type. Note that the connection password is not retrievable after it is created. To update your connection, you must re-enter the password.

![Edit Connection](/img/cloud-ide/edit-connection.png)

You can also delete a connection by clicking on the **Delete** button in the connection list or the **trash icon** in the pipeline editor sidebar.

![Delete Connection](/img/cloud-ide/delete-connection.png)
