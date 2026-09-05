'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

import Modal from '@/components/Modal/Modal';
import Loading from '@/app/loading';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import css from './NotePreview.module.css';

interface NotePreviewProps {
    id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
    const router = useRouter();

    const {
        data: note,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['note', id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    const handleClose = () => {
        router.back();
    };

    return (
        <Modal onClose={handleClose}>
            {isLoading && (
                <div className={css.loaderWrapper}>
                    <Loading />
                </div>
            )}

            {(error || (!isLoading && !note)) && (
                <ErrorMessage
                    message={
                        error instanceof Error
                            ? error.message
                            : 'Failed to load note details.'
                    }
                />
            )}

            {note && (
                <div className={css.item}>
                    <div className={css.header}>
                        <h2>{note.title}</h2>
                    </div>
                    <p className={css.tag}>{note.tag}</p>
                    <p className={css.content}>{note.content}</p>
                    <p className={css.date}>{note.createdAt}</p>
                    <button
                        type="button"
                        className={css.closeButton}
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            )}
        </Modal>
    );
}
