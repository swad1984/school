/**
 * @typedef {Object} StudentType
 * @property {number} count
 * @property {number[]} place
 */

/**
 * @typedef {Object.<string, StudentType>} StudentListType
 */

/**
 * @typedef {Object.<string, StudentListType>} KlassListType
 */

/**
 * @typedef {StudentType} StudentShowType
 * @property {string} name
 */

/**
 * @typedef {Object} RenderLineTypeInEdit
 * @property {function(name: string): void} click
 * @property {StudentShowType} student
 * @property {string} selected
 * @property {function(data: Object): void} save
 * @property {function(): void} cancel
 * @property {function(): void} delete
 * @property {string} over
 * @property {function(name: string): void} onOver
 * @property {string[]} places
 *
 */
