/* eslint-disable quotes */
import bookmark from './bookmark';

const bookmarks = [];
const editAdd = {
  edit: false,
  add: false
};
const filterValue = 1;
const detailed = false;
const error = false;
const errorMessage = "";
let errorPlaceHolder = {
  title: "",
  desc: "",
  url: "",
  rating: "",
};


const findById = function (id) {
  return this.bookmarks.find(currentItem => currentItem.id === id);
};

const findFocusedItem = function () {
  //console.log('trying to find this item with id of', id);
  return this.bookmarks.find(currentItem => currentItem.focused === true);
};

const findInlineEditItem = function () {
  return this.bookmarks.find(currentBookmark => currentBookmark.inlineEdit === true);
};

const findAndToggleFocused = function(id) {
  //console.log(this.bookmarks);
  const currentBookmark = this.findById(id);
  currentBookmark.focused = !currentBookmark.focused;
};

const findAndToggleInlineEdit = function(id) {
  const currentBookmark = this.findById(id);
  currentBookmark.inlineEdit = !currentBookmark.inlineEdit;
};


const findAndUpdateName = function (id, name) {
  //console.log(`Trying to replace id:${id}, with title: ${name}`);
  const currentItem = this.findById(id);
  //console.log(currentItem);
  Object.assign(currentItem, name);
};
const addBookmark = function (currentBookmark) {
  try {
    //console.log(`Adding this to the local store`, currentBookmark);
    this.bookmarks.push(bookmark.create(currentBookmark));
    //console.log(`This is the new store`, this.bookmarks);
  } catch (e) {
    console.log(e.message);
  }
};
const findAndDelete = function (id) {
  //console.log(`${id} in find and delete`);
  this.bookmarks = this.bookmarks.filter(currentItem => {
    return currentItem.id !== id;
  });
};
const resetErrorPlaceHolder = ()=>{
  errorPlaceHolder = {
    title: "",
    desc: "",
    url: "",
    rating: "",
  };
};
const resetEditOrAddStatus = () => {
  editAdd.add = false;
  editAdd.edit = false;
};

export default {
  detailed,
  bookmarks,
  editAdd,
  filterValue,
  error,
  errorPlaceHolder,
  errorMessage,
  findById,
  findFocusedItem,
  addBookmark,
  findAndToggleFocused,
  resetEditOrAddStatus,
  findAndUpdateName,
  findAndToggleInlineEdit,
  findInlineEditItem,
  resetErrorPlaceHolder,
  findAndDelete,
};
