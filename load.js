import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import {PaperControls} from './paper_controls';
import * as ud from 'ud';

const rootEl = document.getElementById('root');
const data = ud.defonce(module, () => ({}));

const Area = ({main, error}) => (
  <div style={{}}>
    <div style={{width: '250px', float: 'left'}}>
      <PaperControls
        papers={data.papers}
        selectedPaper={data.selectedPaper}
        selectedBlock={data.selectedBlock}
        onPaper={loadPaper}
        onBlock={loadBlock}/>
    </div>
    <div style={{marginLeft: '250px'}}>
      {error? <ReadBox error={error}/> : main}
    </div>
  </div>
);

function renderArea() {
  if (data.error) {
    const area = <Area error={data.error} />;
    ReactDOM.render(area, rootEl);
    return;
  }

  let main = (<p>There is no blocks yet!</p>);
  const paper = data.papers[data.selectedPaper];
  if (paper) {
    const block = data.papers[data.selectedPaper][data.selectedBlock];
    if (block) {
      try {
        main = block();
      } catch(ex) {
        data.error = ex;
        renderArea();
        return;
      }
    }
  }

  const area = <Area main={main} />;
  ReactDOM.render(
    area,
    rootEl
  )
}

function loadPaper(paper) {
  data.selectedPaper = paper;
  data.selectedBlock = Object.keys(data.papers[paper])[0];
  renderArea();
}

function loadBlock(block) {
  data.selectedBlock = block;
  renderArea();
}

export function renderMain(papers) {
  data.error = null;
  data.papers = papers;

  data.selectedPaper =
    (papers[data.selectedPaper])? data.selectedPaper : Object.keys(papers)[0];

  if (data.selectedPaper) {
    const paper = papers[data.selectedPaper];
    data.selectedBlock =
      (paper[data.selectedBlock])? data.selectedBlock : Object.keys(paper)[0];
  }

  renderArea();
};

export const renderError = (e) => {
  data.error = e;
  renderArea();
};

export function getRoot() {
  return rootEl;
}

export function renderContent(comp) {
  ReactDOM.render(
    comp,
    rootEl
  )
}