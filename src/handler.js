const {nanoid} = require('nanoid');
const books = require('./bookshelfs');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    const newBookshelf = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if(!name){
        const response = h.response({
            status : 'fail',
            message : 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status : 'fail',
            message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    books.push(newBookshelf);

    const isSuccess = books.filter((bookshelf) => bookshelf.id === id).length > 0;

    if (isSuccess){
        const response = h.response({
            status : 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId : id,
            }
        });
        response.code(201);
        return response;
    } else {
        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    }

};

const getAllBookHandler = (request, h) => {
    const book = books.map(({id, name, publisher}) => ({ id, name, publisher }));
    const { name, reading, finished } = request.query;

    if(name !== undefined){
        const response = h.response({
            status : 'success',
            data : {
                books: books
                    .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
                    .map((n) => ({
                        id : n.id,
                        name : n.name,
                        publisher : n.publisher,
                    }))
            },
        });
        response.code(200);
        return response;
    }

    if(reading == 1){
        const response = h.response({
            status : 'success',
            data : {
                books: books
                    .filter((book) => book.reading === true)
                    .map((n) => ({
                        id : n.id,
                        name : n.name,
                        publisher : n.publisher,
                    }))
            },
        });
        response.code(200);
        return response;
    }

    if(reading == 0){
        const response = h.response({
            status : 'success',
            data : {
                books: books
                    .filter((book) => book.reading === false)
                    .map((n) => ({
                        id : n.id,
                        name : n.name,
                        publisher : n.publisher,
                    }))
            },
        });
        response.code(200);
        return response;
    }

    if(finished == 1){
        const response = h.response({
            status : 'success',
            data : {
                books: books
                    .filter((book) => book.finished === true)
                    .map((n) => ({
                        id : n.id,
                        name : n.name,
                        publisher : n.publisher,
                    }))
            },
        });
        response.code(200);
        return response;
    }

    if(finished == 0){
        const response = h.response({
            status : 'success',
            data : {
                books: books
                    .filter((book) => book.finished === false)
                    .map((n) => ({
                        id : n.id,
                        name : n.name,
                        publisher : n.publisher,
                    }))
            },
        });
        response.code(200);
        return response;
    }

    if(books){
        return {
            status : 'success', 
            data : {
                books : book,
            },
        }
    }
}

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined){
        return {
            status : 'success',
            data : {
                book,
            },
        };
    } else {
        const response = h.response({
            status : 'fail',
            message : 'Buku tidak ditemukan'
        });
        response.code(404);
        return response;
    }
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    if(!name){
        const response = h.response({
            status : 'fail',
            message : 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status : 'fail',
            message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if(index !== -1){
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if(index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status : 'success',
            message : 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const findByNameHandler = (request, h) => {
    const { name } = request.query;

    
};

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }