---
sidebar_label: 'Configure the CLI'
title: 'Configure the Astro CLI'
id: configure-cli
description: Install, upgrade, and manage settings for the Astro CLI.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {siteVariables} from '@site/src/versions';

## Install the CLI

<Tabs
    defaultValue="mac"
    values={[
        {label: 'Mac', value: 'mac'},
        {label: 'Windows', value: 'windows'},
        {label: 'Linux', value: 'linux'},
    ]}>
<TabItem value="mac">

To install the latest version of the Astro CLI, run the following command:

```sh
brew install astronomer/tap/astro
```

To install a specific version of the Astro CLI, specify the version you want to install at the end of the command:

```sh
brew install astronomer/tap/astro@0.XX
```

</TabItem>

<TabItem value="windows">

1. Go to the [**Releases** page of the Astro CLI GitHub](https://github.com/astro-projects/astro-cli/releases). Based on your desired CLI version and CPU architecture, download one of the `.zip` files available on this page.

    For example, if you wanted to install v1.0.0 of the Astro CLI on a Windows Machine with an AMD 64 architecture, you would download `astro_1.0.0-converged_windows_amd64.zip`.

2. Run the following command to unzip the executable:

    ```sh
    tar -xvzf .\astrocli.tar.gz
    ```

3. Save `astro.exe` in a secure location on your machine and add its filepath in the Windows PATH environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

</TabItem>

<TabItem value="linux">

Run the following command to install the latest version of the Astro CLI directly to `PATH`:

```sh
curl -sSL install.astronomer.io | sudo bash -s
```

To install a specific version of the CLI, specify the version number as a flag at the end of this command. For example, to install v1.0.0 of the CLI, you would run:

```sh
curl -sSL install.astronomer.io | sudo bash -s -- v1.0.0
```

</TabItem>

</Tabs>


## Upgrade the CLI

<Tabs
    defaultValue="mac"
    values={[
        {label: 'Mac', value: 'mac'},
        {label: 'Windows', value: 'windows'},
        {label: 'Linux', value: 'linux'},
    ]}>
<TabItem value="mac">

To upgrade the Astro CLI, you can run the same command as you did to install the CLI for the first time:

```sh
brew install astronomer/tap/astro
```

</TabItem>

<TabItem value="windows">

1. Remove the existing `astro.exe` file on your machine.

2. Go to the [**Releases** page of the Astro CLI GitHub](https://github.com/astro-projects/astro-cli/releases). Based on your desired CLI version and CPU architecture, download one of the `.zip` files available on this page.

    For example, if you wanted to install v1.0.0 of the Astro CLI on a Windows Machine with an AMD 64 architecture, you would download `astro_1.0.0-converged_windows_amd64.zip`.

3. Run the following command to unzip the executable:

    ```sh
    tar -xvzf .\astrocli.tar.gz
    ```

4. Save the new `astro.exe` file that you just unzipped in a secure location on your machine and add its filepath in the Windows PATH environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

</TabItem>

<TabItem value="linux">

To upgrade to the latest version of the Astro CLI, run:

```sh
curl -sSL install.astronomer.io | sudo bash -s
```

</TabItem>

</Tabs>

## Uninstall the CLI

<Tabs
    defaultValue="mac"
    values={[
        {label: 'Mac', value: 'mac'},
        {label: 'Windows', value: 'windows'},
        {label: 'Linux', value: 'linux'},
    ]}>
<TabItem value="mac">

To uninstall the Astro CLI, run the following command:

```sh
brew uninstall astronomer/tap/astro
```

</TabItem>

<TabItem value="windows">

To uninstall the Astro CLI:

1. Remove the filepath for `astro.exe` from your Windows PATH environment variable.
1. Delete `astro.exe`.

</TabItem>

<TabItem value="linux">

To uninstall the Astro CLI, run the following command:

```sh
sudo rm /usr/local/bin/astro
```

</TabItem>

</Tabs>

## Migrate from `astrocloud` to `astro`

Complete this migration if all of the following are true:

- You are an Astro user.
- You used a pre-1.0 version of the Astro CLI. For these versions, the CLI executable was `astrocloud`.

### Step 1: Uninstall the `astrocloud` Executable

<Tabs
    defaultValue="mac"
    values={[
        {label: 'Mac', value: 'mac'},
        {label: 'Windows', value: 'windows'},
        {label: 'Linux', value: 'linux'},
    ]}>
<TabItem value="mac">

To uninstall the `astrocloud` executable, run the following command:

```sh
brew uninstall astronomer/cloud/astrocloud
```

</TabItem>

<TabItem value="windows">

1. Remove the filepath for `astrocloud.exe` from your Windows PATH environment variable.
2. Delete `astrocloud.exe`.

</TabItem>

<TabItem value="linux">

To uninstall `astrocloud`:

1. Remove the filepath for `astrocloud.exe` from your Linux PATH environment variable.
2. Delete `astrocloud.exe`.

</TabItem>

</Tabs>

### Step 2: Install Astro CLI v1.0+

For more details, see [Install the CLI](configure-cli.md#install-the-cli.md).

### Step 3: Migrate Project Configurations (_Optional_)

For each Astro project where you manually updated the `.astrocloud/config.yaml` file:

1. In your terminal, open your Astro project.
2. Run `astro dev init` to generate a new `.astro` directory in your project. This subdirectory might be hidden in graphical file browsers. You can show hidden files using `⌘ + Shift + .` on Mac or by selecting **View > Hidden items** in Windows file explorer.

    If the CLI prompts you about whether you want to create a project in a non-empty directory, enter `Yes`. The CLI will only create files that aren't yet in your directory. In this case, the only file that it will create is `.astro/config.yaml`.

3. Copy the contents from `.astrocloud/config.yaml` into `.astro/config.yaml`.
4. Delete `.astrocloud/config.yaml`.
