// // Function to auto-populate cluster tags
// function autoPopulateClusterTags() {
//   const businessUnit = document.getElementById('businessUnit').value;
//   const environment = document.getElementById('environment').value;
//   const platform = document.getElementById('platform').value;
//   const vsadId = document.getElementById('vsad').value;
//   const vastId = document.getElementById('vast').value;

//   const clusterTagsInput = document.getElementById('clusterTags');
//   const tags = [];

//   if (businessUnit) {
//     tags.push(`business_unit:${businessUnit}`);
//   }
//   if (environment) {
//     tags.push(`environment:${environment}`);
//   }
//   if (platform) {
//     tags.push(`platform:${platform}`);
//   }
//   if (vsadId) {
//     tags.push(`vsad_id:${vsadId}`);
//   }
//   if (vastId) {
//     tags.push(`vast_id:${vastId}`);
//   }

//   clusterTagsInput.value = tags.join(',');
// }

// // Add input event listeners to related input fields
// const inputFields = document.querySelectorAll('#businessUnit, #environment, #platform, #vsadId, #vastId');
// inputFields.forEach(function (inputField) {
//   inputField.addEventListener('input', autoPopulateClusterTags);
// });


let importedYamlData = null;

// Function to fetch and import the YAML file
function importYamlFile() {
  fetch('files/static-configs.yaml')
    .then(response => response.text())
    .then(yamlContent => {
      // Parse the YAML content
      importedYamlData = yamlContent;
    })
    .catch(error => {
      console.error('Error importing YAML file:', error);
    });
}

// Call the importYamlFile function to import the YAML file
importYamlFile();

// Function to download the imported YAML file
function downloadYamlFile(outputDiv, outputText) {
  if (importedYamlData) {
    // Convert the YAML data back to YAML content
    // const yamlContent = yaml.safeDump(importedYamlData);

    console.log("Test");
    
    // Create a Blob with the YAML content
    const blob = new Blob([importedYamlData], { type: 'text/yaml' });
    outputDiv.innerHTML = outputText;
    // Create a temporary <a> element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'static-helm-values.yaml';
    link.click();
  } else {
    console.error('No imported YAML data available.');
  }
}

  // // Create a Blob with the YAML content
  // const blob = new Blob([yamlContent], { type: 'text/yaml' });
  // outputDiv.innerHTML = outputText;
  // // Create a temporary <a> element to trigger the download
  // const link = document.createElement('a');
  // link.href = URL.createObjectURL(blob);
  // link.download = 'config.yaml';
  // link.click();



// Function to fetch the tags from the Quay.io repository and populate the dropdown
function populateTagOptions() {
  const dropdown = document.getElementById('agentTags');

  fetch('https://quay.io/api/v1/repository/sysdig/agent/tag/', {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(response => response.json())
    .then(data => {
      const tags = data.tags.map(tag => formatTagVersion(tag.name));
      const uniqueTags = Array.from(new Set(tags));
      const lastFiveUniqueTags = uniqueTags.slice(1,5);
      lastFiveUniqueTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        dropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error fetching tags:', error);
    });
}

// Function to format the tag version in "1.14.1" format
function formatTagVersion(tag) {
  const versionParts = tag.split('-');
  return versionParts[0];
}

// Call the populateTagOptions() function to populate the dropdown on page load
window.addEventListener('DOMContentLoaded', populateTagOptions);


// Function to fetch the tags from the Quay.io repository and populate the dropdown
function populateRuntimeScannerTagOptions() {
  const dropdown = document.getElementById('runtimeScannerTags');

  fetch('https://quay.io/api/v1/repository/sysdig/vuln-runtime-scanner/tag/', {
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
    .then(response => response.json())
    .then(data => {
      const tags = data.tags
        .filter(tag => compareVersions(tag.name, '1.4.12') >= 0)
        .map(tag => formatTagVersion(tag.name));
      const uniqueTags = Array.from(new Set(tags));
      const lastFiveUniqueTags = uniqueTags.slice(0,3);
      lastFiveUniqueTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        dropdown.appendChild(option);
      });
      // dropdown.selectedIndex = 0;
    })
    .catch(error => {
      console.error('Error fetching tags:', error);
    });
}

// Comparison function for version strings
function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA < partB) {
      return -1;
    }
    if (partA > partB) {
      return 1;
    }
  }

  return 0;
}

