import $ from 'jquery';
import cuid from 'cuid';

const validateTitle = function(name) {
  if (!name) throw new TypeError('Missing Title!');
};

const create = function(bookmark) {
  return {
    id: bookmark.id,
    title: bookmark.title,
    desc: bookmark.desc,
    url:bookmark.url,
    rating: bookmark.rating,
    focused: false,
    edit: false
  };
};

export default {
  validateTitle,
  create
};