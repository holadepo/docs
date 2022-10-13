---
sidebar_label: 'Hosted dataplane'
title: 'Install Astro on the Astronomer dataplane'
id: hosted-dataplane
description: Install Astro clusters on the Astronomer dataplane.
---

This is where you'll find instructions for completing the Astro installation process on the Astronomer dataplane, including prerequisites and the steps required to allow Astronomer support to provision resources in your network.

## Prerequisites


## Step 1: Let Astronomer complete the install

Once you've provided Astronomer with the information for your setup, Astronomer finishes creating your first cluster on the Astronomer dataplane.

This process can take some time. Wait for confirmation that the installation is successful before creating a Deployment.

## Step 2: Create a Deployment

When Astronomer confirms that your Astro cluster has been created, you are ready to create a Deployment and start deploying DAGs. Log in to [the Cloud UI](https://cloud.astronomer.io) again and [create a new Deployment](create-deployment.md). If the installation is successful, your new Astro cluster is listed as an option below the **Cluster** menu:

![Cloud UI New Deployment screen](/img/docs/create-new-deployment-select-cluster.png)

## Next steps

- [Set up an identity provider](configure-idp.md)
- [Install the Astro CLI](cli/overview.md)
- [Configure Deployments](configure-deployment-resources.md)
- [Deploy code](deploy-code.md)
- [Add users](add-user.md)
