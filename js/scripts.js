// Selection
const notesContainer = document.querySelector("#notes-container");
const notesInput = document.querySelector("#note");
const btnAddNote = document.querySelector("#btn-add");

// Functions
const addNote = () => {
  const noteObj = {
    id: generateId(),
    text: notesInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObj.id, noteObj.text);
  notesContainer.appendChild(noteElement);
};

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

const createNote = (id, text) => {
  const template = `
    <div class="notes">
      <p class="note-name">${text}</p>
      <div class="options hide">
        <span class="delete"><i class="fa-solid fa-x"></i></span>
        <span class="copy"><i class="fa-solid fa-copy"></i></span>
      </div>
      <div class="fixed">
        <button class="btn-fixed">
          <i class="fa fa-thumb-tack" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    `;

  const parse = Range.prototype.createContextualFragment.bind(
    document.createRange()
  );

  return parse(template);
};

// Events
btnAddNote.addEventListener("click", () => addNote());
