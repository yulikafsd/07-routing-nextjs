'use client';

/* Libs */
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';

/* Components */
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loading from '@/app/loading';

/* Types and services */
import { useNotes } from '@/hooks/useNotes';
import type { Note, NoteTag } from '@/types/note';

/* Styles */
import css from '@/app/notes/NotesPage.module.css';

interface NotesClientProps {
    tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { data, isFetching, isError } = useNotes(search, currentPage, tag);

    const notes: Note[] = data?.notes || [];
    const totalPages: number = data?.totalPages || 0;
    const hasPages = totalPages > 1;

    const isNoSearchResults =
        !isFetching &&
        !isError &&
        Boolean(data) &&
        notes.length === 0 &&
        search.trim() !== '';

    const isEmptyList = !isFetching && !isError && notes.length === 0;

    const handleSearchChange = useDebouncedCallback((newSearch: string) => {
        if (newSearch.length > 0 && newSearch.trim() === '') {
            toast.error('Search query cannot contain only spaces.', {
                id: 'empty-search-error',
            });
            return;
        }

        setSearch(newSearch);
        setCurrentPage(1);
    }, 300);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (isNoSearchResults) {
            toast.error('No notes found for your request.', {
                id: 'no-notes',
            });
        }
    }, [isNoSearchResults]);

    return (
        <div className={css.app}>
            <Toaster position="top-right" />
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={handleSearchChange} />
                {isFetching ? (
                    <Loading />
                ) : (
                    hasPages && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={(page: number) =>
                                setCurrentPage(page)
                            }
                        />
                    )
                )}
                <button
                    type="button"
                    className={css.button}
                    onClick={openModal}
                >
                    Create note +
                </button>
            </header>

            {isError && (
                <ErrorMessage
                    message={'There was an error, please try again...'}
                />
            )}
            {!isFetching &&
                !isError &&
                (isEmptyList ? (
                    <ErrorMessage
                        message={
                            search.trim()
                                ? 'No notes found'
                                : 'There are no notes yet'
                        }
                    />
                ) : (
                    <NoteList notes={notes} />
                ))}
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>
            )}
        </div>
    );
}
