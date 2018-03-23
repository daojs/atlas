import _ from 'lodash';
import Promise from 'bluebird';
import mockLayout from '../mock/layout';
// import { GraphQLClient } from 'graphql-request';

// const client = new GraphQLClient('/graphql');

// export function getLayout({
//   storyId,
//   sectionIds,
// }) {
//   return client.request(`query getLayout($storyId: String, $sectionIds: [String]) {
//     getLayout(storyId: $storyId, sectionIds: $sectionIds) {
//       i,
//       x,
//       y,
//       w,
//       h,
//     }
//   }`, {
//     storyId,
//     sectionIds,
//   }).then(data => data.getLayout);
// }

// export function setLayout({
//   storyId,
//   storyLayout,
// }) {
//   return client.request(`query setLayout($storyId: String, $storyLayout: [sectionLayoutInputType]) {
//     setLayout(storyId: $storyId, storyLayout: $storyLayout)
//   }
//   `, {
//     storyId,
//     storyLayout: _.map(storyLayout, sectionLayout => _.pick(sectionLayout, ['x', 'y', 'w', 'h', 'i'])),
//   });
// }

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
  return Promise.resolve(_.filter(sectionLayouts, sectionLayout => _.includes(sectionIds, sectionLayout.i)));
}

export function setLayout({
  storyId,
  storyLayout,
}) {
  layoutStore[storyId] = storyLayout;
  localStorage.setItem(storageKey, JSON.stringify(layoutStore));
  return Promise.resolve();
}
