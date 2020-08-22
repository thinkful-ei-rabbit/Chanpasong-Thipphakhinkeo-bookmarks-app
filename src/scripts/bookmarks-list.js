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
    if (store.detailed && bookmark.focused) {
        return `<li><div class="bookmarkDetails">
        ${bookmarkDetails}
        </div></li>`;
    } else {
        return `
        <li><div class="bookmark inList" id="${bookmark.id}" tabindex="0">
            <div>
                <h3>${bookmark.title}</h3>
                <div class="rating-box">
                    ${generateBookmarkRatings(bookmark)}
                </div>
            </div>
            <div class="more" aria-pressed="false" role="expand_bookmark">
                <i class="fas fa-angle-down"></i>
            </div>
        </div></li>`;
    }
};
const generateStartScreenHTML = () => {
    let bookmarkList = generateBookmarkHTML();
    let filterOptions = [];
    for (let i = 1; i <= 5; i++) {
        filterOptions.push(`<option value="${i}">${i}+ Stars</option>`);
    }
    return `
    <div id="bookmark-appWindow">
    <div class="title-section">
        <h1>My Bookmarks</h1>
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
        <h2 id="plus">Add +</h2>
    </div>
    <ul class="bookmark-list">
        ${bookmarkList.join(" ")}
    </ul>
    </div>
    `;
};
const generateDetailedBookmarkHTML = (bookmark) => {
    let errorBox = "";
    let bookMarkTitleHead = ` 
    <div><h3 class="bookMark-title">${bookmark.title}
    <span class="inline-edit initial" aria-pressed="false"><i class="fas fa-pencil-alt"></i></span></h3></div>`;
    if(store.error){
        console.log("There's an ERROR!", store.errorMessage);
        errorBox = `<div class="errorbox">
        <p>Hey, the name can't be blank!</p>
        <span>
            (${store.errorMessage})
        </span>
        </div>`;
        bookMarkTitleHead = `<h3><input id="input-titleEdit" type="text" value="${bookmark.title}">
        <span class="inline-edit done"><i class="fas fa-pencil-alt"></i></span></h3>`;
    }
    let bookMarkDesc = "";
    if (bookmark.desc !== "") {
        bookMarkDesc = `<p>${bookmark.desc}</p>`;
    }
    return `
            <div id="${bookmark.id}" class="bookmark detailedBookmark">
                    <div class="focusedBookmarkTitle">
                            ${bookMarkTitleHead}
                        <div class="more" aria-pressed="false">
                            <i class="fas fa-angle-down"></i>
                        </div>
                    </div>
                    ${errorBox}
                    <div class="focusedBookmarkContent">
                        <div class="rating-box">
                            ${generateBookmarkRatings(bookmark)}
                        </div>
                        <div class="visit-box">
                            <a href="${bookmark.url}" target="_blank">Visit Site</a>
                        </div>
                        ${bookMarkDesc}
                    </div>
                    <!--<button class="edit-button">Edit</button>-->
                    <button class="delete-button">Delete</button>
            </div>
    `;
};

const generateBookmarkRatings = (bookmark) => {
    let bookMarkRatings = [];
    //console.log(`This site`);
    for (let i = 0; i < bookmark.rating; i++) {
        bookMarkRatings.push(`
            <i class="fas fa-leaf"></i>
            `);
    }
    return bookMarkRatings.join(" ");
};

const generalRatings = () => {
    let html = [];
    for (let i = 1; i <= 5; i++) {
        html.push(`
            <input type="radio" name="rating" id="rating${i}" value="${i}" aria-pressed="false">
                <label>${i}</label>`);
    }
    return html.join(" ");
};

const generateErrorRating = (rating) => {
    let html = [];
    //console.log(`passed into generateErrorRating`, typeof rating);
    for (let i = 1; i <= 5; i++) {
        if (i === parseInt(rating)) {
            //console.log("Found the Rating we need to check!");
            html.push(`
            <input type="radio" name="rating" id="rating${i}" value="${i}" checked="checked" aria-pressed="false">
                <label>${i}</label>
            `);
        } else {
            //console.log(`Adding default values`);
            html.push(`
            <input type="radio" name="rating" id="rating${i}" value="${i}" aria-pressed="false">
                <label>${i}</label>
            `);
        }
    }
    return html.join(" ");
};

