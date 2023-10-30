const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const StretchText = require('../src/stretchtext');


describe('StretchText Functions', () => {
  let stretchTest;

  stretchTest = new StretchText();
    async function loadHTMLFromFile() {
      try {
        const dom = await JSDOM.fromFile('stretch_test.html');
        const window = dom.window;
        const document = window.document;
      } catch (error) {
        console.error('Error loading HTML:', error);
      }
    }

  loadHTMLFromFile();

  describe('setTitle', () => {
    it('should set the title attribute to "Expand" if not already set', () => {
      const summary = document.createElement('div');
      stretchTest.setTitle(summary, 'Expand'); 
      expect(summary.getAttribute('title')).to.equal('Expand');
    });

    it('should not change the title attribute if already set', () => {
      const summary = document.createElement('div');
      summary.setAttribute('title', 'Custom Title');
      stretchTest.setTitle(summary, 'Expand');
      expect(summary.getAttribute('title')).to.equal('Custom Title');
    });
  });
  

  describe('isBlockLevelDetail', () => {
    it('should return true for "a" element', () => {
      const summary = document.createElement('a');
      const result = stretchTest.isBlockLevelDetail(summary);
      expect(result).to.be.true;
    });

    it('should return false for non-"a" element', () => {
      const summary = document.createElement('div');
      const result = stretchTest.isBlockLevelDetail(summary);
      expect(result).to.be.false;
    });
  });


  describe('toggleSummary', () => {
    it('should toggle summary and detail classes', async () => {
      const summary = document.getElementsByClassName("stretchsummary")[0];
    
      const evt = {
        preventDefault: () => {},
        target: summary,
      };
    
      stretchTest.toggleSummary(evt);

      await new Promise(r => setTimeout(r, 200));
      expect(summary.classList.contains('stretchtext-open')).to.be.true;
      stretchTest.toggleSummary(evt);
      await new Promise(r => setTimeout(r, 200));
      expect(summary.classList.contains('stretchtext-open')).to.be.false;
    });
  });

});