// Function to format the tag version in "1.5.1" format
// function formatRuntimeScannerTagVersion(tag) {
//   const versionParts = tag.split('-');
//   return versionParts[0];
// }

// Call the populateTagOptions() function to populate the dropdown on page load
window.addEventListener('DOMContentLoaded', populateRuntimeScannerTagOptions);


// Function to auto-populate cluster name
function autoPopulateClusterName() {
  const businessUnit = document.getElementById('businessUnit').value.toLowerCase();
  const environment = document.getElementById('environmentSelect').value.toLowerCase();
  const platform = document.getElementById('platform').value.toLowerCase();
  const vsadId = document.getElementById('vsad').value.toLowerCase();
  const vastId = document.getElementById('vast').value.toLowerCase();

  const clusterNameInput = document.getElementById('clusterName');
  const nameParts = [];

  if (businessUnit) {
    nameParts.push(businessUnit);
  }
  if (environment) {
    nameParts.push(environment);
  }
  if (platform) {
    nameParts.push(platform);
  }
  if (vsadId) {
    nameParts.push(vsadId);
  }
  if (vastId) {
    nameParts.push(vastId);
  }

  const clusterName = nameParts.join('-');
  clusterNameInput.value = clusterName;
}

// Add input event listeners to related input fields
const inputFields = document.querySelectorAll('#businessUnit, #environment, #platform, #vsad, #vast');
inputFields.forEach(function (inputField) {
  inputField.addEventListener('input', autoPopulateClusterName);
});


function refreshPage() {
  window.location.reload();
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    populateFields(content);
  };
  reader.readAsText(file);
}

function populateFields(content) {
  const lines = content.split('\n');
  const inputFields = document.querySelectorAll('.form-section input:not([type="file"])');

  for (let i = 0; i < inputFields.length && i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes(':')) {
      const [label, value] = line.split(':').map(entry => entry.trim());
      const field = Array.from(inputFields).find(input => input.name === label);

      console.log("Label: ", label)
      console.log("Value: ", value)
      console.log("Field: ", field)

      if (field) {
        if (field.type === 'checkbox') {
          field.checked = (value.toLowerCase() === 'on');
          // field.checked = true;
        } else {
          field.value = value;
        }
      }
    }
  }
  // Check if proxy checkbox is checked and toggle proxy inputs
  const proxyCheckbox = document.getElementById('proxyCheckbox');
  if (proxyCheckbox.checked) {
    console.log("Toggling proxy checkbox");
    toggleProxyInputs('proxyCheckbox', 'proxyInput');
    const lines2 = content.split('\n');
    const inputFields2 = document.querySelectorAll('.form-section input:not([type="file"])');
  
    for (let i = 0; i < inputFields2.length && i < lines2.length; i++) {
      const line2 = lines2[i].trim();
  
      if (line2.includes(':')) {
        const [label2, value2] = line2.split(':').map(entry2 => entry2.trim());
        const field2 = Array.from(inputFields2).find(input2 => input2.name === label2);

        console.log("Label2: ", label2)
        console.log("Value2: ", value2)
        console.log("Field2: ", field2)
  
        if (field2) {
          if (field2.type === 'checkbox') {
            field2.checked = (value2.toLowerCase() === 'on');
          } else {
            field2.value = value2;
          }
        }
      }
    }
  }


  // Check if proxy checkbox is checked and toggle proxy inputs
  const registryCheckbox = document.getElementById('registryCheckbox');
  console.log("This is is registrycheckbox: ", registryCheckbox);
  console.log("This is is registrycheckbox.checked: ", registryCheckbox.checked);
  if (registryCheckbox.checked) {
    console.log("Toggling registryCheckbox ");
    toggleRegistryInputs('registryCheckbox', 'registryInput');
    const lines2 = content.split('\n');
    const inputFields2 = document.querySelectorAll('.form-section input:not([type="file"])');
  
    for (let i = 0; i < inputFields2.length && i < lines2.length; i++) {
      const line2 = lines2[i].trim();
  
      if (line2.includes(':')) {
        const [label2, value2] = line2.split(':').map(entry2 => entry2.trim());
        const field2 = Array.from(inputFields2).find(input2 => input2.name === label2);

        console.log("Label2: ", label2)
        console.log("Value2: ", value2)
        console.log("Field2: ", field2)
  
        if (field2) {
          if (field2.type === 'checkbox') {
            field2.checked = (value2.toLowerCase() === 'on');
          } else {
            field2.value = value2;
          }
        }
      }
    }
  }
}

