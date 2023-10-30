"use strict";

class StretchText {
  constructor() {
    this.TITLE_WHEN_CLOSED = "Expand";
    this.TITLE_WHEN_OPEN = "Collapse";
    this.toggleSummary = this.toggleSummary.bind(this);
    this.init();
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.getSummaries().forEach((summary) => {
        this.setupSummary(summary);
      });
    });
  }

  setupSummary(summary) {
    summary.setAttribute("title", this.TITLE_WHEN_CLOSED);
    summary.addEventListener("mousedown", this.toggleSummary);
    summary.addEventListener("touchstart", this.toggleSummary);
    summary.addEventListener("click", (e) => e.preventDefault());
  }

  requestAnimationFrame(callback) {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      (cb => window.setTimeout(cb, 1000 / 60))
    )(callback);
  }

  toggleSummary(evt) {
    evt.preventDefault();
    
    const summary = evt.target;
    const detail = this.findDetailFor(summary);
    
    if (!detail) return;


    const shouldDisplay = summary.classList.contains("stretchtext-open")
      ? "none"
      : this.isBlockLevelDetail(summary) ? "block" : "inline";
    detail.style.display = shouldDisplay;

    this.requestAnimationFrame(() => {
      summary.classList.toggle("stretchtext-open");
      detail.classList.toggle("stretchtext-open");
      const title = summary.classList.contains("stretchtext-open")
        ? this.TITLE_WHEN_OPEN
        : this.TITLE_WHEN_CLOSED;
      this.setTitle(summary, title);
    });
    

  }

  isBlockLevelDetail(summary) {
    return summary.nodeName.toLowerCase() === "a";
  }

  setTitle(summary, title) {
    if (!summary.hasAttribute("title")) {
      summary.setAttribute("title", title);
    }
  }

  findDetailFor(summary) {
    if (this.isBlockLevelDetail(summary)) {
      const id = summary.getAttribute("href").replace(/^#/, "");
      const detail = document.getElementById(id);
      if (!detail)
        console.error(`No StretchText details element with ID: ${id}`);

      return detail;
    } else {
      const detail = summary.nextElementSibling;
      if (!detail)
        console.error("No StretchText details element found for: ", summary);
      return detail;
    }
  }

  getSummaries() {
    return [
      ...document.querySelectorAll('[epub-type="stretchsummary"]'),
      ...document.getElementsByClassName("stretchsummary"),
    ];
  }
}

new StretchText();
module.exports = StretchText;