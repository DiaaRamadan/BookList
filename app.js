// Book class :: Represent a Book
class Book{
    constructor(title, auther, isbn){
        this.title = title;
        this.auther = auther;
        this.isbn = isbn;
    }
}

// Store Class :: Handle storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn){
        const books = Store.getBooks('books');
        books.forEach((book, index) => {
            if(book.isbn == isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// UI class :: Handle UI tasks
class UI{

    static displayBooks(){
        
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    } 

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = 
        `
            <th>${book.title}</th>
            <th>${book.auther}</th>
            <th>${book.isbn}</th>
            <th><ahref="#" class="btn btn-danger btn-sm delete">X</a></th>
        `;
        list.appendChild(row);
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        setTimeout(() => div.remove(), 3000);
    }

    static clearBookFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            if(confirm('Are you sure?')){
                el.parentElement.parentElement.remove();
            }
        }
    }
}

// event display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// add book
document.querySelector('#book-form').addEventListener('submit', (e) => {

    // prevent default
    e.preventDefault();
    
    // get form data
    const title = document.querySelector('#title').value;
    const auther = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // validate 
    if(title === '' || auther === '' || isbn === ''){
        UI.showAlert('Please fill all fields', 'danger');
    }else{


        // instatiate book
        const book = new Book(title, auther, isbn);

        // add book to list
        UI.addBookToList(book);

        // add book to local storage
        Store.addBook(book); 

        UI.showAlert('Book Added', 'success');

        // clear fields
        UI.clearBookFields();
    }
     
});

// Event :: delete book

document.querySelector('#book-list').addEventListener('click', (e) => {

    // remove book from ui
    UI.deleteBook(e.target);

    // Remove book from localstorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'success');

});