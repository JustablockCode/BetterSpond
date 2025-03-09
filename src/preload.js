const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');
console.log('Preload script is running');

let initialPluginsData = [];

const appVersion = "0.0.1-beta.1";
const electronVersion = process.versions.electron;

// script is in root_of_project/src/preload.js
async function getPlugins() {
  try {
    const pluginsPath = path.join(__dirname, 'plugins', 'plugins.json');
    const data = fs.readFileSync(pluginsPath, 'utf8');
    const pluginsData = JSON.parse(data);

    pluginsData.forEach(plugin => {
      if (plugin.logo && !plugin.logo.startsWith('http')) {
        console.warn(`Warning: Plugin logo URL is not valid - ${plugin.logo}`);
      }
    });

    console.log('Plugins data:', pluginsData);
    return pluginsData;
  } catch (error) {
    console.error('Error loading plugins file:', error);
    return [];
  }
}

function executePluginScript(scriptPath) {
  try {
    require(scriptPath);
    console.log(`Executed plugin script: ${scriptPath}`);
  } catch (error) {
    console.error(`Error executing plugin script: ${scriptPath}`, error);
  }
}

function openPluginsPopup() {
  console.log('openPluginsPopup function called');
  getPlugins().then(currentPluginsData => {
    const pluginsListHtml = currentPluginsData.map(plugin => `
      <div class="plugin-item" style="display: flex; align-items: center; margin-bottom: 16px; cursor: pointer;" data-plugin='${JSON.stringify(plugin)}'>
        <img src="${plugin.logo}" alt="${plugin.name} logo" style="width: 48px; height: 48px; margin-right: 16px;">
        <div>
          <h4 style="margin: 0; font-size: 16px;">${plugin.name}</h4>
          <p style="margin: 4px 0 0; font-size: 14px; color: #666;">${plugin.shortDescription}</p>
          <p style="margin: 4px 0 0; font-size: 14px; color: #666;">Version: ${plugin.version}</p>
          <input type="checkbox" class="plugin-checkbox" ${plugin.enabled ? 'checked' : ''} data-plugin-name="${plugin.name}">
        </div>
      </div>
    `).join('');

    const popupHtml = `
      <div class="plugins-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: flex-start; z-index: 9999; overflow-y: auto;">
        <div class="plugins-modal-content" style="background-color: white; border-radius: 4px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); margin-top: 5vh; position: relative;">
          <div class="plugins-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; border-bottom: 1px solid #e0e0e0; background-color: #f5f5f5;">
            <div style="flex: 1;"></div>
            <h3 class="plugins-modal-title" style="font-size: 14px; font-weight: bold; margin: 0; color: #333; text-align: center; flex: 1;">Plugins</h3>
            <div style="flex: 1; display: flex; justify-content: flex-end;">
              <button class="plugins-modal-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">&times;</button>
            </div>
          </div>
          <div class="plugins-warning" style="display: none; padding: 8px 16px; background-color: #ffeb3b; color: #333; text-align: center;">
            To apply changes, restart is required. <button class="restart-button" style="margin-left: 8px; padding: 4px 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Restart</button>
          </div>
          <div class="plugins-modal-body" style="padding: 16px;">
            ${pluginsListHtml}
          </div>
          <div class="plugins-modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 16px; border-top: 1px solid #e0e0e0; background-color: #f5f5f5; position: absolute; bottom: 0; left: 0; right: 0;">
            <div style="flex: 1; display: flex; justify-content: flex-start; align-items: center; font-size: 12px; color: #666;">
              <span>App Version: ${appVersion}</span>
              <span style="margin-left: 8px;">Electron Version: ${electronVersion}</span>
            </div>
            <div style="flex: 1; display: flex; justify-content: flex-end;">
              <button class="plugins-modal-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #666;">&times;</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = popupHtml;
    document.body.appendChild(popupContainer);

    const closeButton = popupContainer.querySelector('.plugins-modal-close');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(popupContainer);
    });

    const pluginItems = popupContainer.querySelectorAll('.plugin-item');
    pluginItems.forEach(item => {
      const checkbox = item.querySelector('.plugin-checkbox');
      item.addEventListener('click', (event) => {
        if (event.target !== checkbox) {
          const plugin = JSON.parse(item.getAttribute('data-plugin'));
          openPluginDetailPopup(plugin);
        }
      });
    });

    const checkboxes = popupContainer.querySelectorAll('.plugin-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (event) => {
        const pluginName = event.target.getAttribute('data-plugin-name');
        const isEnabled = event.target.checked;
        updatePluginStatus(pluginName, isEnabled);

        const initialPlugin = initialPluginsData.find(p => p.name === pluginName);
        const warning = popupContainer.querySelector('.plugins-warning');
        if (initialPlugin && initialPlugin.enabled !== isEnabled) {
          warning.style.display = 'block';
        } else {
          const anyChanges = Array.from(checkboxes).some(cb => {
            const plugin = initialPluginsData.find(p => p.name === cb.getAttribute('data-plugin-name'));
            return plugin && plugin.enabled !== cb.checked;
          });
          warning.style.display = anyChanges ? 'block' : 'none';
        }
      });
    });

    const restartButton = popupContainer.querySelector('.restart-button');
    restartButton.addEventListener('click', () => {
      ipcRenderer.send('restart-app');
    });

    const warning = popupContainer.querySelector('.plugins-warning');
    const anyChanges = Array.from(checkboxes).some(cb => {
      const plugin = initialPluginsData.find(p => p.name === cb.getAttribute('data-plugin-name'));
      return plugin && plugin.enabled !== cb.checked;
    });
    warning.style.display = anyChanges ? 'block' : 'none';
  });
}

function openPluginDetailPopup(plugin) {
  const detailPopupHtml = `
    <div class="plugin-detail-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; overflow-y: auto;">
      <div class="plugin-detail-content" style="background-color: white; border-radius: 4px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 24px;">${plugin.name}</h2>
          <button class="plugin-detail-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        <img src="${plugin.logo}" alt="${plugin.name} logo" style="width: 64px; height: 64px; margin-bottom: 16px;">
        <p style="font-size: 16px; line-height: 1.5;">${plugin.fullDescription}</p>
        <p style="font-size: 14px; color: #666;">Author: ${plugin.author}</p>
        <p style="font-size: 14px; color: #666;">Version: ${plugin.version}</p>
        <input type="checkbox" class="plugin-detail-checkbox" ${plugin.enabled ? 'checked' : ''} data-plugin-name="${plugin.name}">
        <a href="${plugin.link}" target="_blank" style="display: inline-block; margin-top: 16px; padding: 8px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Website</a>
      </div>
    </div>
  `;

  const detailPopupContainer = document.createElement('div');
  detailPopupContainer.innerHTML = detailPopupHtml;
  document.body.appendChild(detailPopupContainer);

  const closeDetailButton = detailPopupContainer.querySelector('.plugin-detail-close');
  closeDetailButton.addEventListener('click', () => {
    document.body.removeChild(detailPopupContainer);
  });

  const detailCheckbox = detailPopupContainer.querySelector('.plugin-detail-checkbox');
  detailCheckbox.addEventListener('change', (event) => {
    const pluginName = event.target.getAttribute('data-plugin-name');
    const isEnabled = event.target.checked;
    updatePluginStatus(pluginName, isEnabled);

    const smallPopupCheckbox = document.querySelector(`.plugin-checkbox[data-plugin-name="${pluginName}"]`);
    if (smallPopupCheckbox) {
      smallPopupCheckbox.checked = isEnabled;
    }
    const warning = document.querySelector('.plugins-warning');
    if (warning) {
      const initialPlugin = initialPluginsData.find(p => p.name === pluginName);
      if (initialPlugin && initialPlugin.enabled !== isEnabled) {
        warning.style.display = 'block';
      } else {
        const anyChanges = Array.from(document.querySelectorAll('.plugin-checkbox')).some(cb => {
          const plugin = initialPluginsData.find(p => p.name === cb.getAttribute('data-plugin-name'));
          return plugin && plugin.enabled !== cb.checked;
        });
        warning.style.display = anyChanges ? 'block' : 'none';
      }
    }
  });
}


function updatePluginStatus(pluginName, isEnabled) {
  getPlugins().then(pluginsData => {
    const plugin = pluginsData.find(p => p.name === pluginName);
    if (plugin) {
      plugin.enabled = isEnabled;
      const pluginsPath = path.join(__dirname, 'plugins', 'plugins.json');
      fs.writeFileSync(pluginsPath, JSON.stringify(pluginsData, null, 2), 'utf8');
      console.log(`Updated plugin status: ${pluginName} is now ${isEnabled ? 'enabled' : 'disabled'}`);
    }
  });
}


function waitForElement(selector) {
  return new Promise(resolve => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired');
  getPlugins().then(pluginsData => {
    initialPluginsData = pluginsData.map(plugin => ({ ...plugin }));
    pluginsData.forEach(plugin => {
      if (plugin.enabled) {
        executePluginScript(path.join(__dirname, plugin.script));
      }
    });
  });

  waitForElement('.spondHeaderstyled__Tabs-sc-1xs7cs-3').then(buttonsDiv => {
    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'spondHeaderstyled__TabItem-sc-1xs7cs-7 heUbtq';
    newButton.innerHTML = `
      <svg class="spondHeaderstyled__TabItemIcon-sc-1xs7cs-9 iYJlZu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h3a1 1 0 0 0 1-1V5a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-1a2 2 0 0 0-4 0v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a2 2 0 0 0 0-4H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/>
      </svg>
      <div id="tab-plugins" class="spondHeaderstyled__TabItemText-sc-1xs7cs-8 gYPWNs">Plugins</div>
    `;
    newButton.addEventListener('click', openPluginsPopup);
    buttonsDiv.appendChild(newButton);
  });

  const style = document.createElement('style');
  style.textContent = `
    .spondHeaderstyled__TabItemIcon-sc-1xs7cs-9.iYJlZu {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    .plugin-checkbox, .plugin-detail-checkbox {
      margin-top: 8px;
      transform: scale(1.2);
      accent-color: #2196F3;
    }
    .plugins-modal-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border-top: 1px solid #e0e0e0;
      background-color: #f5f5f5;
    }
  `;
  document.head.appendChild(style);
});
