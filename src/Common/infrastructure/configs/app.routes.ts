// Root
const usersRoot = 'users';
const notesRoot = 'notes';
const notebooksRoot = 'notebooks';

// Api Versions
const v1 = '1';

export const routesV1 = {
  version: v1,
  userAccount: {
    root: usersRoot,
    login: `${usersRoot}/login`,
    register: `${usersRoot}/register`,
  },
  notes: {
    root: notesRoot,
    create: `${notesRoot}/create`,
    update: `${notesRoot}/update`,
    archive: `${notesRoot}/archive`,
    getById: `${notesRoot}/:id`,
  },
  notebooks: {
    root: notebooksRoot,
    create: `${notebooksRoot}/create`,
    rename: `${notebooksRoot}/rename`,
    addNote: `${notebooksRoot}/:id/add-note`,
    getById: `${notebooksRoot}/:id`,
  },
};