const generateAddEditBookmarkHTML = () => {
    let title = "";
    let description = "";
    let url = "";
    let finalButton = "Create";
    let ratings = generalRatings();
    let errorBox= "";
    //let errorPlaceholder = "";
    store.detailed = false;
    // If there was an error
    if (store.error) {
        //let currentEditItem = returnValuesFromError();
        //console.log(url);
        console.log("Passed in these values from errorPlaceholder", store.errorPlaceHolder);
        title = store.errorPlaceHolder.title;
        url = store.errorPlaceHolder.url;
        description = store.errorPlaceHolder.desc;
        ratings = generateErrorRating(store.errorPlaceHolder.rating);
        errorBox = `
            <div class="errorbox-form">
                <h2>Error:</h2>
                <h3>Please Check the Title and/or URL</h3>
                <p>Details Below:<p>
                <p>(${store.errorMessage})</p>
            </div>
        `;
    }
    return `
    <div class="bookmark-appWindow-edit">
                <div class="title-section-edit">
                    <h1>My Bookmarks</h1>
                </div>
                ${errorBox}
                <form id="bookmarkData" class="content" name="bookmarkData">
                <label for="url">URL:</label>
                <input type="text" name="url" id="url" placeholder="Add your link here" value="${url}">
                <label for="title">Site Title:</label>
                <input type="text" name="title" id="title" placeholder="Add your title here" value="${title}">
                <fieldset>
                    <legend>Choose a Rating:</legend>
                    <div class="radio-buttons">
                    ${ratings}
                    </div>
                </fieldset>
                <textarea name="desc" id="bookmark-description" cols="25" rows="10" placeholder="Add your description here....">${description}</textarea>
                <div class="button-section">
                    <button class="cancel-button">Cancel</button>
                    <button type="submit" value="Submit!">${finalButton}</button>
                </div>
                </form>
            </div>
    `;
};

const generateEditTitleHTML = () => {
    let bookmark = store.findInlineEditItem();
    //console.log(`Hey we're trying to edit, editor-value`, store.editAdd.edit);
    if (store.editAdd.edit) {
        return `
        <input id="input-titleEdit" type="text" value="${bookmark.title}">
            <span class="inline-edit done"><i class="fas fa-pencil-alt"></i></span>
        `;
    } else {
        return `
        <h3>${bookmark.title}
        <span class="inline-edit done"><i class="fas fa-pencil-alt"></i></span>
        </h3>
        `;
    }
};

const renderAddEditBookmarkScreen = () => {
    let html = generateAddEditBookmarkHTML();
    $(`main`).html(html);
};

const renderStartScreen = () => {
    let html = generateStartScreenHTML();
    $('main').html(html);
};

const returnValuesFromError = (bookmarkData) => {
    console.log("adding old values from error");
    store.errorPlaceHolder.title = bookmarkData.title;
    store.errorPlaceHolder.desc = bookmarkData.desc;
    store.errorPlaceHolder.rating = bookmarkData.rating;
    store.errorPlaceHolder.url = bookmarkData.url;

};

const render = function () {
    console.log("re-rendering");
    if (store.editAdd.add) {
        renderAddEditBookmarkScreen();
    } else {
        renderStartScreen();
        // Change the filter to the "selected" value
        $(`main select option[value=${store.filterValue}]`).attr('selected', true);
    }
};

/**---------------------------------------------Handlers And Stuff Below ------------------------------------*/

const checkIfWeAreInEdit = (id = "") =>{
    let editItem = store.findInlineEditItem();
    if (store.editAdd.edit && id !== "") {
        console.log("Started editing but we expanded instead!");
        store.editAdd.edit = !store.editAdd.edit;
        //Switch the edit value off
        // console.log();
        // console.log(id);
        //Turn off the bookMarks Inline Edit Value
        store.findAndToggleInlineEdit(id);
        // editBookmark.edit = !editBookmark;
    } else if(store.editAdd.edit && editItem !== undefined){
        console.log("We were in edit but we clicked somewhere else!");
        store.editAdd.edit = !store.editAdd.edit;
        editItem.inlineEdit = !editItem.inlineEdit;
    }
};
const checkIfWeAreInAnError = () => {
    //This checks if we were to leave the error somehow, reset the view
    if(store.error){
        store.error = !store.error;
    }
};
const handleNewBookmark = function () {
    $(`main`).on('click', '#plus', () => {
        // If we are coming from detailed view
        checkIfWeAreInAnError();
        if (store.detailed) {
            console.log("Hey something is in detailed!\nReset It");
            let bookmark = store.findFocusedItem();
            bookmark.focused = !bookmark.focused;
            //turn off
            store.detailed = !store.detailed;
        }
        store.editAdd.add = true;
        render();
    });
};

/// -----------------FUNCTION FOR EXPANDER----------------------(Big because I forget where it is sometimes)--------------------
const handleEnterPressDetails = function () {
    // $(`main`).keydown( function(){
    //     // Trying to log enters...
    //     // console.log(event.which);
    //     // let pressedKey = $(event.which);
    //     // if(pressedKey === 13){
    //     //     const id = getIdFromElement(event.currentTarget);
    //     //     console.log(id);
    //     // }
    // });
};

