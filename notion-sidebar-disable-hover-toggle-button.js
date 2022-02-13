// ==UserScript==
// @name         notion-sidebar-disable-hover-toggle-button
// @namespace    https://github.com/MauriceArikoglu/notion-disable-hover-toggle/
// @version      1.0.0
// @description  Notion's Sidebar can be annoying, when working side by side with other windows. This code inserts a button that allows disabling the edge hover mechanism.
// @author       MauriceArikoglu
// @match        https://www.notion.so/*
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at document-idle
// ==/UserScript==

(function() {
  'use strict';
  
  //set global constants
  const hoverEnabledSVG = '<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="display: block; flex-shrink: 0;" fill="none" stroke="rgba(55, 53, 47, 0.8)"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>';
  const hoverDisabledSVG = '<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="display: block; flex-shrink: 0;" fill="none" stroke="rgba(55, 53, 47, 0.8)"><g><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7,11.5l0,2.5m0,-2.5l0,-6a1.5,1.5 0 1 1 3,0m-3,6a1.5,1.5 0 0 0 -3,0l0,2a7.5,7.5 0 0 0 15,0l0,-5a1.5,1.5 0 0 0 -3,0m-6,-3l0,5.5m0,-5.5l0,-1a1.5,1.5 0 0 1 3,0l0,1m0,0l0,5.5m0,-5.5a1.5,1.5 0 0 1 3,0l0,3m0,0l0,2.5" id="svg_1"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21,21c-5.66667,-6 -12.33333,-12 -18,-18" id="svg_2"/></g></svg>';

  const hoverBackgroundColor = "rgba(55, 53, 47, 0.08)";
  const toggleButtonCSS = "border: none; border-radius: 3px; color: white; padding: 2px; margin-right: 12px; text-align: center; font-size: 16px; transition: 0.3s; display: inline-block; text-decoration: none; cursor: pointer;";
  
  const notionSidebarClassName = ".notion-sidebar";
  const notionTopbarClassName = ".notion-topbar";
  const notionScrollerClassName = ".notion-scroller";

  //set global variables
  let newToggleButton;
 
  let notionSidebar;
  let notionTopbar;
  let notionScroller;
  
  let hoverEnabledState = true;    
    
  function updateUI() {
    // Only state combination I observed to be working for hiding the Notion Sidebar when hovering over the edge
    if (
      notionScroller.style["pointer-events"] !== "none" && 
      notionSidebar.style["pointer-events"] === "none" &&
      !hoverEnabledState
    ) {
      
      // Keeps Notion's Sidebar hidden, when hovering over the app edge
      notionSidebar.style.visibility = "hidden";
      
    } else {
      
      // Makes Notion's Sidebar visible if the Sidebar is explicitly open
      notionSidebar.style.visibility = "visible";
    }
  }
  
  function updateToggleButtonAppearance() {
    newToggleButton.innerHTML = hoverEnabledState ? hoverEnabledSVG : hoverDisabledSVG;    
  }
  
  function toggleHoverEnabledState() {
    hoverEnabledState = !hoverEnabledState;
    updateUI();
    updateToggleButtonAppearance();
  };
  
  function addHoverEffect(element) {
    element.onmouseover = function () {
      this.style.backgroundColor = hoverBackgroundColor;
    }
    
    element.onmouseout = function () {
      this.style.backgroundColor = "transparent";
    }
  }
  
  function addElements() {    
    // Create Hover Toggle Button
    newToggleButton = document.createElement("div");
    newToggleButton.style.cssText = toggleButtonCSS;
    newToggleButton.onclick = toggleHoverEnabledState;
    
    updateToggleButtonAppearance();
    addHoverEffect(newToggleButton);
      
    // Add Hover Toggle Button to Topbar
    notionTopbar.insertBefore(newToggleButton, notionTopbar.firstChild);
  };
  
  function setVariables() {
    notionSidebar = document.querySelector(notionSidebarClassName);
    notionScroller = document.querySelector(notionScrollerClassName);
    notionTopbar = document.querySelector(notionTopbarClassName).firstChild;        
  };
  
  function main() {
    setVariables();
    addElements();
    
    // Observe changes in document body
    VM.observe(document.body, updateUI);
  }

  function waitForTopbar() {
    waitForKeyElements(notionTopbarClassName, main);
  };
  
  function waitForScroller() {
    waitForKeyElements(notionScrollerClassName, waitForTopbar);
  };
  
  function waitForSidebar() {
    waitForKeyElements(notionSidebarClassName, waitForScroller);
  };
  
  function init() {
    waitForSidebar();
  }

  init();
  
})();
