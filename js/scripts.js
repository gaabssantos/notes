// Selection
const notesContainer = document.querySelector("#notes-container");

const notesInput = document.querySelector("#note");
const searchInput = document.querySelector("#search-notes input");

const btnAddNote = document.querySelector("#btn-add");
const btnExport = document.querySelector("#btn-export");

// Functions
const showNotes = () => {
  cleanNotes();

  getNotes().forEach((notes) => {
    const notesElement = createNote(notes.id, notes.text, notes.fixed);
    notesContainer.appendChild(notesElement);
  });
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

const addNote = () => {
  const notes = getNotes();

  const noteObj = {
    id: generateId(),
    text: notesInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObj.id, noteObj.text);
  notesContainer.appendChild(noteElement);

  notes.push(noteObj);

  saveNotes(notes);

  notesInput.value = "";
  notesInput.focus();
};

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

const createNote = (id, text, fixed) => {
  const element = document.createElement("div");
  element.classList.add("notes");

  if (fixed) {
    element.classList.add("fixed-notes");
  }

  const noteName = document.createElement("p");
  noteName.classList.add("note-name");
  noteName.innerHTML = text;

  const noteOptions = document.createElement("div");
  noteOptions.classList.add("options");

  const noteSpanDelete = document.createElement("span");
  noteSpanDelete.classList.add("delete");
  const noteIconDelete = document.createElement("i");
  noteIconDelete.classList = "fa-solid fa-x";

  noteSpanDelete.appendChild(noteIconDelete);

  const noteSpanEdit = document.createElement("span");
  noteSpanEdit.classList.add("copy");
  const noteIconEdit = document.createElement("i");
  noteIconEdit.classList = "fa-solid fa-copy";

  noteSpanEdit.appendChild(noteIconEdit);

  noteOptions.appendChild(noteSpanDelete);
  noteOptions.appendChild(noteSpanEdit);

  const noteFixed = document.createElement("div");
  noteFixed.classList.add("fixed");

  const noteFixedButton = document.createElement("button");
  noteFixedButton.classList.add("btn-fixed");
  const noteIconFixed = document.createElement("i");
  noteIconFixed.classList = "fa fa-thumb-tack";

  noteFixedButton.appendChild(noteIconFixed);
  noteFixed.appendChild(noteFixedButton);

  element.appendChild(noteName);
  element.appendChild(noteOptions);
  element.appendChild(noteFixed);

  element.querySelector(".fa-thumb-tack").addEventListener("click", () => {
    toggleFixNotes(id);
  });

  element.querySelector(".delete").addEventListener("click", () => {
    deleteNotes(id, element);
  });

  return element;
};

// Local Storage
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
};

const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const toggleFixNotes = (id) => {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  targetNotes.fixed = !targetNotes.fixed;

  saveNotes(notes);

  showNotes();
};

const deleteNotes = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNotes(notes);

  notesContainer.removeChild(element);
};

const exportData = () => {
  const notes = getNotes();

  const cvsString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.text, note.fixed]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const element = document.createElement("a");
  element.href = "data:text/cvs;charset=utf-8," + encodeURI(cvsString);
  element.target = "_blank";
  element.download = "notes.csv";
  element.click();
};

// Events
btnAddNote.addEventListener("click", () => addNote());

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value;

  const notes = getNotes().filter((note) => {
    return note.text.includes(searchValue);
  });

  if (searchValue != "") {
    cleanNotes();
    notes.forEach((note) => {
      const noteElement = createNote(note.id, note.text);
      notesContainer.appendChild(noteElement);
    });
    return;
  }
});

notesInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addNote();
});

btnExport.addEventListener("click", () => {
  exportData();
});

// Init
showNotes();
