# Frontend API pages

This Quasar frontend has new simple pages that call the backend API at `http://localhost:8080`:

- `/students` - list students
- `/students/:id` - student detail
- `/teachers` - list teachers
- `/courses` - list courses
- `/cart` - student's cart (student id hardcoded as 1)
- `/orders` - student's orders (student id hardcoded as 1)

Run locally:

```bash
cd course-management
npm install
npm run dev
```

Notes:

- Axios baseURL is configured in `src/boot/axios.js`.
- The pages are basic and intended as starting points. Adjust endpoints and authentication as needed.
