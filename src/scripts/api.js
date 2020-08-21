/* eslint-disable indent */
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chanpasong';

const listApiFetch = function (...args) {
    // setup var in scope outside of promise chain
    let error;
    return fetch(...args)
        .then(myRequest => {
            if (!myRequest.ok) {
                error = { code: myRequest.status };

                // if response is not JSON type, place statusText in error object and
                // immediately reject promise
                if (!myRequest.headers.get('content-type').includes('json')) {
                    error.message = myRequest.statusText;
                    return Promise.reject(error);
                }
            }
            return myRequest.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }
            return data;
        });
};

const getItems = function () {
    return listApiFetch(`${BASE_URL}/bookmarks`);
};

const makeBody = (bookmark) => {
    return {
        "title": bookmark.title,
        "url":bookmark.url,
        "desc": bookmark.desc,
        "rating":bookmark.rating
    };
};
const createItem = function (bookmark) {
    const newBookmarkValues = makeBody(bookmark);
    return listApiFetch(`${BASE_URL}/bookmarks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBookmarkValues)
    });
};

const updateItem = function (id, updateData) {
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    });
};

const deleteItem = function (id) {
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
        method: 'DELETE'
    });
};

export default {
    getItems,
    createItem,
    updateItem,
    deleteItem
};