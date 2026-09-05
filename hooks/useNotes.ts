import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query';
import { fetchNotes, createNote, deleteNote, fetchNoteById } from '@/lib/api';
import type { NoteTag, NewNote } from '../types/note';

export function useNotes(search: string = '', page: number = 1, tag?: NoteTag) {
    return useQuery({
        queryKey: ['notes', search, page, tag ?? ''],
        queryFn: () => fetchNotes(search, page, tag),
        placeholderData: keepPreviousData,
    });
}

export function useCreateNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newNote: NewNote) => createNote(newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
}

export function useDeleteNote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => deleteNote(noteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
}

export function useSingleNote(noteId: string = '') {
    return useQuery({
        queryKey: ['note', noteId],
        queryFn: () => fetchNoteById(noteId),
        enabled: Boolean(noteId),
    });
}
