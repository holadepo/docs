---
sidebar_label: 'Hosted cloud'
title: 'Install Astro on an Astronomer-hosted cloud'
id: hosted-dataplane
description: Get started with Astro on the Astronomer-hosted cloud.
---

This is where you'll find instructions for completing the Astro installation process on the Astronomer data plane, including the prerequisites and accessing Astro.

Creating Astro clusters on the Astronomer cloud eliminates the need for Astronomer to have privileged access to your organization's cloud. When hosting your cloud data, Astronomer adheres to industry best practices and standards including the Health Insurance Portability and Accountability Act (HIIPAA), Service Organization Control 2 (SOC2), and  General Data Protection Regulation (GDPR). 

## Prerequisites

The setup process assumes that you've already provided Astronomer support with the following information: 

- Your preferred cloud provider. The supported options are: Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).
- Your preferred cluster installation region. See the supported region lists for [AWS](resource-reference-aws.md#aws-region), [Azure](resource-reference-azure.md#supported-regions), and [GCP](resource-reference-gcp.md#gcp-region).
- Optional. Your preferred worker instance type for your first cluster. See [AWS cluster configurations](resource-reference-aws.md#worker-node-types), [Azure cluster configurations](resource-reference-azure#worker-node-pools), and [GCP cluster configurations](resource-reference-gcp.md#worker-node-pools).
- Optional. Your VPC peering requirements for [AWS](install-aws#vpc-peering-prerequisites-optional) and [GCP](install-gcp#vpc-peering-prerequisites-optional), or your VNet peering requirements for [Azure](install-azure#vnet-peering-prerequisites-optional).
- The email address for your first Astro user.

If you haven't provided this information to Astronomer support, contact your Astronomer representative. 

## Step 1: Let Astronomer complete the install

Astronomer support creates your first cluster on the Astronomer cloud after you've provided your setup information.

This process can take some time. Wait for confirmation that the installation is successful before you access Astro and create a Deployment.

## Step 2: Access Astro

Go to https://cloud.astronomer.io/ and create an account.

When you first authenticate to Astro, you can sign in to the Cloud UI with a Google account, a GitHub account, or an email and password.

![Astro login screen](/img/docs/login.png)

If you're the first person from your Organization to authenticate, Astronomer support adds you as a Workspace Admin to a new Workspace named after your Organization. From there, you'll be able to add other team members to that Workspace without the assistance of Astronomer support.

:::tip

After completing your initial installation, Astronomer recommends [setting up an identity provider (IdP)](configure-idp.md) so that users can log in to Astro through your IdP.

:::

## Step 3: Create a Deployment

When Astronomer confirms that your Astro cluster has been created, you are ready to create a Deployment and start deploying DAGs. Log in to [the Cloud UI](https://cloud.astronomer.io) again and [create a new Deployment](create-deployment.md). If the installation is successful, your new Astro cluster is listed as an option below the **Cluster** menu:

![Cloud UI New Deployment screen](/img/docs/create-new-deployment-select-cluster.png)

## Next steps

- [Set up an identity provider](configure-idp.md)
- [Install the Astro CLI](cli/overview.md)
- [Configure Deployments](configure-deployment-resources.md)
- [Deploy code](deploy-code.md)
- [Add users](add-user.md)
