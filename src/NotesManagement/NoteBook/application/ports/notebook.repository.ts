import { Notebook } from '../../domain/notebook';

export interface NotebookRepository {
  save(notebook: Notebook): Promise<void>;
  loadById(id: string): Promise<Notebook | null>;
}

export const NotebookRepository = Symbol('NotebookRepository');
