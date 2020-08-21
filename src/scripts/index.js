import $ from 'jquery';
import api from './api';
import '../styles/index.css';
import bookmarkList from './bookmarks-list';
import store from './store';
const main = function () {
  api.getItems().then( bookmarks => {
    bookmarks.forEach(bookmark => store.addBookmark(bookmark));
    bookmarkList.render();
  });
  bookmarkList.bindEventListeners();
  
  //console.log(test);
};

$(main);
