/* eslint-disable quotes */
/* eslint-disable indent */
import store from './store';
import api from './api';
import $ from 'jquery';

const generateBookmarkHTML = () => {
    let bookmarkList = [];
    store.bookmarks.forEach(bookmark => {
        //If the bookmark is biger than the filter push it into the array.
        if (bookmark.rating >= store.filterValue) {
            bookmarkList.push(
                    generateBookmarkbodyHTML(bookmark)
            );
        }
    });
    return bookmarkList;
};
const generateBookmarkbodyHTML = (bookmark) => {
    let bookmarkDetails = generateDetailedBookmarkHTML(bookmark);
    if(store.detailed && bookmark.focused){
        return`<div class="bookmarkDetails">
        ${bookmarkDetails}
        </div>`;
    }else{
        return `
        <div class="bookmark inList" id=${bookmark.id}>
            <div class="more">
                <i class="fas fa-angle-down"></i>
            </div>
            <h4>${bookmark.title}</h4>
            <div class="rating-box">
                ${generateBookmarkRatings(bookmark)}
            </div>
        </div>`;
    }
};
const generateStartScreenHTML = () => {
    let bookmarkList = generateBookmarkHTML();
    let filterOptions = [];
    for (let i = 1; i <= 5; i++) {
        filterOptions.push(`<option value="${i}">${i}+ Stars</option>`);
    }
    return `
    <div class="title-section">
        <h3>My Bookmarks</h3>
    </div>
    <div class="filterNAdd">
        <div id="filter-box">
                <form>
                    <label for="filter">Filter By:</label>
                    <select>
                    ${filterOptions.join(" ")}
                    </select>
                </form>
                </div>
                    <h3 id="plus">+</h3>
                </div>
                <div class="bookmark-list">
                    ${bookmarkList.join(" ")}
                </div>
    `;
};
const generateDetailedBookmarkHTML = (bookmark) => {
    //console.log(focusedBookmark);
    //Decepcradted cause no modal
    // if (store.detailed) {
    //     //Reset its focus back, so we can have new focused!
    //     let focusedBookmark = store.findFocusedItem();
    //     store.findAndToggleFocused(focusedBookmark.id);
    // }
    return `
            <div id="${bookmark.id}" class="bookmark detailedBookmark">
                    <div class="focusedBookmarkTitle">
                        <h3 class="bookMark-title">${bookmark.title}<span class="inline-edit"><i class="fas fa-pencil-alt"></i></span></h3>
                        <div class="more">
                            <i class="fas fa-angle-down"></i>
                        </div>
                    </div>
                    <div class="focusedBookmarkContent">
                        <div class="rating-box">
                            ${generateBookmarkRatings(bookmark)}
                        </div>
                        <div class="visit-box">
                            <a href="${bookmark.url}" target="_blank">Visit Site</a>
                        </div>
                        <p>${bookmark.desc}</p>
                    </div>
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
            </div>
    `;
};

const generateBookmarkRatings = (bookmark) => {
    let bookMarkRatings = [];
    //console.log(`This site`);
    for (let i = 0; i < bookmark.rating; i++) {
        bookMarkRatings.push(`
            <i class="fas fa-smile-wink"></i>
            `);
    }
    return bookMarkRatings.join(" ");
};

const generalRatings = () => {
    let html = [];
    for(let i = 0; i <= 5; i++){
            html.push(`
            <div class="radio-buttons">  
            <input type="radio" name="rating" id="rating${i}" value="${i}">
                <span><i class="fas fa-smile-wink"></i></span>
                <span>${i}</span>
            </div>`);
    }
    return html.join(" ");
};

const generateAddEditBookmarkHTML = () => {
    let title = "";
    let description = "";
    let url = "";
    let finalButton = "Create";
    let ratings = generalRatings();
    //if we enter from a expanded view reset 
    //Original
    store.detailed = false;
    if (store.editAdd.edit) {
        let currentEditItem = store.findEditItem();
        console.log(`We are going to edit an item`);
        title = currentEditItem.title;
        description = currentEditItem.desc;
        url = currentEditItem.url;
        finalButton = "Edit";
        ratings = changeEditScreenRating();
        //console.log(url);
    }
    return `
    <div class="book-mark-edit-screen">
                <div class="title-section-edit">
                    <h3>My Bookmarks</h3>
                </div>

                <form id="bookmarkData" class="content" name="bookmarkData">
                <label for="url">URL:</label>
                <input type="text" name="url" id="url" placeholder="Add your link here" value="${url}">
                <label for="title">Site Title:</label>
                <input type="text" name="title" id="title" placeholder="Add your title here" value="${title}">
                <Label for="rating">Rating:
                ${ratings}
                </Label>
                <textarea name="desc" id="bookmark-description" cols="25" rows="10" placeholder="Add your description here....">${description}</textarea>
                <div>
                    <button class="cancel-button">Cancel</button>
                    <button type="submit" value="Submit!">${finalButton}</button>
                </div>
                </form>
            </div>
    `;
};

const renderAddEditBookmarkScreen = () => {
    let html = generateAddEditBookmarkHTML();
    $(`main`).html(html);
};

const renderStartScreen = () => {
    let html = generateStartScreenHTML();
    $('main').html(html);
};

const changeEditScreenRating = () => {
    let bookmark = store.findEditItem();
    let html = [];
    for(let i = 0; i <= 5; i++){
        if(bookmark.rating === i){
            html.push(`
            <div class="radio-buttons">  
            <input type="radio" name="rating" id="rating${i}" value="${i}" checked="checked">
                <span><i class="fas fa-smile-wink"></i></span>
                <span>${i}</span>
            </div>`);
        }
        else {
            html.push(`
            <div class="radio-buttons">  
            <input type="radio" name="rating" id="rating${i}" value="${i}">
                <span><i class="fas fa-smile-wink"></i></span>
                <span>${i}</span>
            </div>`);
        }
    }
    return html.join(' ');
};

const returnValuesFromError = (bookmarkData) => {
    console.log("adding old values from error");
    $(`main form #title`).attr('value', bookmarkData.title);
    $(`main form #url`).attr('value', bookmarkData.url);
    $(`main form #rating${bookmarkData.rating}`).attr('checked', true);
    $(`main form #desc`).attr('desc', bookmarkData.desc);

};

const render = function () {
    console.log("re-rendering");
    //console.log(store.bookmarks);
    //console.log(`HEY , EDIT VALUE${store.editAdd.edit}`);
    if (store.editAdd.add || store.editAdd.edit) {
        renderAddEditBookmarkScreen();
        if (store.editAdd.edit) {
            //When it's at the edit screen, checks the correct rating intially!
            let bookmark = store.findEditItem();
            bookmark.edit = !bookmark.edit;
        }
    } else {
        renderStartScreen();
        // Change the filter to the "selected" value
        $(`main select option[value=${store.filterValue}]`).attr('selected', true);
    }
};

/**---------------------------------------------Handlers And Stuff Below ------------------------------------*/

const handleNewBookmark = function () {
    $(`main`).on('click', '#plus', () => {
        store.editAdd.add = true;
        render();
    });
};

const handleBookMarkDetails = function () {
        $(`main`).on(`click`, `div.more`, (event) => {
            const id = getIdFromElement(event.currentTarget);
            store.findAndToggleFocused(id);
            // //console.log("You're clicking on the bookmark!");
            store.detailed = !store.detailed;
            render();
        });
};

const handleFilter = () => {
    $(`main`).on(`change`, `select`, () => {
        let value = $(`main select`).val();
        store.filterValue = value;
        render();
    });
};

const getIdFromElement = function (item) {
    //console.log(item);
    return $(item).closest('div.bookmark').attr('id');
};

const handleDeleteBookmark = function () {
    $('main').on('click', '.delete-button', event => {
        const id = getIdFromElement(event.currentTarget);
        // delete the item
        api.deleteItem(id).then(() => {
            store.findAndDelete(id);
            //Close the modal as well
            store.detailed = false;
            render();
        });
    });
};

const handleEditBookmark = function () {
    $(`main`).on('click', '.edit-button', (event) => {
        const id = getIdFromElement(event.currentTarget);
        store.editAdd.edit = true;
        store.findAndToggleEdit(id);
        render();
    });
};

const handleCancelEdit = () => {
    $(`main`).on('click', 'form .cancel-button', (event) => {
        console.log('Clicking the cancel-button');
        event.preventDefault();
        //reset the edit & add property
        if(store.detailed){
            let bookmark = store.findFocusedItem();
            bookmark.focused = !bookmark.focused;
        }
        store.resetEditOrAddStatus();
        //reset the editted bookmark
        render();
    });
};
const handleInLineEdit = () => {
    
};
const handleCreateOrEdit = () => {
    $(`main`).on('click', 'form button[type="submit"]', (event) => {
        event.preventDefault();
        //Find the Form
        let bookmarkSubmission = $(`main`).children().children()[1];
        //console.log(bookmarkSubmission);
        //Get FormData from it
        let bookmarkData = new FormData(bookmarkSubmission);
        let bookmarkDataBody = {};
        for (var pair of bookmarkData.entries()) {
            bookmarkDataBody[pair[0]] = pair[1];
        }
        //console.log(bookmarkDataBody);

        if (store.editAdd.edit) {
            //Do stuff here when patch
            //Reset Status
            store.resetEditOrAddStatus();
            //Get the data

        } else if (store.editAdd.add) {
            //Do stuff here when add
            //Get the data and send it
            api.createItem(bookmarkDataBody)
            .then((newBookmark) => {
                //Reset Status
                store.resetEditOrAddStatus();
                //grabListAgain();
                store.addBookmark(newBookmark);
                render();
            }).catch(error => {
                alert(error.message);
                render();
                //populate the forms with previous data
                returnValuesFromError(bookmarkDataBody);

            });
        }
    });
};

const bindEventListeners = function () {
    handleNewBookmark();
    handleBookMarkDetails();
    handleFilter();
    handleDeleteBookmark();
    handleEditBookmark();
    handleCancelEdit();
    handleCreateOrEdit();
};

// This object contains the only exposed methods from this module:
export default {
    render,
    bindEventListeners
};