## Requirements

* kubectl version must be +-1 of kubernetes cluster. Ex: K8s cluster v1.21, kubectl version can be 1.20,1.21,1.22
* Port 6443 open for outbound traffic The Sysdig Agent communicates with the collector on port 6443. If you’re using a firewall, make sure to open port 6443 for outbound traffic so that the agent can communicate with the collector
* [Agent Requirement Docs]([https://docs.sysdig.com/en/docs/installation/sysdig-secure/install-agent-components/installation-requirements/](https://docs.sysdig.com/en/docs/installation/sysdig-secure/install-agent-components/installation-requirements/sysdig-agent/)https://docs.sysdig.com/en/docs/installation/sysdig-secure/install-agent-components/installation-requirements/sysdig-agent/)
* Access to kubernetes cluster. Ex: "kubectl get pods -A" returns list of pods running on cluster

## Installation

* Fill out form located here: https://alexwang19.github.io/
* Please fill out required fields
* Add proxy and/or internal registry if that applies
* Click submit to get helm install command along with static config file. Allow for multiple files to be downloaded
* Files needed for install will be downloaded to your Downloads folder. Please place config.yaml in folder where helm install command will be executed. Deployment.html will contain copy of helm install command with config options displayed.

## Verify Installation

* Ensure all sysdig pods are 1/1 Running state.
* Double check the largest image size to make sure a new larger image is not encountered.
* If a new and larger image is encountered, we may need to tune the runtime scanner to accommodate the larger size.
* You can also watch for log messages with "too" that say image scans are being skipped due to size.
* Grep all of the agent pod logs for "Error," and ensure there are no recurring errors of concern.
* Grep all of the agent pod logs for "POLICIES_V2". You should see something like "Received command 22 (POLICIES_V2)" This signifies that the pod is up and running successfully.
* Grep all of the agent node analyzer pod logs for "\"level\":\"error\"" and ensure there are no recurring errors of concern.
* Sometimes you will see recurring errors if a scan is attempted for an application pod that has not come up or is failing.
* Grep all of the agent node analyzer pods logs for "\"message\":\"startup sleep\"". This signifies that the pod is up and running successfully.
