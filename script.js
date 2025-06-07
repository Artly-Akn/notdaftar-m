const notes = JSON.parse(localStorage.getItem('notes') || '[]');

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Ana sayfadaki notları listele
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

// Yeni not veya düzenleme formu
if (document.getElementById('noteForm')) {
  // Eğer düzenleme modundaysa alanları doldur
  const isEdit = localStorage.getItem('editMode') === 'true';
  const editIndex = localStorage.getItem('editIndex');

  if (isEdit) {
    document.getElementById('title').value = localStorage.getItem('editTitle');
    document.getElementById('content').value = localStorage.getItem('editContent');
  }

  document.getElementById('noteForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const date = new Date().toLocaleString();

    if (isEdit && editIndex !== null) {
      // Mevcut notu güncelle
      notes[editIndex] = { title, content, date };
      localStorage.removeItem('editMode');
      localStorage.removeItem('editIndex');
      localStorage.removeItem('editTitle');
      localStorage.removeItem('editContent');
    } else {
      // Yeni not ekle
      notes.push({ title, content, date });
    }

    saveNotes();
    window.location.href = 'index.html';
  });
}

// Not detay sayfası
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

// Not silme
function deleteNote(index) {
  if (confirm("Bu notu silmek istiyor musun?")) {
    notes.splice(index, 1);
    saveNotes();
    window.location.reload();
  }
}

// Not düzenleme
function editNote(index) {
  const note = notes[index];
  localStorage.setItem('editMode', 'true');
  localStorage.setItem('editIndex', index);
  localStorage.setItem('editTitle', note.title);
  localStorage.setItem('editContent', note.content);
  window.location.href = 'new.html';
}
