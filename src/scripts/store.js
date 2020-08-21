/* eslint-disable quotes */
import bookmark from './bookmark';
import $ from 'jquery';

const bookmarks = [];
const editAdd ={
  edit: false,
  add: false
};
const filterValue = 1;
const detailed = false;
const findById = function (id) {
  return bookmarks.find(currentItem => {
    return currentItem.id === id;
  });
};

const findFocusedItem = function () {
  //console.log('trying to find this item with id of', id);
  return bookmarks.find(currentItem => currentItem.focused === true);
};

const findEditItem = function () {
  return bookmarks.find(currentBookmark => currentBookmark.edit === true);
};

const addBookmark = function (currentBookmark) {
  try {
    this.bookmarks.push(bookmark.create(currentBookmark));
  } catch (e) {
    console.log(e.message);
  }
};

const findAndToggleFocused = id => {
  //console.log("Before we find the bookmark, using", id);
  //console.log(id);
  const currentBookmark = findById(id);
  currentBookmark.focused = !currentBookmark.focused;
};

const findAndToggleEdit = id => {
  const currentBookmark = findById(id);
  currentBookmark.edit = !currentBookmark.edit;
};

const findAndUpdateName = function (id, name) {
  try {
    bookmark.validateName(name);
    const currentItem = this.findById(id);
    currentItem.name = name;
  } catch (e) {
    console.log('Cannot update name: ' + e.message);
  }
};

const findAndDelete = function (id) {
  //console.log(`${id} in find and delete`);
  this.bookmarks = this.bookmarks.filter(currentItem => {
    return currentItem.id !== id;
  });
};

const resetEditOrAddStatus = () =>{
  editAdd.add = false;
  editAdd.edit = false;
};

export default {
  detailed,
  bookmarks,
  editAdd,
  filterValue,
  findById,
  findFocusedItem,
  findEditItem,
  addBookmark,
  findAndToggleFocused,
  findAndToggleEdit,
  resetEditOrAddStatus,
  findAndUpdateName,
  findAndDelete,
};
