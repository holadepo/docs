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
brew install astronomer/cloud/astro
```

To install a specific version of the Astro CLI, specify the version you want to install at the end of the command:

```sh
brew install astronomer/cloud/astro@0.XX
```

</TabItem>

<TabItem value="windows">

1. In a PowerShell terminal, create a new directory for your Astro project and set it as your current directory:

    ```powershell
    mkdir my-project && cd my-project
    ```

2. Based on your CPU, run one of the following commands to download the Astro CLI executable into your project directory.

    - AMD64:

        <pre><code parentName="pre">{`Invoke-WebRequest -Uri https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Windows_x86_64.tar.gz -o astrocli.tar.gz`}</code></pre>

    - ARM64:

        <pre><code parentName="pre">{`Invoke-WebRequest -Uri https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Windows_arm64.tar.gz -OutFile astrocli.tar.gz`}</code></pre>

    To install a different version of the CLI, change the version number in the command to your desired CLI version.

3. Run the following command to unzip the executable:

    ```sh
    tar -xvzf .\astrocli.tar.gz
    ```

4. To run the executable without specifying its file path, save `astro.exe` in a secure location on your machine and add its filepath in the Windows PATH environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

</TabItem>

<TabItem value="linux">

1. In a Linux terminal, create a new directory for your Astro project and set it as your current directory:

    ```sh
    mkdir my-project && cd my-project
    ```

2. Based on your CPU, run one of the following commands to download the Astro CLI executable into your project directory.

    - AMD64:

        <pre><code parentName="pre">{`curl https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Linux_x86_64.tar.gz -o astrocli.tar.gz`}</code></pre>

    - ARM64:

        <pre><code parentName="pre">{`curl https://goreleaserdev.blob.core.windows.net/goreleaser-test-container/releases/v${siteVariables.cliVersion}/cloud-cli_${siteVariables.cliVersion}_Linux_arm64.tar.gz -o astrocli.tar.gz`}</code></pre>

    To install a different version of the CLI, change the version number in the command to your desired CLI version.

3. Run the following command to unzip the executable:

    ```sh
    tar xzf astrocli.tar.gz
    ```

4. To run the executable without specifying its file path, save `astro` in a secure location on your machine and add its filepath in the Linux `$PATH` environment variable. For more information about configuring the PATH environment variable, read [Java documentation](https://www.java.com/en/download/help/path.html).

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
brew install astronomer/cloud/astro
```

</TabItem>

<TabItem value="windows">

[Upgrade steps for Windows]

</TabItem>

<TabItem value="linux">

[Upgrade steps for Linux]

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
brew uninstall astronomer/cloud/astro
```

</TabItem>

<TabItem value="windows">

[Upgrade steps for Windows]

</TabItem>

<TabItem value="linux">

[Upgrade steps for Linux]

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

To uninstall the old Astro CLI, run the following command:

```sh
brew uninstall astronomer/cloud/astrocloud
```

</TabItem>

<TabItem value="windows">

[Uninstall steps for Windows]

</TabItem>

<TabItem value="linux">

[Uninstall steps for Linux]

</TabItem>

</Tabs>

## Step 2: Install Astro CLI v1.0+

For more details, see [Install the CLI](configure-cli.md#install-the-cli.md).

## Step 3: Migrate Project Configurations (_Optional_)

For each Astro project where you manually updated the `.astrocloud/config.yaml` file:

1. In your terminal, open your Astro project.
2. Run `astro dev init` to generate a new `.astro` directory in your project. This subdirectory might be hidden in graphical file browsers. You can show hidden files using `⌘ + Shift + .` on Mac or by selecting **View > Hidden items** in Windows file explorer.
3. Copy the contents from `.astrocloud/config.yaml` into `.astro/config.yaml`.
4. Delete `.astrocloud/config.yaml`.
