// ==UserScript==
// @name Main
// @include http://*.youneedabudget.com/*
// @include https://*.youneedabudget.com/*
// @require res/features/allSettings.js
// ==/UserScript==

function injectCSS(path) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', kango.io.getResourceUrl(path));

  document.getElementsByTagName('head')[0].appendChild(link);
}

function injectScript(path) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', kango.io.getResourceUrl(path));

  document.getElementsByTagName('head')[0].appendChild(script);
}

function injectJSString(js) {
  var script = document.createElement('script');
  script.text = js;

  document.getElementsByTagName('head')[0].appendChild(script);
}

function applySettingsToDom() {
  ynabToolKit.allSettings.forEach(function(setting) {

    getKangoSetting(setting.name).then(function (data) {
      if (data in setting.actions) {
        var selectedActions = setting.actions[data.toString()];
        for (var i = 0; i < selectedActions.length; i += 2) {
          var action = selectedActions[i];
          var target = selectedActions[i + 1];

          if (action == "injectCSS") {
            injectCSS(target);
          } else if (action == "injectScript") {
            injectScript(target);
          } else if (action == "injectJSString") {
            injectJSString(target);
          } else {
            throw "Invalid action '" + action + "'. Only injectCSS, injectScript and injectJSString are currently supported.";
          }
        }
      }
    })
  });
}

/* Init ynabToolKit object and import options from Kango  */
injectJSString("window.ynabToolKit = {}; ynabToolKit.options = {" + Array.from(kango.storage.getKeys(), el=> el + " : " + kango.storage.getItem(el) + ", ").reduce((a, b) => a + b, "") + "}")

/* Load this to setup shared utility functions */
injectScript('res/features/shared/main.js');

/* This script to be built automatically by the python script */
injectScript('res/features/shared/feedChanges.js');

/* Load this to setup behaviors when the DOM updates and shared functions */
injectScript('res/features/act-on-change/main.js');

/* Global toolkit css. */
injectCSS('res/features/main.css');

ensureDefaultsAreSet().then(applySettingsToDom);
