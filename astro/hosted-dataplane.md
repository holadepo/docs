---
sidebar_label: 'Hosted dataplane'
title: 'Install Astro on an Astronomer-hosted cloud'
id: hosted-dataplane
description: Get started with Astro on Astronomer's own cloud.
---

This is where you'll find instructions for completing the Astro installation process on the Astronomer data plane, including prerequisites and the steps required to allow Astronomer support to provision resources in your network.

Creating Astro clusters on Astronomer's cloud eliminates the need for Astronomer to have privileged access to your own cloud. All data hosted in Astronomer's guide is treated in accordance with Astronomer's HIIPAA, SOC2, and GDPR certifications. 

## Prerequisites

This setup assumes that you've already provided Astronomer with: 

- A preferred cloud provider of either Amazon Web Services (AWS) or Google Cloud Platform (GCP)
- A preferred region to install your first cluster in. See region lists for [AWS](https://aws.amazon.com/about-aws/global-infrastructure/regions_az/) and [GCP](https://cloud.google.com/compute/docs/regions-zones).
- Optional. A preferred worker instance type for your first cluster. See [AWS cluster configurations](resource-reference-aws.md#worker-node-types) and [GCP cluster configurations](resource-reference-gcp.md#worker-node-pools).
- An email address for your first Astro user.

If you haven't yet provided this information to Astronomer, contact your Astronomer representative. 

## Step 1: Let Astronomer complete the install

Once you've provided Astronomer with the information for your setup, Astronomer finishes creating your first cluster on Astronomer's cloud.

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
