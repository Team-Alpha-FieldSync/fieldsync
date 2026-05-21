# FieldSync — Web Client

This is the frontend client for FieldSync. It serves as the primary interface for both Technicians in the field and Administrators in the office. 

If the server is the "kitchen" that handles the data and business logic, this React application is the "dining area" where users interact with the system.

---

## 🛠 Tech Stack & Styling

- **Framework:** React
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Design System:** Custom high-saturation OKLCH color theme (defined in `src/styles/globals.css`). 

The application utilizes native Tailwind v4 `@theme` variables to ensure perfectly consistent foregrounds, backgrounds, borders, and semantic status colors across the entire platform.

---

## 🧱 UI Component Library

To maintain strict design consistency and keep the codebase clean, this project relies on a custom-built suite of highly reusable foundational UI components located in `src/components/ui/`. 

These components abstract away complex Tailwind strings and manage their own internal accessibility attributes.

### 1. `<Button />`
A fully accessible, multi-variant button component extending standard HTML button attributes.
- **Variants:** `primary`, `secondary`, `danger`, `ghost`
- **Sizes:** `small`, `medium`, `large`
- **Features:** Built-in `isLoading` state that automatically disables the button and injects an animated SVG spinner.

### 2. `<Input />`
A form input wrapper built with React's `forwardRef` to ensure compatibility with modern form-handling libraries.
- **Features:** - Auto-generates unique IDs using `useId()` for perfect label-to-input accessibility mapping.
  - Built-in `error` state that automatically renders validation messages and updates border colors to `--color-danger`.
  - Supports a `rightElement` prop (Adornment pattern) for seamless injection of icons, such as password visibility toggles.

### 3. `<StatusBadge />`
A domain-specific visual indicator (located in `src/components/StatusBadge.tsx`) used to communicate job states across dashboards and lists.
- **Supported Statuses:** `success`, `pending`, `error`, `in-progress`
- **Features:** Utilizes a dictionary pattern to instantly map database status strings to the correct OKLCH semantic colors. Automatically parses and formats backend strings (e.g., converting "in-progress" to "In Progress").

---

## 🚀 Core Features Implemented

- **Authentication Layout:** A responsive, split-screen `AuthLayout` that integrates the custom `<Input />` and `<Button />` components. 
- **State Management:** Uses a custom `useLoginRedirect` hook to securely handle email/password submission, loading states, and error boundary rendering without triggering page reloads.

---

## 💻 Local Development

To run the FieldSync client on your local machine:

1. Ensure you are in the `client/` directory.
2. Install the necessary dependencies:
   ```bash
   npm install