// Add event listener to file input
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', handleFileUpload);


function downloadInputValues() {
  const inputFields = document.querySelectorAll('.form-section input:not([type="file"])');
  const values = Array.from(inputFields).map(field => field.name + ': ' + field.value);

  const content = values.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'input_values.txt';
  link.click();

  URL.revokeObjectURL(url);
}

function downloadOutputText() {
  const outputText = document.getElementById('output').textContent;

  const blob = new Blob([outputText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'output.txt';
  link.click();

  URL.revokeObjectURL(url);
}
function handleRegionChange() {
  const regionSelect = document.getElementById('regionSelect');
  const testInput = document.getElementById('testInput');
  const prodInput = document.getElementById('prodInput');
  const agentTagsInput = document.getElementById('agentTagsInput');
  const runtimeScannerTagsInput = document.getElementById('runtimeScannerTagsInput');

  if (regionSelect.value === 'us2') {
    testInput.style.display = 'block';
    prodInput.style.display = 'none';
  } else if (regionSelect.value === 'us3'){
    testInput.style.display = 'none';
    prodInput.style.display = 'block';
  }
}

function toggleRegistryInputs(checkboxId, inputsContainerId) {
  const checkbox = document.getElementById(checkboxId);
  const inputsContainer = document.getElementById(inputsContainerId);

  if (checkbox.checked) {
    const registry_fields = ["Internal Registry", "Internal Sysdig Agent Image", "Internal Registry Pull Secret (Optional)", "Internal Sysdig Runtime Scanner Image", "Sysdig Agent Tag", "Sysdig Runtime Scanner Tag"];
    const registry_placeholders = ["ex: quay.io", "ex: sysdig/agent", "ex: mysecret", "ex: sysdig/vuln-runtime-scanner", "ex: 1.14.1", "ex: 1.5.0"];
    agentTagsInput.style.display = 'none';
    runtimeScannerTagsInput.style.display = 'none';
    // Clear existing inputs
    inputsContainer.innerHTML = '';

    // Generate input boxes
    for (let i = 0; i < registry_fields.length; i++) {
      const inputWrapper = document.createElement('div');
      inputWrapper.classList.add('dynamic-input-wrapper');

      const label = document.createElement('label');
      label.textContent = registry_fields[i];

      const input = document.createElement('input');
      input.type = 'text';
      input.name = registry_fields[i];
      input.placeholder = registry_placeholders[i];

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(input);

      inputsContainer.appendChild(inputWrapper);
    }
  } else {
    // Clear inputs when unchecked
    inputsContainer.innerHTML = '';
    agentTagsInput.style.display = 'block';
    runtimeScannerTagsInput.style.display = 'block';
  }
}
function toggleProxyInputs(checkboxId, inputsContainerId) {
  const checkbox = document.getElementById(checkboxId);
  const inputsContainer = document.getElementById(inputsContainerId);

  if (checkbox.checked) {
    // Clear existing inputs
    // inputsContainer.innerHTML = '';
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('dynamic-input-wrapper');

    const label = document.createElement('label');
    label.textContent = 'Proxy Host';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'proxy_host';
    input.required = true;
    input.placeholder = 'ex: myproxyhost.proxy.com'

    inputWrapper.appendChild(label);
    inputWrapper.appendChild(input);

    const inputWrapper2 = document.createElement('div');
    inputWrapper2.classList.add('dynamic-input-wrapper');

    const label2 = document.createElement('label');
    label2.textContent = 'Proxy Port';

    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.name = 'proxy_port';
    input2.required = true;
    input2.placeholder = 'ex: 8080'

    inputWrapper2.appendChild(label2);
    inputWrapper2.appendChild(input2);

    const inputWrapper3 = document.createElement('div');
    inputWrapper3.classList.add('dynamic-input-wrapper');

    const label3 = document.createElement('label');
    label3.textContent = 'No Proxy List(Comma delimited)';

    const input3 = document.createElement('input');
    input3.type = 'text';
    input3.name = 'no_proxy_list';
    input3.required = true;
    input3.placeholder = 'ex: 127.0.0.1,noproxyhost.com'

    inputWrapper3.appendChild(label3);
    inputWrapper3.appendChild(input3);

    inputsContainer.appendChild(inputWrapper);
    inputsContainer.appendChild(inputWrapper2);
    inputsContainer.appendChild(inputWrapper3);
  } else {
    // Clear inputs when unchecked
    inputsContainer.innerHTML = '';
  }
}
function toggleInput(checkboxId, inputId) {
  const checkbox = document.getElementById(checkboxId);
  const inputDiv = document.getElementById(inputId);
  inputDiv.style.display = checkbox.checked ? 'block' : 'none';
}

function convertBytesToGigabytes(bytes) {
  return bytes / (1024 * 1024 * 1024);
}

function displayOutput() {
  // const checkbox = document.getElementById('generateInputsCheckbox');
  // const inputsContainer = document.getElementById('dynamicInputs');
  // const namespaceInput = document.querySelector('#namespaceInput input');
  // const regionCheckbox = document.getElementById('regionCheckbox');
  const businessUnitInput = document.querySelector('#businessUnitInput input').value.toLowerCase();
  const platformInput = document.querySelector('#platformInput input').value.toLowerCase();
  // const environmentInput = document.querySelector('#environmentInput input');
  const environmentInput = document.getElementById('environmentSelect').value.toLowerCase();
  const vastInput = document.querySelector('#vastInput input').value.toLowerCase();
  const vsadInput = document.querySelector('#vsadInput input').value.toLowerCase();
  const imageSizeInput = document.querySelector('#imageSizeInput input');
  const proxyCheckbox = document.getElementById('proxyCheckbox');
  const proxyInput = document.getElementById('proxyInput');
  const inputs = proxyInput.getElementsByTagName('input');
  const registryCheckbox = document.getElementById('registryCheckbox');
  const registryInput = document.getElementById('registryInput');
  const registryInputs = registryInput.getElementsByTagName('input');
  // const priorityCheckbox = document.getElementById('priorityCheckbox');
  // const priorityInput = document.querySelector('#priorityInput input');
  const outputDiv = document.getElementById('output');
  const agentTagsInput = document.getElementById('agentTagsInput');
  const runtimeScannerTagsInput = document.getElementById('runtimeScannerTagsInput');
  const agentTagsSelect = document.getElementById('agentTags');
  const runtimeScannerTagsSelect = document.getElementById('runtimeScannerTags');

  let helmQuickstartDocs = '<b>Link for installation instructions <a target="_blank" href="https://github.com/alexwang19/alexwang19.github.io/blob/main/docs/installation_docs.md">here</a></b><br><br>';
  let helmHeader = '<b>Use Below Commands to Install Sysdig via Helm. Update full path of static-helm-values.yaml in the command.</b><br>';
  let helmInitText = 'helm repo add sysdig https://charts.sysdig.com --force-update <br><br>';
  let helmInstallText = 'helm install sysdig-agent \\<br>&nbsp;&nbsp;&nbsp;&nbsp; --namespace kube-system \\<br>';
  let clusterNameText = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.clusterConfig.name=' + businessUnitInput + '-' + platformInput + '-' + environmentInput + '-' + vastInput + '-' + vsadInput + ' \\ <br>';
  let clusterTagsText = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.sysdig.settings.tags="cluster:' + businessUnitInput + '-' + platformInput + '-' + environmentInput + '-' + vastInput + '-' + vsadInput + '\\,' + 'vz-vsadid:' + vsadInput + '\\,' + 'vz-vastid:' + vastInput +'" \\ <br>';
  let outputText = helmQuickstartDocs + helmHeader + helmInitText + helmInstallText + clusterNameText + clusterTagsText;


  if (imageSizeInput.value > 2147483648) {
    let ephemeralStorageRequestBytes = 1.5 * imageSizeInput.value;
    const ephemeralStorageRequestGigabytes = convertBytesToGigabytes(ephemeralStorageRequestBytes);
    let ephemeralStorageLimitBytes = 3 * imageSizeInput.value;
    const ephemeralStorageLimitGigabytes = convertBytesToGigabytes(ephemeralStorageLimitBytes);
    let memoryLimitBytes = 2 * imageSizeInput.value;
    const memoryLimitGigabytes = convertBytesToGigabytes(memoryLimitBytes);

    outputText += '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.settings.maxImageSizeAllowed=' + imageSizeInput.value + ' \\<br>';
    outputText += '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.resources.requests.ephemeral-storage=' + Math.ceil(ephemeralStorageRequestGigabytes) + 'Gi \\<br>';
    outputText += '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.resources.limits.memory=' + Math.ceil(memoryLimitGigabytes) + 'Gi \\<br>'
    outputText += '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.resources.limits.ephemeral-storage=' + Math.ceil(ephemeralStorageLimitGigabytes) + 'Gi \\<br>';
  }

  let regionInput;
  let accessKeyInput;
  const regionSelect = document.getElementById('regionSelect');
  if (regionSelect.value === 'us2') {
    let regionText = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.sysdig.region=us2 \\<br>';
    accessKeyInput = document.getElementById('testSysdigAccessKey').value;
    let accessKeyText = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.sysdig.accessKey=' + accessKeyInput + ' \\ <br>';
    outputText += regionText;
    outputText += accessKeyText;
  } else if (regionSelect.value === 'us3'){
    accessKeyInput = document.getElementById('standardSysdigAccessKey').value;
    let accessKeyText = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.sysdig.accessKey=' + accessKeyInput + ' \\ <br>';
    outputText += accessKeyText;
  };
  // Validate required inputs
  if (accessKeyInput == null || businessUnitInput.trim() === '' || platformInput.trim() === '' || environmentInput.trim() === '' || vastInput.trim() === '' || vsadInput.trim() === '') {
    alert('Please fill in all required fields.');
    return;
  }
  if (accessKeyInput != null){
    if (accessKeyInput.trim() === ''){
      alert('Please fill in required access key.');
      return;
    };
  };
  
  if (proxyCheckbox.checked) {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (input.value.trim() === '') {
        alert('Please fill in all proxy fields.');
        return;
      };
    };
    let httpProxy = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.proxy.httpProxy=' + inputs[0].value + ':' + inputs[1].value + ' \\ <br>';
    let httpsProxy = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.proxy.httpsProxy=' + inputs[0].value + ':' + inputs[1].value + ' \\ <br>';
    let noProxy = '&nbsp;&nbsp;&nbsp;&nbsp; --set global.proxy.noProxy=' + '"' + inputs[2].value + '"' + ' \\ <br>';
    let agentHttpProxyPort = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.sysdig.settings.http_proxy.proxy_port=' + inputs[1].value + ' \\ <br>';
    let agentHttpProxyHost = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.sysdig.settings.http_proxy.proxy_host=' + inputs[0].value + ' \\ <br>';
    outputText += httpProxy;
    outputText += httpsProxy;
    outputText += noProxy;
    outputText += agentHttpProxyPort;
    outputText += agentHttpProxyHost;
  }
  if (registryCheckbox.checked) {
    for (let i = 0; i < registryInputs.length; i++) {
      const input = registryInputs[i];
      if (input.value.trim() === '' && i != 2) {
        alert('Please fill in all internal registry fields.');
        return;
      };
    };
    let agentImageRegistry = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.image.registry=' + registryInputs[0].value + ' \\ <br>';
    let agentImageRepository = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.image.repository=' + registryInputs[1].value + ' \\ <br>';
    let agentImagePullSecrets = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.image.pullSecrets=' + registryInputs[2].value + ' \\ <br>';
    let nodeAnalyzerImageRegistry = '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.image.registry=' + registryInputs[0].value + ' \\ <br>';
    let nodeAnalyzerNodeAnalyzerRuntimeScannerImageRepository = '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.image.repository=' + registryInputs[3].value + ' \\ <br>';
    let nodeAnalyzerNodeAnalyzerPullSecrets = '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.pullSecrets=' + registryInputs[2].value + ' \\ <br>';
    let agentImageTag = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.image.tag=' + registryInputs[4].value + ' \\<br>';
    let nodeAnalyzerNodeAnalyzerRuntimeScannerImageTag = '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.image.tag=' + registryInputs[5].value + ' \\ <br>';
    outputText += agentImageRegistry;
    outputText += agentImageRepository;
    if (registryInputs[2].value.trim() != '') {
      outputText += agentImagePullSecrets;
      outputText += nodeAnalyzerNodeAnalyzerPullSecrets;
    };
    outputText += nodeAnalyzerImageRegistry;
    outputText += nodeAnalyzerNodeAnalyzerRuntimeScannerImageRepository;
    outputText += agentImageTag;
    outputText += nodeAnalyzerNodeAnalyzerRuntimeScannerImageTag;
  } else {
    console.log("Agent tags : ", agentTagsSelect.value);
    console.log("Runtime scanner tags input: ", runtimeScannerTagsSelect.value);
    if (agentTagsSelect.value.trim() == '' || runtimeScannerTagsSelect.value.trim() == '') {
      alert('Please select agent tag and runtime scanner versions.');
      return;
    } else {
      let agentImageTag = '&nbsp;&nbsp;&nbsp;&nbsp; --set agent.image.tag=' + agentTagsSelect.value + ' \\<br>';
      let runtimeScannerTag = '&nbsp;&nbsp;&nbsp;&nbsp; --set nodeAnalyzer.nodeAnalyzer.runtimeScanner.image.tag=' + runtimeScannerTagsSelect.value + ' \\ <br>';
      outputText += agentImageTag;
      outputText += runtimeScannerTag;
    };
  };

  // if (priorityCheckbox.checked) {
  //   outputText += '--set agent.priorityClassName=' + priorityInput.value + ' \\ <br>';
  // }

  outputText += '&nbsp;&nbsp;&nbsp;&nbsp; -f static-helm-values.yaml \\<br>';
  outputText += 'sysdig/sysdig-deploy<br>';
  // outputText += '<br><br><b>Steps To Verify Installation</b><br>';
  // outputText += '- Ensure all sysdig pods are 1/1 Running state.<br>';
  // outputText += '- Double check the largest image size to make sure a new larger image is not encountered.<br>';
  // outputText += '- If a new and larger image is encountered, we may need to tune the runtime scanner to accommodate the larger size.<br>';
  // outputText += '- You can also watch for log messages with "too" that say image scans are being skipped due to size.<br>';
  // outputText += '- Grep all of the agent pod logs for "Error," and ensure there are no recurring errors of concern.<br>';
  // outputText += '- Grep all of the agent pod logs for "POLICIES_V2". You should see something like "Received command 22 (POLICIES_V2)" This signifies that the pod is up and running successfully.<br>';
  // outputText += '- Grep all of the agent node analyzer pod logs for "\"level\":\"error\"" and ensure there are no recurring errors of concern.<br>';
  // outputText += '- Sometimes you will see recurring errors if a scan is attempted for an application pod that has not come up or is failing.<br>';
  // outputText += '- Grep all of the agent node analyzer pods logs for "\"message\":\"startup sleep\"". This signifies that the pod is up and running successfully.<br>';

// // Create YAML content
// let yamlContent = `global:
// sysdig:
// region: "us3"
// agent:
// slim:
// enabled: false
// auditLog:
// enabled: false
// sysdig:
// settings:
//   prometheus:
//     enabled: false
// nodeAnalyzer:
// nodeAnalyzer:
// sslVerifyCertificate: false
// imageAnalyzer:
//   deploy: false
// benchmarkRunner:
//   deploy: false
// hostAnalyzer:
//   deploy: false
// hostScanner:
//   deploy: false
// runtimeScanner:
//   deploy: true
//   settings:
//     eveEnabled: false
//     maxImageSizeAllowed: "4194304000"
//     maxFileSizeAllowed: "262144000"
//   eveConnector:
//     deploy: false
//   resources:
//     requests:
//       ephemeral-storage: 3Gi
//     limits:
//       cpu: 1000m
//       memory: 4Gi
//       ephemeral-storage: 6Gi`;

//   // Create a Blob with the YAML content
//   const blob = new Blob([yamlContent], { type: 'text/yaml' });
//   outputDiv.innerHTML = outputText;
//   // Create a temporary <a> element to trigger the download
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.download = 'static-configs.yaml';
//   link.click();

  downloadYamlFile(outputDiv, outputText);
  document.getElementById('downloadOutputBtn').style.display = 'inline-block';
  document.getElementById('downloadInputValuesBtn').style.display = 'inline-block';
  
  // Create a Blob with the YAML content
  // const blob2 = new Blob([outputText], { type: 'text/html' });
  // outputDiv.innerHTML = outputText;
  // // Create a temporary <a> element to trigger the download
  // const link2 = document.createElement('a');
  // link2.href = URL.createObjectURL(blob2);
  // link2.download = 'deployment.html';
  // link2.click();
}
