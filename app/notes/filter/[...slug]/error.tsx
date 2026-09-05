'use client';

import css from '@/app/notes/NotesPage.module.css';

type Props = {
    error: Error;
    reset: () => void;
};

export default function Error({ error }: Props) {
    return (
        <p className={css.error}>
            Could not fetch the list of notes. {error.message}
        </p>
    );
}
