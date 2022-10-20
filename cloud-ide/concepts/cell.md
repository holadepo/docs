---
sidebar_label: Cell
title: Cell
id: cell
---

import Image from '@site/src/components/Image';

A **cell** is a single part of a pipeline. Cells are typically executable and contain configuration on what to execute (e.g. Python/SQL code). The Cloud IDE currently supports Python, SQL, and Markdown cells.

## Examples

<Image
src="/img/cloud-ide/cells/python-hello-world.png"
alt="Hello World Python Cell"
caption="Python hello world"
style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
/>

<Image
src="/img/cloud-ide/cells/python-arima-model.png"
alt="Python Cell with ARIMA Model"
caption="Python ARIMA model"
style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
/>

<Image
src="/img/cloud-ide/cells/sql-hello-world.png"
alt="SQL Hello World"
caption="SQL hello world"
style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
/>

<Image
src="/img/cloud-ide/cells/sql-select.png"
alt="SQL Select Statement"
caption="SQL select statement"
style={{
    border: "1px solid #ddd",
    borderRadius: "8px",
  }}
/>

## Add a new cell to your pipeline

From the pipeline editor, click on the **+ Cell** button in the top left corner of the pipeline. You'll be prompted to select a cell type. Select the type of cell you want to create, and your cell will be added to the pipeline. It should then appear in the pipeline editor for you to edit.

![Add Cell](/img/cloud-ide/add-cell.png)

## Edit a cell

To edit a cell, find the cell in your pipeline editor. You can click the name of the cell to edit the name. You can also edit any of the fields within the cell (e.g. SQL connection, Python code). **Note that edits are saved in real time**.

## Delete a cell

To delete a cell, click on the **Delete** button (trash icon) in the top right corner of the cell. You'll be prompted to confirm your action.

![Delete Cell](/img/cloud-ide/delete-cell.png)
