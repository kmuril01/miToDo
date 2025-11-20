# Responsive Todo App

A modern, clean, responsive todo-app built with HTML5, CSS3 and vanilla JavaScript.  
Supports full CRUD (add/edit/delete/complete), drag-and-drop reordering, task categorization (with color-coding), priority levels (low/medium/high), due dates with date-picker and reminder notifications, search & filter (status, category, date range), theme toggle (light/dark), and localStorage for persistence.

## Demo  
*(Add link or GIF if you have one)*  

## Features  
- Add, edit, delete tasks  
- Mark tasks as complete/undo  
- Task categories + color-coding  
- Priority levels: low / medium / high  
- Due dates via native date-picker  
- Reminder notification when due date reached  
- Drag & drop reordering using HTML5 Drag & Drop API  
- Search/filter by keyword, status, category, date range  
- Responsive layout: flexbox/grid + media queries  
- Dark/light theme toggle (respects system preference)  
- Smooth transitions and micro-interactions  
- Data persistence using `localStorage`

## Tech Stack / Built With  
- HTML5  
- CSS3 (Grid / Flexbox, media queries)  
- Vanilla JavaScript (ES6+)  
- Browser Web APIs: Drag & Drop, Notifications, localStorage  
- No external libraries or frameworks  

## Project Structure  
/responsive-todo-app
├── index.html
├── styles.css
├── app.js
├── README.md
└── tests/
└── taskLogic.test.js

## Setup & Running  
1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/responsive-todo-app.git
   cd responsive-todo-app
