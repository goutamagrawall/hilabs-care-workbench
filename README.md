# HiLabs Care Workbench — GitHub Pages edition

Interactive demo with six fictional patients. Open the GitHub Pages URL over HTTPS. No account, API key, server, or real clinical connection is required.

This edition reuses the current workbench's interface and workflow rules. Demo state is saved in the visitor's browser local storage. Tabs on the same site share that state; other browsers and devices start independently. Reset demo restores the fictional baseline. Clearing site data removes saved changes. No real outreach is sent. Use synthetic data only.

## Publish

Create a public repository named `hilabs-care-workbench` and upload this directory's contents. In Settings → Pages select **Deploy from a branch**, branch **main**, folder **/docs**. After deployment GitHub provides the public HTTPS URL. The relative assets and hash routes support repository subpaths.

`docs/` is the ready-to-publish static build. `src/` and `server/` preserve editable source and shared workflow logic. The server adapters are retained only for regression testing; GitHub Pages does not run them. No source-workspace database, credentials, hosting identity, or assignment PDFs are included.
