import _ from 'lodash';
import Promise from 'bluebird';
import layout from '../mock/layout';
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

export function getLayout({
  storyId,
  sectionIds,
}) {
  const lgs = layout[storyId];
  return Promise.resolve(_.filter(lgs, lg => _.includes(sectionIds, lg.i)));
}

export function setLayout() {
  return Promise.resolve();
}
