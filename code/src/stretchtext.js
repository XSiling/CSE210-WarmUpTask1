"use strict";

/**
 * A class for creating expandable/collapsible text summaries.
 * @class
 */
class StretchText {
  /**
   * Create a StretchText instance
   */
  constructor() {
    // Initialize default titles for open and closed states.
    this.TITLE_WHEN_CLOSED = "Expand";
    this.TITLE_WHEN_OPEN = "Collapse";

    // Bind the toggleSummary method to the current instance to ensure 'this' refers to the class.
    this.toggleSummary = this.toggleSummary.bind(this);

    // Initialize the StretchText instance by setting up event listeners for summaries.
    this.init();
  }

  /**
   * Initialize the StretchText instance by setting up event listeners for summaries.
   */
  init() {
    // Add an event listener for when the DOM is fully loaded.
    document.addEventListener("DOMContentLoaded", () => {
      // Find and set up each summary element on the page.
      this.getSummaries().forEach((summary) => {
        this.setupSummary(summary);
      });
    });
  }

  /**
   * Set up event listeners and attributes for a summary element.
   * @param {HTMLElement} summary - The summary element to set up.
   */
  setupSummary(summary) {
    // Set default 'title' attribute for the summary element.
    summary.setAttribute("title", this.TITLE_WHEN_CLOSED);

    // Add event listeners for various interactions.
    summary.addEventListener("mousedown", this.toggleSummary);
    summary.addEventListener("touchstart", this.toggleSummary);

    // Prevent default click behavior (e.g., following a link).
    summary.addEventListener("click", (e) => e.preventDefault());
  }

  /**
   * Request animation frame using a cross-browser compatible method.
   * @param {function} callback - The callback function to be executed in the animation frame.
   * @returns {number} The request ID for the animation frame.
   */
  requestAnimationFrame(callback) {
    // Use most suitable available requestAnimationFrame function.
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      (cb => window.setTimeout(cb, 1000 / 60))
    )(callback);
  }

  /**
   * Toggle the summary's open/close state.
   * @param {Event} evt - The event object.
   */
  toggleSummary(evt) {
    evt.preventDefault();
    
    const summary = evt.target;
    const detail = this.findDetailFor(summary);
    
    if (!detail) return;

    // Determine whether the detail should be displayed as 'block' or 'inline'.

    const shouldDisplay = summary.classList.contains("stretchtext-open")
      ? "none"
      : this.isBlockLevelDetail(summary) ? "block" : "inline";
    detail.style.display = shouldDisplay;

    // Change display style and update the title in an animation frame.
    this.requestAnimationFrame(() => {
      summary.classList.toggle("stretchtext-open");
      detail.classList.toggle("stretchtext-open");
      const title = summary.classList.contains("stretchtext-open")
        ? this.TITLE_WHEN_OPEN
        : this.TITLE_WHEN_CLOSED;
      this.setTitle(summary, title);
    });
    

  }

  /**
   * Check if the summary represents a block-level detail.
   * @param {HTMLElement} summary - The summary element to check.
   * @returns {boolean} True if the summary represents a block-level detail, false otherwise.
   */
  isBlockLevelDetail(summary) {
    // Determine if the summary element is a block-level detail (e.g., an anchor 'a' element).
    return summary.nodeName.toLowerCase() === "a";
  }

  /**
   * Set the title attribute of a summary element.
   * @param {HTMLElement} summary - The summary element to set the title for.
   * @param {string} title - The title text to set.
   */
  setTitle(summary, title) {
    // Set the 'title' attribute for the summary element if it doesn't already exist.
    if (!summary.hasAttribute("title")) {
      summary.setAttribute("title", title);
    }
  }

  /**
   * Find the detail element associated with a summary.
   * @param {HTMLElement} summary - The summary element for which to find the detail.
   * @returns {HTMLElement | null} The detail element if found, or null if not found.
   */
  findDetailFor(summary) {
    if (this.isBlockLevelDetail(summary)) {
      // For block-level details (e.g., anchor links), find the detail by ID.
      const id = summary.getAttribute("href").replace(/^#/, "");
      const detail = document.getElementById(id);
      if (!detail)
        console.error(`No StretchText details element with ID: ${id}`);

      return detail;
    } else {
      // For other summary elements, find the next sibling element.
      const detail = summary.nextElementSibling;
      if (!detail)
        console.error("No StretchText details element found for: ", summary);
      return detail;
    }
  }

  /**
   * Get an array of summary elements on the page.
   * @returns {HTMLElement[]} An array of summary elements.
   */
  getSummaries() {
    // Retrieve summary elements by their 'epub-type' attribute or class name.
    return [
      ...document.querySelectorAll('[epub-type="stretchsummary"]'),
      ...document.getElementsByClassName("stretchsummary"),
    ];
  }
}

new StretchText();
module.exports = StretchText;