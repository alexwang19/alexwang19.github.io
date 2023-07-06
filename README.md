## Helm Quickstart

### Initialize Sysdig Helm Chart Repository
```
helm repo add sysdig https://charts.sysdig.com --force-update
```

### Install Sysdig Chart
* [Helm Install Docs](https://helm.sh/docs/helm/helm_install/)
```
helm install sysdig-agent \
--namespace <namespace> \
--set global.sysdig.accessKey=<access-key> \
...
-f example-values-file.yaml \
sysdig/sysdig-deploy
```

### Upgrade Sysdig Deployment or Override Values
* Refer to these docs for additional params: [Helm Upgrade Docs](https://helm.sh/docs/helm/helm_upgrade/)
* helm upgrade --force to override values
```
helm upgrade sysdig-agent \
 --namespace <namespace> \
 --set global.sysdig.accessKey=<access key> \
 --set agent.image.tag=<version> \
 --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.image.tag=<version> \
 ...
 -f example-values-file.yaml \
sysdig/sysdig-deploy
```

```
helm upgrade --force sysdig-agent \
 --namespace <namespace> \
 --set global.sysdig.accessKey=<access key> \
 ...
 -f example-values-file.yaml \
sysdig/sysdig-deploy
```

### List Releases
* [Helm List Docs](https://helm.sh/docs/helm/helm_list/)
```
helm list --namespace <namespace>
```

### View Status
* [Helm Status Docs](https://helm.sh/docs/helm/helm_status/)
```
helm status sysdig-agent --namespace <namespace>
```

### Delete Sysdig Deployment (Uninstall)
* [Helm Uninstall Docs](https://helm.sh/docs/helm/helm_uninstall/)
```
helm uninstall sysdig-agent --namespace <namespace>
```

### Delete Sysdig Deployment (Deprecated)
```
helm delete sysdig-agent --namespace <namespace>
```