const handleBookMarkDetails = function () {
    $(`main`).on(`click`, `div.more`, (event) => {
        checkIfWeAreInAnError();
        //Handle a prexisting expanded one.
        let previousExpandedBookmark = store.findFocusedItem();
        const id = getIdFromElement(event.currentTarget);
        if (previousExpandedBookmark !== undefined) {
            console.log("There is a previous one!");

            //if we expand from an edited item
            checkIfWeAreInEdit(id);

            //Turn off the previous one
            store.findAndToggleFocused(previousExpandedBookmark.id);
            //IF WE ARE TRYING TO TURN OF THE CURRENT ONE
            if (id === previousExpandedBookmark.id) {
                //console.log(`You're clicking to close the current one!`);
                //Close the view
                store.detailed = !store.detailed;
                //If we are trying to expand from an edit
                render();
            } else {
                //If we are turning off the first, turn this on
                //console.log(`You're clicking a new one to open`);
                store.findAndToggleFocused(id);
                render();
            }
            // render();
        } else {
            //For "new" expands
            console.log("You're clicking on to expand the bookmark!");
            store.findAndToggleFocused(id);
            store.detailed = !store.detailed;
            render();
        }
    });
};

const handleFilter = () => {
    $(`main`).on(`change`, `select`, () => {
        let value = $(`main select`).val();
        store.filterValue = value;
        checkIfWeAreInEdit();
        checkIfWeAreInAnError();
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
        checkIfWeAreInAnError();
        //Most likely it was in detailed
        if (store.detailed) {
            console.log("Hey something is in detailed!\nReset It");
            let bookmark = store.findFocusedItem();
            bookmark.focused = !bookmark.focused;
            //turn off
            store.detailed = !store.detailed;
        }
        api.deleteItem(id).then(() => {
            store.findAndDelete(id);
            render();
        });
    });
};

const handleCancelCreate = () => {
    $(`main`).on('click', 'form .cancel-button', (event) => {
        console.log('Clicking the cancel-button');
        event.preventDefault();
        //reset the edit & add property
        store.resetEditOrAddStatus();
        //Reset if we come from an error
        checkIfWeAreInAnError();
        store.error = false;
        store.resetErrorPlaceHolder();
        render();
    });
};
const handleInLineEdit = () => {
    $(`main`).on('click', '.inline-edit.initial', (event) => {
        let id = getIdFromElement(event.currentTarget);
        //Check for a previous edit in progress
        let editCheckBM = store.findInlineEditItem();
        if(editCheckBM !== undefined){
            editCheckBM.inlineEdit = !editCheckBM.inlineEdit;
        }
        //Continue with the new edit
        store.findAndToggleInlineEdit(id);
        store.editAdd.edit = true;
        let html = generateEditTitleHTML();
        $(`main .bookMark-title`).html(html);
    });
};

const handleInlineEditBookmarkDone = function () {
    //if they the button again
    $(`main`).on('click', '.inline-edit.done', (event) => {
        const id = getIdFromElement(event.currentTarget);
        //should turn it back off after we grab this time
        let value = { title: $(`main #input-titleEdit`).val() };
        api.updateItem(id, value).then(() => {
            store.editAdd.edit = false;
            let html = generateEditTitleHTML(id);
            store.findAndUpdateName(id, value);
            $(`main .bookMark-title`).html(html);
            store.findAndToggleInlineEdit(id);
            store.error = false;
            render();
        }).catch(e => {
            console.log(`Error! Display Message!`);

            store.error = true;
            store.errorMessage = e.message;
            render();
            //alert(e.message);
        });
    });
    //if they press enter
};

const handleCreate = () => {
    $(`main`).on('click', 'form button[type="submit"]', (event) => {
        event.preventDefault();
        //reset the expanded if we enter from it
        //Find the Form
        let bookmarkSubmission = $(`main`).children().children()[1];
        //console.log(bookmarkSubmission);
        //Get FormData from it
        let bookmarkData = new FormData(bookmarkSubmission);
        let bookmarkDataBody = {};
        for (let pair of bookmarkData.entries()) {
            bookmarkDataBody[pair[0]] = pair[1];
        }
        //Do stuff here when add
        //Get the data and send it
        api.createItem(bookmarkDataBody)
            .then((newBookmark) => {
                //Reset Status
                store.resetEditOrAddStatus();
                //grabListAgain();
                store.addBookmark(newBookmark);
                store.error = false;
                store.resetErrorPlaceHolder();
                render();
            }).catch(error => {
                store.error = true;
                store.errorMessage = error.message;
                returnValuesFromError(bookmarkDataBody);
                render();
                //populate the forms with previous data
            });

    });
};

const bindEventListeners = function () {
    handleNewBookmark();
    handleBookMarkDetails();
    handleFilter();
    handleDeleteBookmark();
    //handleEditBookmark();
    handleCancelCreate();
    handleCreate();
    handleInLineEdit();
    handleInlineEditBookmarkDone();
    handleEnterPressDetails();
};

// This object contains the only exposed methods from this module:
export default {
    render,
    bindEventListeners
};