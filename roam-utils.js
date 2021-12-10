/**
 * Modified version of https://davidbieber.com/snippets/2021-02-12-javascript-functions-for-inserting-blocks-in-roam/
 */

/**
 * @param   {number}  ms
 *
 * @return  {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param   {string}  page  the title of the page.
 *
 * @return  {string}  uuid of the page
 */
export function getPage(page) {
  let results = window.roamAlphaAPI.q(
    `
    [:find ?uid
     :in $ ?title
     :where
     [?page :node/title ?title]
     [?page :block/uid ?uid]
    ]`,
    page
  );
  if (results.length) {
    return results[0][0];
  }
}

/**
 * @param   {string}  page  the title of the page.
 *
 * @return  {string}  uuid of the page
 */
export async function getOrCreatePage(page) {
  roamAlphaAPI.createPage({ page: { title: page } });
  let result;
  while (!result) {
    await sleep(25);
    result = getPage(page);
  }
  return result;
}

/**
 * @param   {string}  page   the title of the page.
 * @param   {string}  block  the text of the block
 *
 * @return  {string}  uuid of the block
 */
export function getBlockOnPage(page, block) {
  let results = window.roamAlphaAPI.q(
    `
    [:find ?block_uid
     :in $ ?page_title ?block_string
     :where
     [?page :node/title ?page_title]
     [?page :block/uid ?page_uid]
     [?block :block/parents ?page]
     [?block :block/string ?block_string]
     [?block :block/uid ?block_uid]
    ]`,
    page,
    block
  );
  if (results.length) {
    return results[0][0];
  }
}

/**
 * @param   {string}  page   the title of the page.
 * @param   {string}  block  the text of the block
 * @param   {[type]}  order  (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
 *
 * @return  {string}  uuid of the created block
 */
export async function createBlockOnPage(page, block, order) {
  let page_uid = getPage(page);
  return createChildBlock(page_uid, block, order);
}

/**
 * @param   {string}  page   the title of the page.
 * @param   {string}  block  the text of the block
 * @param   {[type]}  order  (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
 *
 * @return  {string}  uuid of the created block
 */
export async function getOrCreateBlockOnPage(page, block, order) {
  let block_uid = getBlockOnPage(page, block);
  if (block_uid) return block_uid;
  return createBlockOnPage(page, block, order);
}

/**
 * @param   {string}  parent_uid  parent block's uuid
 * @param   {string}  block       the text of the block
 *
 * @return  {string}  uuid of the child block
 */
export function getChildBlock(parent_uid, block) {
  // returns the uid of a specific child block underneath a specific parent block.
  // _parent_uid_: the uid of the parent block.
  // _block_: the text of the child block.
  let results = window.roamAlphaAPI.q(
    `
    [:find ?block_uid
     :in $ ?parent_uid ?block_string
     :where
     [?parent :block/uid ?parent_uid]
     [?block :block/parents ?parent]
     [?block :block/string ?block_string]
     [?block :block/uid ?block_uid]
    ]`,
    parent_uid,
    block
  );
  if (results.length) {
    return results[0][0];
  }
}

/**
 * @param   {string}  parent_uid  parent block's uuid
 * @param   {string}  block       the text of the block
 * @param   {[type]}  order       (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
 *
 * @return  {string}  uuid of the child block
 */
export async function getOrCreateChildBlock(parent_uid, block, order) {
  let block_uid = getChildBlock(parent_uid, block);
  if (block_uid) return block_uid;
  return createChildBlock(parent_uid, block, order);
}

/**
 * @param   {string}  parent_uid  parent block's uuid
 * @param   {string}  block       the text of the block
 * @param   {[type]}  order       (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
 *
 * @return  {string}  uuid of the child block
 */
export async function createChildBlock(parent_uid, block, order) {
  if (!order) {
    order = 0;
  }
  window.roamAlphaAPI.createBlock({
    location: { "parent-uid": parent_uid, order: order },
    block: { string: block },
  });
  let block_uid;
  while (!block_uid) {
    await sleep(25);
    block_uid = getChildBlock(parent_uid, block);
  }
  return block_uid;
}
