const notes = JSON.parse(localStorage.getItem('notes') || '[]');

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

if (document.getElementById('noteList')) {
  const noteList = document.getElementById('noteList');
  if (notes.length === 0) {
    noteList.innerHTML = '<p>Henüz not eklenmedi.</p>';
  } else {
    notes.forEach((note, index) => {
      const div = document.createElement('div');
      div.className = 'note';
      div.innerHTML = `
        <a href="note.html?i=${index}">
          <h3>${note.title}</h3>
          <p>${note.content.slice(0, 100)}...</p>
        </a>
        <div class="note-actions">
          <button onclick="editNote(${index})">✏️</button>
          <button onclick="deleteNote(${index})">🗑️</button>
        </div>
      `;
      noteList.appendChild(div);
    });
  }
}

if (document.getElementById('noteForm')) {
  document.getElementById('noteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    notes.push({ title, content, date: new Date().toLocaleString() });
    saveNotes();
    window.location.href = 'index.html';
  });
}

if (window.location.pathname.includes('note.html')) {
  const i = new URLSearchParams(window.location.search).get('i');
  const note = notes[i];
  const container = document.getElementById('noteDetail');
  if (note) {
    container.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <small>${note.date}</small>
    `;
  } else {
    container.innerHTML = '<p>Not bulunamadı.</p>';
  }
}

function deleteNote(index) {
  if (confirm("Bu notu silmek istiyor musun?")) {
    notes.splice(index, 1);
    saveNotes();
    window.location.reload();
  }
}

function editNote(index) {
  const note = notes[index];
  localStorage.setItem('editIndex', index);
  localStorage.setItem('editMode', 'true');
  localStorage.setItem('editTitle', note.title);
  localStorage.setItem('editContent', note.content);
  window.location.href = 'new.html';
}

if (localStorage.getItem('editMode') === 'true') {
  const index = localStorage.getItem('editIndex');
  document.getElementById('title').value = localStorage.getItem('editTitle');
  document.getElementById('content').value = localStorage.getItem('editContent');

  document.getElementById('noteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    notes[index] = {
      title: document.getElementById('title').value,
      content: document.getElementById('content').value,
      date: new Date().toLocaleString()
    };
    saveNotes();
    localStorage.removeItem('editMode');
    window.location.href = 'index.html';
  });

  localStorage.removeItem('editMode');
}
