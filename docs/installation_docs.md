## Table of Contents
* [Sysdig Installation Pre-Reqs](#sysdig-installation-pre-reqs)
* [Sysdig Installation](#sysdig-installation)
* [Verify Sysdig Installation](#verify-sysdig-installation)


## Sysdig Installation Pre-Reqs

* If unfamiliar with helm, please reference the helm quickstart page [here](sysdig_helm_quickstart.md).
* Confirm correct kubernetes cluster is targeted
  * ```
    kubectl config get-contexts
    ```
* Access to kubernetes cluster. Ex: "kubectl get pods -A" returns list of pods running on cluster
* kubectl version must be +-1 of kubernetes cluster. Ex: K8s cluster v1.25, kubectl(client) version is recommended to be no lower than v1.24
  * ```
    kubectl version --short
    
    Client Version: v1.26.0
    Kustomize Version: v4.5.7
    Server Version: v1.25.11-eks-a5565ad
    ```
* Appropriate helm version installed. Compatibility table found [here](https://helm.sh/docs/topics/version_skew/).
  * ```
     helm version
    
     version.BuildInfo{Version:"v3.12.1", GitCommit:"f32a527a060157990e2aa86bf45010dfb3cc8b8d", GitTreeState:"clean", GoVersion:"go1.20.5"}
    ```
* Ensure adequate resources on nodes are available:
  * Minimum sysdig resources:
    * Limits
      * CPU: 1000m
      * Memory: 4Gi
      * Ephemeral-storage: 6Gi
    * Requests
      * Ephemeral-storage: 3Gi
  * ```
    kubectl describe nodes

    Allocated resources:
     Resource                    Requests      Limits
     --------                    --------      ------
     cpu                         1525m (38%)   2150m (54%)
     memory                      1756Mi (11%)  5440Mi (36%)
     ephemeral-storage           3322Mi (19%)  6394Mi (36%)
     hugepages-1Gi               0 (0%)        0 (0%)
     hugepages-2Mi               0 (0%)        0 (0%)
     attachable-volumes-aws-ebs  0             0
    ```
* Port 6443 open for outbound traffic The Sysdig Agent communicates with the collector on port 6443. If you’re using a firewall, make sure to open port 6443 for outbound traffic so that the agent can communicate with the collector. This also applies to proxies. Ensure that port 6443 is open on your proxy.
  * Validate connection from kubernetes worker node using commands below:
    ```
    ssh myuser@k8s_worker_node
    
    export http{s,}_proxy=http://myproxy.com:8080
    curl -sL ingest-us2.app.sysdig.com:6443 -v
    ```
* If using a proxy, make sure to include clusterIP in the no_proxy list in the onboarding form.
  * Command to find clusterIP: 
    ```
    kubectl get service kubernetes -o jsonpath='{.spec.clusterIP}'; echo
    ```
* [Agent Requirement Docs](https://docs.sysdig.com/en/docs/installation/sysdig-secure/install-agent-components/installation-requirements/sysdig-agent/)

## Sysdig Installation

* A self-service form for generating Sysdig installation files, commands and instructions has been created to standardize the process for installing Sysdig at Verizon.
* The form should be self-explanatory. Use the tooltips in the form for explanation for each field.
* The form is designed so that after all fields are populated correctly, the generate install commands button will provide the installation files and instructions.
  * A static-helm-values.yaml file will be downloaded. You should save this file to the directory you will execute the install from.
  * Copy the generated commands and execute them from the directory where the static-helm-values.yaml is located to install Sysdig.
* At this stage, you can also download the form input values and save them for future use.
  * This file can be uploaded with the "Choose File" option in the form.
* The form is found here: https://alexwang19.github.io./

## Verify Sysdig Installation

* Ensure all sysdig pods are 1/1 Running state.
  * ```
    kubectl -n kube-system get pods
    ``` 
* Double check the largest image size to make sure a new larger image is not encountered.
  * ```
    kubectl get nodes -o json | jq -r '.items[].status.images[] | .sizeBytes' | sort -nr | head -1
    ```
* If a new and larger image is encountered, we may need to tune the runtime scanner to accommodate the larger size.
  * Enter new larger image size in onboarding portal(https://alexwang19.github.io./) to generate new set of helm commands based on new larger image size.
* You can also watch for log messages with "too" that say image scans are being skipped due to size.
  * ```
    kubectl -n kube-system logs <agent-node-analyzer-pod-name> | grep -i too
    ``` 
* Grep all of the agent pod logs for "Error," and ensure there are no recurring errors of concern.
  * ```
    kubectl -n kube-system logs <agent-pod-name> | grep -i error
    ``` 
* Grep all of the agent pod logs for "POLICIES_V2". You should see something like "Received command 22 (POLICIES_V2)" This signifies that the pod is up and running successfully.
  * ```
    kubectl -n kube-system logs <agent-pod-name> | grep -i POLICIES_V2
    ```  
* Grep all of the agent node analyzer pod logs for "\"level\":\"error\"" and ensure there are no recurring errors of concern.
  * ```
    kubectl -n kube-system logs <agent-node-analyzer-pod-name> | grep -i "\"level\":\"error\""
    ``` 
* Sometimes you will see recurring errors if a scan is attempted for an application pod that has not come up or is failing.
* Grep all of the agent node analyzer pods logs for "\"message\":\"startup sleep\"". This signifies that the pod is up and running successfully.
  * ```
    kubectl -n kube-system logs <agent-node-analyzer-pod-name> | grep -i "\"message\":\"startup sleep\""
    ``` 


