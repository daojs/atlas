import _ from 'lodash';
import Promise from 'bluebird';
import mockLayout from './layout';

const storageKey = 'dao-layout';

const layoutStore = (() => {
  let storage;
  try {
    storage = JSON.parse(localStorage.getItem(storageKey));
  } catch (err) {
    storage = {};
  }
  return _.defaults(storage, mockLayout);
})();

export function getLayout({
  storyId,
  sectionIds,
}) {
  const sectionLayouts = layoutStore[storyId];
  return Promise.resolve(_.filter(
    sectionLayouts,
    sectionLayout => _.includes(sectionIds, sectionLayout.i),
  ));
}

export function setLayout({
  storyId,
  storyLayout,
}) {
  layoutStore[storyId] = storyLayout;
  localStorage.setItem(storageKey, JSON.stringify(layoutStore));
  return Promise.resolve();
}
