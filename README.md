# ToDo List Application

## ✨ Live Demo

**[Link to Live Demo]**(https://todo-list-sample-six.vercel.app/)

## ⚙️ Getting Started

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/AndreyKondakov/todo-list-sample.git
cd todo-list-sample
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

## 🛠 Tech Stack

- React 18 (TypeScript)
- SCSS Modules
- Atlaskit Drag and Drop
- LocalStorage
- Fuse.js (smart search)
- Vite + ESLint + Prettier

## 📂 Structure description

Board.tsx – main logic of the board (state, search, drag&drop).
Column.tsx – working with the column (tasks, mass actions, drag&drop).
TaskCard.tsx – separate task card (editing, checkboxes, drag&drop).
FilterBar.tsx – filters and search.
